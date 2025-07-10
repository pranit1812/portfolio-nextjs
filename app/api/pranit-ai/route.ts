import { NextRequest, NextResponse } from 'next/server';
import portfolioData from '../../../pranit-portfolio-json.json';
import { Redis } from '@upstash/redis';

// Redis client for persistent rate limiting
// Only initialize if valid URLs are provided (not placeholders)
let redis: Redis | null = null;
try {
  if (
    process.env.UPSTASH_REDIS_URL &&
    process.env.UPSTASH_REDIS_TOKEN &&
    process.env.UPSTASH_REDIS_URL.startsWith('https://') &&
    !process.env.UPSTASH_REDIS_URL.includes('your-upstash-redis-url')
  ) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
    console.log('Redis client initialized successfully');
  } else {
    console.log('Using in-memory rate limiting (Redis not configured)');
  }
} catch (error) {
  console.error('Failed to initialize Redis client:', error);
  // Continue with in-memory rate limiting
}

// Fallback to in-memory rate limit store if Redis is not configured
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 5; // 5 questions per IP per day
const WINDOW_MS = 1000 * 60 * 60 * 24; // 24 hours
const REDIS_TTL = 60 * 60 * 24; // 24 hours in seconds

type PortfolioChunk = {
  id: string;
  text: string;
  source: string;
  embedding: number[];
};

const portfolioChunks: PortfolioChunk[] = [];

/**
 * Creates context-based chunks from the portfolio data following these rules:
 * - Education as one chunk
 * - Technical Skills as one chunk
 * - Jobs as individual chunks
 * - Projects as individual chunks
 * - Contact information as one chunk
 */
function createChunks() {
  // Personal Info with Contact as one chunk
  portfolioChunks.push({
    id: 'personal-info',
    text: `${portfolioData.personalInfo.name} is a ${portfolioData.personalInfo.title}. ${portfolioData.personalInfo.tagline} ${portfolioData.personalInfo.bio}`,
    source: 'Personal Info',
    embedding: []
  });
  
  // Contact as one chunk
  const contact = portfolioData.personalInfo.contact;
  portfolioChunks.push({
    id: 'contact',
    text: `Contact Information: Email: ${contact.email}, Phone: ${contact.phone}, LinkedIn: ${contact.linkedin}, GitHub: ${contact.github}, Website: ${contact.website}. Location: ${portfolioData.personalInfo.location}. Availability: ${portfolioData.personalInfo.availability}`,
    source: 'Contact Information',
    embedding: []
  });

  // Education as one chunk
  const educationText = portfolioData.education
    .map(edu => `${edu.degree} from ${edu.institution} (${edu.location}) during ${edu.duration}. Focus areas: ${edu.focus_areas.join(', ')}. GPA: ${edu.gpa}`)
    .join('\n\n');
  
  portfolioChunks.push({
    id: 'education',
    text: `Education: ${educationText}`,
    source: 'Education',
    embedding: []
  });

  // Technical Skills as one chunk
  const skillsText = Object.entries(portfolioData.technical_skills)
    .map(([category, skills]) => {
      return `${category.replace(/_/g, ' ')}: ${skills.map((s: any) => s.name).join(', ')}`;
    })
    .join('. ');
  
  portfolioChunks.push({
    id: 'skills',
    text: skillsText,
    source: 'Technical Skills',
    embedding: []
  });

  // Jobs as individual chunks
  portfolioData.experience.forEach((exp) => {
    let achievementsText = '';
    if (exp.achievements && Array.isArray(exp.achievements)) {
      achievementsText = exp.achievements
        .map((ach: any) => ach.description || '')
        .filter(Boolean)
        .join(' ');
    }
    
    portfolioChunks.push({
      id: `job-${exp.id || exp.company}`,
      text: `${exp.title} at ${exp.company} (${exp.duration}): ${exp.summary || ''} ${achievementsText}`,
      source: `Experience: ${exp.company}`,
      embedding: []
    });
  });

  // Projects as individual chunks
  portfolioData.projects.forEach((project) => {
    let techStack = '';
    if (project.technologies) {
      techStack = Object.entries(project.technologies)
        .map(([category, techs]) => `${category}: ${Array.isArray(techs) ? techs.join(', ') : techs}`)
        .join('. ');
    }
    
    portfolioChunks.push({
      id: `project-${project.id || project.title}`,
      text: `Project: ${project.title} (${project.duration}) - ${project.description}. ${techStack} ${project.business_value || ''}`,
      source: `Project: ${project.title}`,
      embedding: []
    });
  });

  // Publications if available
  if (portfolioData.publications && portfolioData.publications.length > 0) {
    portfolioData.publications.forEach((pub) => {
      portfolioChunks.push({
        id: `publication-${pub.title}`,
        text: `Publication: ${pub.title} (${pub.venue}). ${pub.impact || ''}`,
        source: `Publication: ${pub.title}`,
        embedding: []
      });
    });
  }
  
  console.log(`Created ${portfolioChunks.length} context-based chunks`);
}

