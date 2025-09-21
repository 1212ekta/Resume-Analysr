import { apiRequest } from "./queryClient";
import type { AnalysisResult, AnalyzeResumeRequest } from "@shared/schema";

export async function extractPdfText(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await fetch('/api/extract-pdf', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to extract text from PDF');
  }

  const data = await response.json();
  return data.text;
}

export async function analyzeResume(data: AnalyzeResumeRequest): Promise<AnalysisResult & { id: string }> {
  const response = await apiRequest('POST', '/api/analyze-resume', data);
  return response.json();
}

export async function getAnalysis(id: string): Promise<AnalysisResult> {
  const response = await apiRequest('GET', `/api/analysis/${id}`);
  return response.json();
}
