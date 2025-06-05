"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadCloud, FileText, FileType2, FileQuestion } from "lucide-react";
import type { Paper } from '@/types';
import { DEPARTMENTS, SUBJECTS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";

interface PaperCardProps {
  paper: Paper;
}

const getFileIcon = (fileType: Paper['fileType']) => {
  switch (fileType) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-600" />;
    case 'docx':
      return <FileType2 className="h-5 w-5 text-blue-600" />;
    case 'txt':
      return <FileQuestion className="h-5 w-5 text-gray-600" />;
    default:
      return <FileQuestion className="h-5 w-5 text-gray-600" />;
  }
};

export function PaperCard({ paper }: PaperCardProps) {
  const department = DEPARTMENTS.find(d => d.id === paper.departmentId)?.name || 'N/A';
  const subject = SUBJECTS.find(s => s.id === paper.subjectId)?.name || 'N/A';
  const { toast } = useToast();

  const handleDownload = () => {
    // In a real app, this would trigger a download.
    // For now, it's a placeholder.
    toast({
      title: "Download Initiated",
      description: `Downloading ${paper.title}... (Placeholder)`,
    });
    window.open(paper.fileUrl, '_blank'); // Simulate opening file
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <CardHeader className="pb-2">
        <div className="relative w-full h-40 rounded-t-md overflow-hidden mb-2">
           <Image
            src={`https://placehold.co/400x200.png`}
            alt={paper.title}
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint="academic paper"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardTitle className="text-lg font-semibold leading-tight font-headline">{paper.title}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground pt-1">
          {getFileIcon(paper.fileType)}
          <span className="ml-1.5 uppercase">{paper.fileType}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-2 text-sm">
        <p><strong className="text-foreground">Department:</strong> {department}</p>
        <p><strong className="text-foreground">Subject:</strong> {subject}</p>
        <p><strong className="text-foreground">Year:</strong> {paper.year}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleDownload} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <DownloadCloud className="mr-2 h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
}