// Initialize chunks
portfolioChunks.length = 0;
createChunks();

/**
 * Enhanced findRelevantChunks function that uses semantic understanding
 * to better match questions with the most relevant chunks.
 *
 * Improvements:
 * 1. Recognizes semantic categories (education, work, skills, etc.)
 * 2. Special handling for education questions (especially "where" questions)
 * 3. Boosts scores for chunks that match the query's semantic categories
 * 4. Maintains keyword matching for general relevance
 */
function findRelevantChunks(query: string, count: number = 3): PortfolioChunk[] {
  // Normalize the query
  const normalizedQuery = query.toLowerCase();
  
  // Define semantic categories and their related terms
  const semanticCategories = {
    education: ['education', 'degree', 'university', 'college', 'school', 'study', 'studied', 'graduate', 'graduated', 'masters', 'bachelor', 'phd', 'major', 'gpa', 'academic', 'student'],
    work: ['work', 'job', 'career', 'employment', 'company', 'experience', 'role', 'position', 'professional', 'industry', 'employer'],
    skills: ['skill', 'technology', 'tech', 'framework', 'language', 'programming', 'tool', 'proficiency', 'expertise', 'competency', 'ability'],
    projects: ['project', 'portfolio', 'developed', 'built', 'created', 'implemented', 'application', 'system', 'solution', 'product'],
    contact: ['contact', 'email', 'phone', 'linkedin', 'github', 'website', 'reach', 'connect', 'message', 'availability']
  };
  
  // Determine which semantic categories the query belongs to
  const queryCategories = Object.entries(semanticCategories).filter(([category, terms]) => {
    return terms.some(term => normalizedQuery.includes(term));
  }).map(([category]) => category);
  
  // Special case for education-related questions about location
  if (normalizedQuery.includes('where') &&
      (normalizedQuery.includes('study') || normalizedQuery.includes('education') ||
       normalizedQuery.includes('degree') || normalizedQuery.includes('masters') ||
       normalizedQuery.includes('bachelor'))) {
    queryCategories.push('education');
  }
  
  // Score chunks based on semantic matching and keyword presence
  const scoredChunks = portfolioChunks.map(chunk => {
    const chunkText = chunk.text.toLowerCase();
    const chunkSource = chunk.source.toLowerCase();
    let score = 0;
    
    // Boost score for chunks that match the semantic categories
    queryCategories.forEach(category => {
      if (chunkSource.includes(category) ||
          (category === 'education' && chunkSource.includes('education')) ||
          (category === 'work' && chunkSource.includes('experience')) ||
          (category === 'contact' && chunkSource.includes('contact'))) {
        score += 5; // Significant boost for category match
      }
    });
    
    // Add score for keyword matches
    const queryWords = normalizedQuery.split(/\s+/);
    queryWords.forEach(word => {
      if (word.length > 3 && chunkText.includes(word)) {
        score += 1;
      }
    });
    
    // Special handling for education questions
    if (normalizedQuery.includes('masters') ||
        (normalizedQuery.includes('where') && normalizedQuery.includes('study')) ||
        (normalizedQuery.includes('where') && normalizedQuery.includes('degree'))) {
      if (chunkSource.includes('education')) {
        score += 10; // Very high boost for education questions
      }
    }
    
    return { chunk, score };
  });
  
  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(item => item.chunk);
}

function simulateEmbedding(text: string): number[] {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  const arr = [];
  for (let i = 0; i < 16; i++) {
    arr.push(((hash >> (i % 8)) & 0xff) / 255);
  }
  return arr;
}

