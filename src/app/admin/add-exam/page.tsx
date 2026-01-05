"use client";

import { useState, useMemo, useEffect, type FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Building, BookOpenText, CalendarDays, ListOrdered, UploadCloud } from "lucide-react";
import { DEPARTMENTS, SUBJECTS, SEMESTERS } from "@/lib/constants";
import type { Subject as SubjectType } from '@/types';
import { useToast } from "@/hooks/use-toast";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2015 + 1 }, (_, i) => currentYear - i);

export default function AddExamPage() {
  const { toast } = useToast();
  const [paperTitle, setPaperTitle] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(currentYear.toString());
  const [selectedSemester, setSelectedSemester] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const availableSubjects = useMemo(() => {
    if (!selectedDepartment) return [];
    return SUBJECTS.filter(subject => subject.departmentId === selectedDepartment);
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedDepartment && selectedSubject) {
      const subjectStillValid = availableSubjects.some(sub => sub.id === selectedSubject);
      if (!subjectStillValid) {
        setSelectedSubject(undefined);
      }
    }
  }, [selectedDepartment, selectedSubject, availableSubjects]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    
console.log({ paperTitle, selectedDepartment, selectedSubject, selectedYear, selectedSemester, file });

    if (!paperTitle || !selectedDepartment || !selectedSubject || !selectedYear || !selectedSemester || !file) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields and select a file.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", paperTitle);
      formData.append("departmentId", selectedDepartment);
      formData.append("subjectId", selectedSubject);
      formData.append("year", selectedYear);
      formData.append("semester", selectedSemester);
      formData.append("file", file);

      const res = await fetch("/api/papers", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      toast({
        title: "Exam Paper Added",
        description: `Paper "${data.title}" uploaded successfully.`,
      });

      // Reset form
      setPaperTitle("");
      setSelectedDepartment(undefined);
      setSelectedSubject(undefined);
      setSelectedYear(currentYear.toString());
      setSelectedSemester(undefined);
      setFile(null);
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error uploading paper:", error);
      toast({
        title: "Upload Failed",
        description: "Something went wrong while uploading the paper.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Admin: Add Exam Paper</h1>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlusCircle className="mr-2 h-5 w-5 text-primary" />
            New Exam Paper Details
          </CardTitle>
          <CardDescription>
            Fill in the details below to add a new exam paper to the archive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="paper-title" className="mb-2 block">Paper Title</Label>
              <Input
                id="paper-title"
                value={paperTitle}
                onChange={(e) => setPaperTitle(e.target.value)}
                placeholder="e.g., Midterm Exam, Sessional Test 1"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="department-select" className="flex items-center mb-2">
                  <Building className="h-4 w-4 mr-2 text-primary" />
                  Department
                </Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment} disabled={isLoading}>
                  <SelectTrigger id="department-select">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject-select" className="flex items-center mb-2">
                  <BookOpenText className="h-4 w-4 mr-2 text-primary" />
                  Subject
                </Label>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                  disabled={!selectedDepartment || availableSubjects.length === 0 || isLoading}
                >
                  <SelectTrigger id="subject-select">
                    <SelectValue placeholder={!selectedDepartment ? "Select Department First" : (availableSubjects.length > 0 ? "Select Subject" : "No subjects for department")} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubjects.map((subj) => (
                      <SelectItem key={subj.id} value={subj.id}>
                        {subj.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
             // filters
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="year-select" className="flex items-center mb-2">
                  <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                  Year
                </Label>
                <Select value={selectedYear} onValueChange={setSelectedYear} disabled={isLoading}>
                  <SelectTrigger id="year-select">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="semester-select" className="flex items-center mb-2">
                  <ListOrdered className="h-4 w-4 mr-2 text-primary" />
                  Semester
                </Label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester} disabled={isLoading}>
                  <SelectTrigger id="semester-select">
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map((semester) => (
                      <SelectItem key={semester} value={semester.toString()}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="file-upload" className="flex items-center mb-2">
                <UploadCloud className="h-4 w-4 mr-2 text-primary" />
                Upload Paper (PDF, DOCX, TXT)
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="file:bg-primary file:text-primary-foreground file:font-semibold file:border-0 file:px-3 file:mr-4 file:rounded-l-md"
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Exam Paper
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
