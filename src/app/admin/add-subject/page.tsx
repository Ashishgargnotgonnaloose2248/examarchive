"use client";

import { useEffect, useState, type FormEvent } from "react";
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
import { BookPlus, Building, ListOrdered, BookOpenText, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function AddSubjectPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);
  const [selectedSemester, setSelectedSemester] = useState<string | undefined>(undefined);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch departments from backend server
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch("/api/department");
        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        console.error("Failed to load departments", err);
        toast({
          title: "Error",
          description: "Could not fetch departments.",
          variant: "destructive",
        });
      }
    };

    fetchDepartments();
  }, [toast]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!selectedDepartment || !newSubjectName.trim() || !subjectId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter subject ID, name and select department.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: subjectId.trim(),
          name: newSubjectName.trim(),
          departmentId: selectedDepartment,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add subject");
      }

      toast({
        title: "Subject Added",
        description: `Subject "${newSubjectName}" added successfully.`,
      });

      // Reset form
      setNewSubjectName("");
      setSubjectId("");
      setSelectedDepartment(undefined);
      setSelectedSemester(undefined);
      router.push("/admin/add-subject");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to add subject.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin: Add Subject</h1>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookPlus className="mr-2 h-5 w-5 text-primary" />
            New Subject Details
          </CardTitle>
          <CardDescription>
            Fill in the details below to add a new subject.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="department-select" className="flex items-center mb-2">
                  <Building className="h-4 w-4 mr-2 text-primary" />
                  Department
                </Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment} disabled={isLoading}>
                  <SelectTrigger id="department-select" className="w-full">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent side="bottom" align="start">
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="semester-select" className="flex items-center mb-2">
                  <ListOrdered className="h-4 w-4 mr-2 text-primary" />
                  Semester (optional)
                </Label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester} disabled={isLoading}>
                  <SelectTrigger id="semester-select" className="w-full">
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent side="bottom" align="start">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                      <SelectItem key={semester} value={semester.toString()}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="subject-id" className="flex items-center mb-2">
                <KeyRound className="h-4 w-4 mr-2 text-primary" />
                Subject ID
              </Label>
              <Input
                id="subject-id"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                placeholder="e.g., CS201"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="subject-name" className="flex items-center mb-2">
                <BookOpenText className="h-4 w-4 mr-2 text-primary" />
                Subject Name
              </Label>
              <Input
                id="subject-name"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="e.g., Operating Systems"
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
                  Adding...
                </>
              ) : (
                <>
                  <BookPlus className="mr-2 h-4 w-4" />
                  Add Subject
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
