import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, X } from "lucide-react";
import { extractPdfText } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface UploadZoneProps {
  onTextChange: (text: string) => void;
  resumeText: string;
}

export function UploadZone({ onTextChange, resumeText }: UploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadedFileName(file.name);

    try {
      const extractedText = await extractPdfText(file);
      onTextChange(extractedText);
      toast({
        title: "PDF uploaded successfully",
        description: "Text has been extracted from your PDF.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to process PDF file.",
        variant: "destructive",
      });
      setUploadedFileName(null);
    } finally {
      setIsUploading(false);
    }
  }, [onTextChange, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: isUploading
  });

  const clearFile = () => {
    setUploadedFileName(null);
    onTextChange("");
  };

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Upload className="w-5 h-5 text-primary mr-3" />
          <h3 className="text-xl font-semibold text-foreground">Upload Your Resume</h3>
        </div>

        {/* Drag and Drop Zone */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
            ${isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary hover:bg-primary/5'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          data-testid="upload-zone"
        >
          <input {...getInputProps()} data-testid="file-input" />
          <div className="flex flex-col items-center">
            {isUploading ? (
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            ) : (
              <Upload className="w-10 h-10 text-muted-foreground mb-4" />
            )}
            
            {uploadedFileName ? (
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{uploadedFileName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  data-testid="clear-file-button"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <p className="text-foreground font-medium mb-2">
                {isDragActive ? "Drop your PDF here" : "Drop your PDF here or click to browse"}
              </p>
            )}
            
            <p className="text-sm text-muted-foreground mb-4">
              {isUploading ? "Extracting text..." : "Supports PDF files up to 10MB"}
            </p>
            
            {!uploadedFileName && !isUploading && (
              <Button variant="outline" data-testid="browse-button">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            )}
          </div>
        </div>

        {/* Alternative Text Input */}
        <div className="border-t border-border pt-6 mt-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Or paste your resume text:</h4>
          <Textarea
            placeholder="Paste your resume content here..."
            value={resumeText}
            onChange={(e) => onTextChange(e.target.value)}
            className="min-h-32 resize-none"
            data-testid="resume-text-input"
          />
        </div>
      </CardContent>
    </Card>
  );
}
