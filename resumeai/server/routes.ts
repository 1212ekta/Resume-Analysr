import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import pdfParse from "pdf-parse";
import { storage } from "./storage";
import { analyzeResumeSchema } from "@shared/schema";
import { analyzeResumeComplete } from "./services/gemini";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Debug endpoint to check environment variables
  app.get('/api/debug/env', (req, res) => {
    res.json({
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasGoogleKey: !!process.env.GOOGLE_AI_API_KEY,
      nodeEnv: process.env.NODE_ENV,
      availableKeys: Object.keys(process.env).filter(key => 
        key.includes('API') || key.includes('GEMINI') || key.includes('GOOGLE')
      )
    });
  });
  // PDF upload and text extraction endpoint
  app.post('/api/extract-pdf', upload.single('pdf'), async (req: Request & { file?: Express.Multer.File }, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No PDF file provided' });
      }

      const pdfData = await pdfParse(req.file.buffer);
      const extractedText = pdfData.text.trim();

      if (!extractedText) {
        return res.status(400).json({ message: 'Could not extract text from PDF. Please ensure the PDF contains readable text.' });
      }

      res.json({ text: extractedText });
    } catch (error) {
      console.error('PDF extraction error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to extract text from PDF'
      });
    }
  });

  // Resume analysis endpoint
  app.post('/api/analyze-resume', async (req, res) => {
    try {
      const validatedData = analyzeResumeSchema.parse(req.body);
      
      // Perform AI analysis
      const analysisResult = await analyzeResumeComplete(
        validatedData.resumeText,
        validatedData.jobDescription
      );

      // Store the analysis
      const storedAnalysis = await storage.createResumeAnalysis({
        resumeText: validatedData.resumeText,
        jobDescription: validatedData.jobDescription,
        ...analysisResult
      });

      res.json({
        id: storedAnalysis.id,
        ...analysisResult
      });
    } catch (error) {
      console.error('Resume analysis error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'ZodError') {
          return res.status(400).json({ message: 'Invalid request data', details: error.message });
        }
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred during analysis' });
      }
    }
  });

  // Get analysis by ID
  app.get('/api/analysis/:id', async (req, res) => {
    try {
      const analysis = await storage.getResumeAnalysis(req.params.id);
      
      if (!analysis) {
        return res.status(404).json({ message: 'Analysis not found' });
      }

      res.json(analysis);
    } catch (error) {
      console.error('Get analysis error:', error);
      res.status(500).json({ message: 'Failed to retrieve analysis' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
