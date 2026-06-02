/**
 * Type declarations for the portfolio
 */

export type PageView = "home" | "about" | "projects" | "contact";

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  role: string;
  duration: string;
  academicContext: string;
  demoUrl?: string;
  repoUrl?: string;
  iconName: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  courses: string[];
  gpa?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}
