# Pranit's Portfolio with RAG-Powered AI Assistant

A modern portfolio website featuring a glassmorphism UI design and an AI assistant powered by Retrieval Augmented Generation (RAG).

## Features

### 1. Glassmorphism UI
- Modern, translucent glass-like interface
- Dynamic blur effects and animations
- Responsive design for all devices
- Consistent theme across all pages

### 2. AI Assistant with RAG
- Chat with an AI about Pranit's experience, projects, and skills
- Powered by OpenAI's GPT-4
- Uses Retrieval Augmented Generation for accurate, context-aware responses
- Rate-limited to 5 questions per hour per user

### 3. RAG Visualization
- Educational visualization of how RAG works
- Step-by-step walkthrough of the RAG process:
  - Query filtering
  - Embedding generation
  - Vector search in 3D space
  - Context retrieval
  - AI response generation

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **AI**: OpenAI API, RAG implementation
- **Styling**: Glassmorphism design, custom animations
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `app/` - Next.js app router pages
- `components/` - Reusable React components
  - `chat/` - AI chat components
  - `ui/` - UI components like GlassCard
- `public/` - Static assets
- `lib/` - Utility functions
- `types/` - TypeScript type definitions

## Key Components

### GlassCard
A reusable component for creating glassmorphism UI elements with customizable intensity, hover effects, and border glow.

### ChatWidget
A floating chat widget that allows users to interact with the AI assistant from any page.

### RAGVisualization
An educational visualization that shows how RAG works in a slowed-down, step-by-step process.

## AI Implementation

The AI assistant uses a simplified RAG approach:
1. Portfolio data is pre-processed into chunks
2. When a user asks a question, relevant chunks are retrieved
3. These chunks are provided as context to the OpenAI API
4. The API generates a response based on the question and context

## License

MIT