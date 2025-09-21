import { type User, type InsertUser, type ResumeAnalysis, type InsertResumeAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createResumeAnalysis(analysis: InsertResumeAnalysis & Partial<ResumeAnalysis>): Promise<ResumeAnalysis>;
  getResumeAnalysis(id: string): Promise<ResumeAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private resumeAnalyses: Map<string, ResumeAnalysis>;

  constructor() {
    this.users = new Map();
    this.resumeAnalyses = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createResumeAnalysis(analysis: InsertResumeAnalysis & Partial<ResumeAnalysis>): Promise<ResumeAnalysis> {
    const id = randomUUID();
    const resumeAnalysis: ResumeAnalysis = {
      id,
      resumeText: analysis.resumeText,
      jobDescription: analysis.jobDescription || null,
      summary: analysis.summary || null,
      rating: analysis.rating || null,
      ratingExplanation: analysis.ratingExplanation || null,
      skills: analysis.skills || null,
      highlights: analysis.highlights || null,
      matchScore: analysis.matchScore || null,
      missingKeywords: analysis.missingKeywords || null,
      suggestions: analysis.suggestions || null,
      coverLetter: analysis.coverLetter || null,
      interviewQuestions: analysis.interviewQuestions || null,
      linkedinSummary: analysis.linkedinSummary || null,
      createdAt: analysis.createdAt || new Date(),
    };
    this.resumeAnalyses.set(id, resumeAnalysis);
    return resumeAnalysis;
  }

  async getResumeAnalysis(id: string): Promise<ResumeAnalysis | undefined> {
    return this.resumeAnalyses.get(id);
  }
}

export const storage = new MemStorage();