/**
 * Check rate limit using Redis if available, with fallback to in-memory
 */
async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  // Use Redis if available
  if (redis) {
    try {
      const key = `ratelimit:${ip}`;
      
      // Get current count or initialize
      let count = await redis.incr(key);
      
      // Set expiry if this is a new key
      if (count === 1) {
        await redis.expire(key, REDIS_TTL);
      }
      
      const remaining = Math.max(0, RATE_LIMIT - count);
      return {
        allowed: count <= RATE_LIMIT,
        remaining
      };
    } catch (error) {
      console.error('Redis error:', error);
      // Fall back to in-memory if Redis fails
    }
  }
  
  // In-memory fallback
  const now = Date.now();
  const rl = rateLimitMap.get(ip) || { count: 0, lastReset: now };
  
  // Reset if window has passed
  if (now - rl.lastReset > WINDOW_MS) {
    rl.count = 0;
    rl.lastReset = now;
  }
  
  // Increment and store
  rl.count++;
  rateLimitMap.set(ip, rl);
  
  const remaining = Math.max(0, RATE_LIMIT - rl.count);
  return {
    allowed: rl.count <= RATE_LIMIT,
    remaining
  };
}

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    
    // Validate question
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json({
        error: 'Please provide a valid question.',
        remaining: 5
      }, { status: 400 });
    }
    
    // Check rate limit
    const { allowed, remaining } = await checkRateLimit(ip);
    
    if (!allowed) {
      return NextResponse.json({
        error: 'Rate limit exceeded. You can ask 5 questions per day. Please try again tomorrow.',
        remaining: 0
      }, { status: 429 });
    }

    // Find relevant chunks using our simulated RAG
    const relevantChunks = findRelevantChunks(question);
    const context = relevantChunks.map(chunk => chunk.text).join('\n\n');

    // Call OpenAI with the retrieved context
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY || OPENAI_API_KEY.includes('your-openai-api-key')) {
      console.error('OpenAI API key not properly configured');
      // Return a mock response for development
      const mockAnswer = `This is a mock response since the OpenAI API key is not configured.
      Based on the context, I would answer your question about "${question}" using information from Pranit's portfolio.`;
      
      const embedding = simulateEmbedding(question);
      
      return NextResponse.json({
        answer: mockAnswer,
        embedding,
        retrievedChunks: relevantChunks.map(({ id, text, source }) => ({ id, text, source })),
        question,
        context,
        remaining,
        totalChunks: portfolioChunks.length
      });
    }

    try {
      const systemPrompt = `You are Pranit.AI, a Gen AI engineer and startup leader. Answer questions about Pranit Sehgal's resume, projects, and experience in a concise, professional, and friendly manner. Keep your responses brief and to the point. If the question is about contacting Pranit, provide the contact info from the portfolio.

Use the following information to answer the user's question:
${context}

If you don't know the answer based on the provided information, say so politely without making up information.`;

      const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question }
          ],
          max_tokens: 400, // Reduced for more concise answers
          temperature: 0.7
        })
      });

      if (!openaiRes.ok) {
        const error = await openaiRes.json();
        console.error('OpenAI API error:', error);
        return NextResponse.json({
          error: error.error?.message || 'OpenAI error',
          remaining
        }, { status: 500 });
      }
      
      const data = await openaiRes.json();
      const answer = data.choices?.[0]?.message?.content || 'Sorry, I could not generate an answer.';
      const embedding = simulateEmbedding(question);

      return NextResponse.json({
        answer,
        embedding,
        retrievedChunks: relevantChunks.map(({ id, text, source }) => ({ id, text, source })),
        question,
        context, // for debugging
        remaining, // Return remaining questions count
        totalChunks: portfolioChunks.length // Total number of chunks for visualization
      });
    } catch (openaiError: any) {
      console.error('Error calling OpenAI:', openaiError);
      return NextResponse.json({
        error: 'Error generating response. Please try again later.',
        remaining
      }, { status: 500 });
    }
  } catch (err: any) {
    console.error('General API error:', err);
    return NextResponse.json({
      error: err.message || 'Unknown error',
      remaining: 5 // Default to 5 if we can't determine the actual count
    }, { status: 500 });
  }
}