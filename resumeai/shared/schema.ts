import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const resumeAnalyses = pgTable("resume_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  resumeText: text("resume_text").notNull(),
  jobDescription: text("job_description"),
  summary: text("summary"),
  rating: integer("rating"),
  ratingExplanation: text("rating_explanation"),
  skills: jsonb("skills").$type<string[]>(),
  highlights: jsonb("highlights").$type<string[]>(),
  matchScore: integer("match_score"),
  missingKeywords: jsonb("missing_keywords").$type<string[]>(),
  suggestions: jsonb("suggestions").$type<string[]>(),
  coverLetter: text("cover_letter"),
  interviewQuestions: jsonb("interview_questions").$type<string[]>(),
  linkedinSummary: text("linkedin_summary"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertResumeAnalysisSchema = createInsertSchema(resumeAnalyses).pick({
  resumeText: true,
  jobDescription: true,
});

export const analyzeResumeSchema = z.object({
  resumeText: z.string().min(1, "Resume text is required"),
  jobDescription: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertResumeAnalysis = z.infer<typeof insertResumeAnalysisSchema>;
export type ResumeAnalysis = typeof resumeAnalyses.$inferSelect;
export type AnalyzeResumeRequest = z.infer<typeof analyzeResumeSchema>;

export interface AnalysisResult {
  summary: string;
  rating: number;
  ratingExplanation: string;
  skills: string[];
  highlights: string[];
  matchScore?: number;
  missingKeywords?: string[];
  suggestions: string[];
  coverLetter?: string;
  interviewQuestions: string[];
  linkedinSummary: string;
}
