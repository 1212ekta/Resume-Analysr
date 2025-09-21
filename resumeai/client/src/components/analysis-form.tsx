import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Sparkles } from "lucide-react";
import { UploadZone } from "./upload-zone";
import { analyzeResume } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { AnalysisResult } from "@shared/schema";

interface AnalysisFormProps {
  onAnalysisComplete: (result: AnalysisResult & { id: string }) => void;
}

export function AnalysisForm({ onAnalysisComplete }: AnalysisFormProps) {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: analyzeResume,
    onSuccess: (result) => {
      onAnalysisComplete(result);
      toast({
        title: "Analysis complete!",
        description: "Your resume has been successfully analyzed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze resume.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!resumeText.trim()) {
      toast({
        title: "Resume required",
        description: "Please upload a PDF or paste your resume text.",
        variant: "destructive",
      });
      return;
    }

    analyzeMutation.mutate({
      resumeText: resumeText.trim(),
      jobDescription: jobDescription.trim() || undefined,
    });
  };

  return (
    <section className="mb-16">
      <div className="grid lg:grid-cols-2 gap-8">
        <UploadZone onTextChange={setResumeText} resumeText={resumeText} />

        {/* Job Description Section */}
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Briefcase className="w-5 h-5 text-secondary mr-3" />
              <h3 className="text-xl font-semibold text-foreground">Job Description (Optional)</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Add a job description to get tailored analysis and match scoring
            </p>

            <Textarea
              placeholder="Paste the job description here to get personalized analysis..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-64 resize-none mb-6"
              data-testid="job-description-input"
            />

            <Button
              onClick={handleAnalyze}
              disabled={analyzeMutation.isPending || !resumeText.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="analyze-button"
            >
              {analyzeMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {analyzeMutation.isPending ? "Analyzing..." : "Analyze Resume"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
