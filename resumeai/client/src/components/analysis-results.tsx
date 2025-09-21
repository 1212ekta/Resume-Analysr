import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Star, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Mail, 
  HelpCircle, 
  Linkedin,
  Copy,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AnalysisResult } from "@shared/schema";

interface AnalysisResultsProps {
  analysis: AnalysisResult & { id: string };
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${type} has been copied to your clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="animate-in slide-in-from-bottom-4 duration-500" id="results-section">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">Analysis Results</h2>
        <p className="text-muted-foreground">Comprehensive AI-powered insights for your resume</p>
      </div>

      <div className="grid gap-8">
        {/* Professional Summary */}
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Professional Summary</h3>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-foreground leading-relaxed" data-testid="summary-text">
                {analysis.summary}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Resume Rating */}
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Resume Rating</h3>
              </div>
              <div className="flex items-center bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                <span className="text-2xl font-bold text-primary mr-2" data-testid="rating-score">
                  {analysis.rating}
                </span>
                <span className="text-sm text-foreground/70 font-medium">/ 10</span>
              </div>
            </div>
            <p className="text-muted-foreground" data-testid="rating-explanation">
              {analysis.ratingExplanation}
            </p>
          </CardContent>
        </Card>

        {/* Skills & Highlights */}
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Skills & Highlights</h3>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4" data-testid="skills-list">
              {analysis.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="border-t border-border pt-4">
              <h4 className="font-medium text-foreground mb-3">Key Achievements:</h4>
              <ul className="space-y-2" data-testid="highlights-list">
                {analysis.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout for Job Match and Suggestions */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Job Match Score */}
          {analysis.matchScore !== undefined && (
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Job Match Score</h3>
                  </div>
                  <div className="flex items-center bg-primary/10 px-3 py-1 rounded-lg">
                    <span className="text-xl font-bold text-primary mr-1" data-testid="match-score">
                      {analysis.matchScore}
                    </span>
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Missing Keywords:</h4>
                    <div className="flex flex-wrap gap-2" data-testid="missing-keywords">
                      {analysis.missingKeywords.map((keyword, index) => (
                        <Badge key={index} variant="destructive" className="bg-destructive/10 text-destructive">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Improvement Suggestions */}
          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Improvement Suggestions</h3>
              </div>
              <ul className="space-y-3" data-testid="suggestions-list">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <TrendingUp className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Cover Letter & Interview Questions */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Cover Letter */}
          {analysis.coverLetter && (
            <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Tailored Cover Letter</h3>
                </div>
                <div className="bg-muted p-4 rounded-md max-h-64 overflow-y-auto">
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line" data-testid="cover-letter-text">
                    {analysis.coverLetter}
                  </p>
                </div>
                <Button
                  onClick={() => copyToClipboard(analysis.coverLetter!, "Cover letter")}
                  className="w-full mt-4 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  data-testid="copy-cover-letter-button"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Cover Letter
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Interview Questions */}
          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-4">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Interview Preparation</h3>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto" data-testid="interview-questions">
                {analysis.interviewQuestions.map((question, index) => (
                  <div key={index} className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium text-foreground mb-1">{index + 1}. Question:</p>
                    <p className="text-sm text-muted-foreground">{question}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* LinkedIn Profile Summary */}
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <Linkedin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">LinkedIn Profile Summary</h3>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line" data-testid="linkedin-summary-text">
                {analysis.linkedinSummary}
              </p>
            </div>
            <Button
              onClick={() => copyToClipboard(analysis.linkedinSummary, "LinkedIn summary")}
              className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="copy-linkedin-summary-button"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy LinkedIn Summary
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
