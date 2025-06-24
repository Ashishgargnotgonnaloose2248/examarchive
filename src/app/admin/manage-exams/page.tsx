
"use client";

import { useState, useMemo, useEffect, type FormEvent, type ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
import { Edit3, Building, BookOpenText, ListOrdered, CalendarDays, Search, X, Info, FileText, UploadCloud, LinkIcon } from "lucide-react";
import { DEPARTMENTS, SUBJECTS, SEMESTERS, } from "@/lib/constants";
import type { Paper } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2015 + 1 }, (_, i) => currentYear - i);
const fetchFilteredPapers = async ({
  departmentId,
  semester,
  year,
  subjectId,
}: {
  departmentId: string;
  semester: number;
  year: number;
  subjectId: string;
}) => {
  const res = await fetch("/api/papers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ departmentId, semester, year, subjectId }),
  });

  const data = await res.json();
  return data.papers || [];
};

interface Filters {
  department: string | undefined;
  subject: string | undefined;
  semester: string | undefined;
  year: string | undefined;
}

interface EditFormData extends Omit<Paper, 'id' | 'fileType' | 'fileUrl'> {
  id?: string;
  fileUrl?: string;
  fileType?: Paper['fileType'];
  newFile?: File | null;
}


export default function ManageExamPage() {
  const { toast } = useToast();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [filters, setFilters] = useState<Filters>({
    department: undefined,
    subject: undefined,
    semester: undefined,
    year: undefined,
  });
  useEffect(() => {
  const fetchPapers = async () => {
    try {
      const res = await fetch("/api/papers");
      if (!res.ok) throw new Error("Failed to fetch papers");
      const data = await res.json();
      setPapers(data);
    } catch (err) {
      console.error("❌ Failed to load papers:", err);
    }
  };
  fetchPapers();
}, []);

  
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredExams, setFilteredExams] = useState<Paper[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: "",
    departmentId: "",
    subjectId: "",
    semester: 1,
    year: currentYear,
    newFile: null,
  });

  const availableSubjectsForFilter = useMemo(() => {
    if (!filters.department) return SUBJECTS;
    return SUBJECTS.filter(subject => subject.departmentId === filters.department);
  }, [filters.department]);

  const availableSubjectsForEdit = useMemo(() => {
    if (!editFormData.departmentId) return [];
    return SUBJECTS.filter(subject => subject.departmentId === editFormData.departmentId);
  }, [editFormData.departmentId]);

  useEffect(() => {
    if (filters.department && filters.subject) {
      const subjectStillValid = availableSubjectsForFilter.some(sub => sub.id === filters.subject);
      if (!subjectStillValid) {
        setFilters(prev => ({ ...prev, subject: undefined }));
      }
    }
  }, [filters.department, filters.subject, availableSubjectsForFilter]);

   useEffect(() => {
    if (editingPaper && editFormData.departmentId && editFormData.subjectId) {
      const subjectStillValidInEdit = availableSubjectsForEdit.some(sub => sub.id === editFormData.subjectId);
      if (!subjectStillValidInEdit) {
        setEditFormData(prev => ({ ...prev, subjectId: "" }));
      }
    }
  }, [editingPaper, editFormData.departmentId, editFormData.subjectId, availableSubjectsForEdit]);


  const handleFilterChange = (filterName: keyof Filters, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    if (filterName === 'department' && !value) { 
      setFilters(prev => ({ ...prev, subject: undefined }));
    }
  };

  const handleSearch = (event?: FormEvent) => {
    if (event) event.preventDefault();
    setIsSearching(true);
    setHasSearched(true);
    
    const results = papers.filter(paper => {
        const departmentMatch = !filters.department || paper.departmentId === filters.department;
        const subjectMatch = !filters.subject || paper.subjectId === filters.subject;
        const semesterMatch = !filters.semester || paper.semester.toString() === filters.semester;
        const yearMatch = !filters.year || (paper.year && paper.year.toString() === filters.year);
        return departmentMatch && subjectMatch && semesterMatch && yearMatch;
    });

    setTimeout(() => {
        setFilteredExams(results);
        setIsSearching(false);
        if(results.length === 0) {
            toast({
                title: "No Exams Found",
                description: "No exams matched your filter criteria.",
                variant: "default"
            })
        }
    }, 500);
  };

  const handleResetFilters = () => {
    setFilters({
      department: undefined,
      subject: undefined,
      semester: undefined,
      year: undefined,
    });
    setFilteredExams([]);
    setHasSearched(false);
  };
  
  const hasActiveFilters = Object.values(filters).some(val => val !== undefined);

  const handleEditClick = (paper: Paper) => {
    setEditingPaper(paper);
    setEditFormData({
      id: paper.id,
      title: paper.title,
      departmentId: paper.departmentId,
      subjectId: paper.subjectId,
      semester: paper.semester,
      year: paper.year || currentYear,
      fileUrl: paper.fileUrl,
      fileType: paper.fileType,
      newFile: null,
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditFormSelectChange = (name: keyof EditFormData, value: string | number) => {
    setEditFormData(prev => ({ ...prev, [name]: value }));
     if (name === 'departmentId') {
        setEditFormData(prev => ({ ...prev, subjectId: "" })); 
    }
  };
  
  const handleEditFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setEditFormData(prev => ({ ...prev, newFile: event.target.files![0] }));
    } else {
      setEditFormData(prev => ({ ...prev, newFile: null }));
    }
  };

  const handleSaveChanges = async () => {
  if (!editingPaper || !editFormData.id) return;
  setIsLoading(true);

  try {
    const formData = new FormData();
    formData.append("id", editFormData.id);
    formData.append("title", editFormData.title);
    formData.append("year", editFormData.year.toString());
    formData.append("semester", editFormData.semester.toString());
    formData.append("subjectId", editFormData.subjectId);
    formData.append("departmentId", editFormData.departmentId);
    if (editFormData.newFile) {
      formData.append("file", editFormData.newFile);
    }

    const res = await fetch("/api/update-paper", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to update paper");

    const updated = await res.json();

    toast({
      title: "Updated",
      description: "Paper updated successfully.",
    });

    setPapers((prev) => prev.map(p => p.id === updated.paper.id ? updated.paper : p));
    setFilteredExams((prev) => prev.map(p => p.id === updated.paper.id ? updated.paper : p));
    setIsEditModalOpen(false);
    setEditingPaper(null);
  } catch (err) {
    console.error("❌ Update failed", err);
    toast({
      title: "Update Failed",
      description: "There was a problem updating the paper.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};




  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Admin: Manage Exam Papers</h1>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5 text-primary" />
            Filter Existing Exam Papers
          </CardTitle>
          <CardDescription>
            Use the filters below to find specific exam papers to manage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <Label htmlFor="filter-department-select" className="flex items-center mb-2">
                  <Building className="h-4 w-4 mr-2 text-primary" />
                  Department
                </Label>
                <Select 
                    value={filters.department} 
                    onValueChange={(value) => handleFilterChange('department', value === 'all' ? undefined : value)} 
                    disabled={isSearching}
                >
                  <SelectTrigger id="filter-department-select">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent side="bottom" align="start">
                    <SelectItem value="all">All Departments</SelectItem>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filter-subject-select" className="flex items-center mb-2">
                  <BookOpenText className="h-4 w-4 mr-2 text-primary" />
                  Subject
                </Label>
                <Select
                  value={filters.subject}
                  onValueChange={(value) => handleFilterChange('subject', value === 'all' ? undefined : value)}
                  disabled={!filters.department || availableSubjectsForFilter.length === 0 || isSearching}
                >
                  <SelectTrigger id="filter-subject-select">
                    <SelectValue placeholder={!filters.department ? "Select Dept First" : (availableSubjectsForFilter.length > 0 ? "Select Subject" : "No subjects")} />
                  </SelectTrigger>
                  <SelectContent side="bottom" align="start">
                     <SelectItem value="all">All Subjects</SelectItem>
                    {availableSubjectsForFilter.map((subj) => (
                      <SelectItem key={subj.id} value={subj.id}>
                        {subj.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="filter-semester-select" className="flex items-center mb-2">
                  <ListOrdered className="h-4 w-4 mr-2 text-primary" />
                  Semester
                </Label>
                <Select 
                    value={filters.semester} 
                    onValueChange={(value) => handleFilterChange('semester', value === 'all' ? undefined : value)} 
                    disabled={isSearching}
                >
                  <SelectTrigger id="filter-semester-select">
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent side="bottom" align="start">
                    <SelectItem value="all">All Semesters</SelectItem>
                    {SEMESTERS.map((semester) => (
                      <SelectItem key={semester} value={semester.toString()}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="filter-year-select" className="flex items-center mb-2">
                  <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                  Year
                </Label>
                <Select 
                    value={filters.year} 
                    onValueChange={(value) => handleFilterChange('year', value === 'all' ? undefined : value)} 
                    disabled={isSearching}
                >
                  <SelectTrigger id="filter-year-select">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent side="bottom" align="start">
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-2">
                <Button type="submit" className="w-full md:w-auto" disabled={isSearching}>
                {isSearching ? (
                    <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                    </>
                ) : (
                    <>
                    <Search className="mr-2 h-4 w-4" />
                    Search Exams
                    </>
                )}
                </Button>
                {hasActiveFilters && (
                    <Button variant="outline" type="button" onClick={handleResetFilters} disabled={isSearching}>
                        <X className="mr-2 h-4 w-4" />
                        Reset Filters
                    </Button>
                )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Edit3 className="mr-2 h-5 w-5 text-primary" />
            Filtered Exam Papers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSearching && <p className="text-muted-foreground">Loading exam papers...</p>}
          {!isSearching && hasSearched && filteredExams.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-muted rounded-lg min-h-[150px]">
              <Info className="h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-1">No Exams Found</h3>
              <p className="text-muted-foreground text-sm">
                No exam papers matched your current filter criteria. Try adjusting your filters.
              </p>
            </div>
          )}
           {!isSearching && !hasSearched && (
            <p className="text-muted-foreground">
                Please apply filters and click "Search Exams" to see results.
            </p>
           )}
          {!isSearching && filteredExams.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Found {filteredExams.length} exam paper(s).</p>
              <ul className="space-y-3">
                {filteredExams.map(paper => (
                  <li key={paper.id} className="p-4 border rounded-lg bg-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex-grow">
                      <p className="font-semibold text-card-foreground text-base">{paper.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {DEPARTMENTS.find(d => d.id === paper.departmentId)?.name} - Sem {paper.semester} - {paper.year || 'N/A'}
                      </p>
                       <p className="text-xs text-muted-foreground">
                        Subject: {SUBJECTS.find(s => s.id === paper.subjectId)?.name}
                      </p>
                      <a
  href={`${paper.fileUrl}?fl_attachment=${encodeURIComponent(paper.title)}.${paper.fileType}`}
  download
  target="_blank"
  rel="noopener noreferrer"
  className="text-xs text-primary hover:underline mt-1 inline-flex items-center"
>
  <LinkIcon className="h-3 w-3 mr-1" /> Download Paper ({paper.fileType.toUpperCase()})
</a>

                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(paper)}>
                        <Edit3 className="mr-2 h-3 w-3" /> Edit
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Model */}
<Dialog
  open={isEditModalOpen}
  onOpenChange={(isOpen) => {
    if (!isOpen) {
      setEditingPaper(null);
    }
    setIsEditModalOpen(isOpen);
  }}
>
  <DialogContent className="sm:max-w-[800px] w-full max-w-[90vw]">
    <DialogHeader>
      <DialogTitle className="flex items-center">
        <Edit3 className="mr-2 h-5 w-5 text-primary" />
        Edit Exam Paper
      </DialogTitle>
      <DialogDescription>
        Modify the details for "{editingPaper?.title}". Click save when you're done.
      </DialogDescription>
    </DialogHeader>

    {editingPaper && (
      <div className="space-y-4 py-4 px-4 max-h-[60vh] overflow-y-auto no-scrollbar">
        <div>
          <Label htmlFor="edit-paper-title" className="mb-1">
            Paper Title
          </Label>
          <Input
            id="edit-paper-title"
            name="title"
            value={editFormData.title}
            onChange={handleEditFormInputChange}
            placeholder="e.g., Midterm Exam"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="edit-department-select" className="flex items-center mb-1">
              <Building className="h-4 w-4 mr-2 text-primary" /> Department
            </Label>
            <Select
              value={editFormData.departmentId}
              onValueChange={(value) => handleEditFormSelectChange("departmentId", value)}
              disabled={isLoading}
            >
              <SelectTrigger id="edit-department-select">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent side="bottom" align="start">
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-subject-select" className="flex items-center mb-1">
              <BookOpenText className="h-4 w-4 mr-2 text-primary" /> Subject
            </Label>
            <Select
              value={editFormData.subjectId}
              onValueChange={(value) => handleEditFormSelectChange("subjectId", value)}
              disabled={
                !editFormData.departmentId ||
                availableSubjectsForEdit.length === 0 ||
                isLoading
              }
            >
              <SelectTrigger id="edit-subject-select">
                <SelectValue
                  placeholder={
                    !editFormData.departmentId
                      ? "Select Dept First"
                      : availableSubjectsForEdit.length > 0
                      ? "Select Subject"
                      : "No subjects"
                  }
                />
              </SelectTrigger>
              <SelectContent side="bottom" align="start">
                {availableSubjectsForEdit.map((subj) => (
                  <SelectItem key={subj.id} value={subj.id}>
                    {subj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="edit-year-select" className="flex items-center mb-1">
              <CalendarDays className="h-4 w-4 mr-2 text-primary" /> Year
            </Label>
            <Select
              value={editFormData.year?.toString()}
              onValueChange={(value) => handleEditFormSelectChange("year", parseInt(value))}
              disabled={isLoading}
            >
              <SelectTrigger id="edit-year-select">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent side="bottom" align="start">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="edit-semester-select" className="flex items-center mb-1">
              <ListOrdered className="h-4 w-4 mr-2 text-primary" /> Semester
            </Label>
            <Select
              value={editFormData.semester?.toString()}
              onValueChange={(value) => handleEditFormSelectChange("semester", parseInt(value))}
              disabled={isLoading}
            >
              <SelectTrigger id="edit-semester-select">
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent side="bottom" align="start">
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
          <Label className="flex items-center mb-1">
            <LinkIcon className="h-4 w-4 mr-2 text-primary" /> Current Paper
          </Label>
          <a
            href={editingPaper.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline inline-flex items-center bg-muted px-3 py-2 rounded-md w-full"
          >
            <FileText className="h-4 w-4 mr-2" /> View/Download Current ({editingPaper.fileType?.toUpperCase()})
          </a>
        </div>

        <div>
          <Label htmlFor="edit-file-upload" className="flex items-center mb-1">
            <UploadCloud className="h-4 w-4 mr-2 text-primary" /> Change Paper (Optional)
          </Label>
          <Input
            id="edit-file-upload"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleEditFileChange}
            disabled={isLoading}
            className="text-sm"
          />
          {editFormData.newFile && (
            <p className="text-xs text-muted-foreground mt-1">
              Selected: {editFormData.newFile.name}
            </p>
          )}
        </div>
      </div>
    )}

    <DialogFooter className="pt-4">
      <DialogClose asChild>
        <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isLoading}>
          Cancel
        </Button>
      </DialogClose>
      <Button onClick={handleSaveChanges} disabled={isLoading || !editingPaper}>
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
</div>
);
}
