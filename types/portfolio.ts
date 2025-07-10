export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  contact: {
    phone: string;
    email: string;
    linkedin: string;
    github: string;
    website: string;
  };
  availability: string;
  highlighted_achievements: string[];
}

export interface Achievement {
  description: string;
  impact: string;
  highlight_keywords: string[];
  business_value: string;
}

export interface Technologies {
  ai_frameworks?: string[];
  cloud_platforms?: string[];
  databases?: string[];
  programming?: string[];
  frontend?: string[];
  tools?: string[];
  platforms?: string[];
  visualization?: string[];
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  location: string;
  type: string;
  skills_used: string[];
  technologies: Technologies;
  achievements: Achievement[];
  business_impact: string;
  leadership_role: string;
}

export interface Project {
  id: string;
  title: string;
  duration: string;
  description: string;
  type: string;
  skills_used: string[];
  technologies: Technologies;
  achievements: string[];
  business_value: string;
  demo_available?: boolean;
  github_link?: string;
  client_impact?: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  duration: string;
  gpa: string;
  focus_areas: string[];
}

export interface Publication {
  title: string;
  venue: string;
  type: string;
  link: string;
  technologies: string[];
  impact: string;
}

export interface TechnicalSkill {
  name: string;
  level: string;
  icon: string;
}

export interface TechnicalSkills {
  programming_languages: TechnicalSkill[];
  ai_ml_frameworks: TechnicalSkill[];
  cloud_platforms: TechnicalSkill[];
  databases: TechnicalSkill[];
  tools_platforms: TechnicalSkill[];
  frontend_frameworks: TechnicalSkill[];
  data_visualization: TechnicalSkill[];
}

export interface ExpertiseArea {
  category: string;
  skills: string[];
}

export interface CareerHighlight {
  achievement: string;
  context: string;
  impact: string;
}

export interface AISkillMatcher {
  [key: string]: string[];
}

export interface PortfolioData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  projects: Project[];
  education: Education[];
  publications: Publication[];
  technical_skills: TechnicalSkills;
  areas_of_expertise: ExpertiseArea[];
  personality_traits: string[];
  career_highlights: CareerHighlight[];
  ai_skill_matcher_keywords: AISkillMatcher;
} 