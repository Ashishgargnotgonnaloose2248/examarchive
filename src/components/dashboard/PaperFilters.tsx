"use client";

import { useState, useEffect, useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Department, Subject, Filters } from '@/types';
import { Building, BookOpenText, ListOrdered, X } from 'lucide-react';

interface PaperFiltersProps {
  departments: Department[];
  subjects: Subject[];
  semesters: number[];
  onFilterChange: (filters: Filters) => void;
  currentFilters: Filters;
}

export function PaperFilters({
  departments,
  subjects,
  semesters,
  onFilterChange,
  currentFilters
}: PaperFiltersProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(currentFilters.department);
  const [selectedSemester, setSelectedSemester] = useState<string | undefined>(currentFilters.semester);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(currentFilters.subject);

  useEffect(() => {
    onFilterChange({
      department: selectedDepartment,
      semester: selectedSemester,
      subject: selectedSubject,
    });
  }, [selectedDepartment, selectedSemester, selectedSubject, onFilterChange]);
  
  useEffect(() => {
    setSelectedDepartment(currentFilters.department);
    setSelectedSemester(currentFilters.semester);
    setSelectedSubject(currentFilters.subject);
  }, [currentFilters]);

  const availableSubjects = useMemo(() => {
    if (!selectedDepartment) return [];
    return subjects.filter(subject => subject.departmentId === selectedDepartment);
  }, [selectedDepartment, subjects]);

  useEffect(() => {
    if (selectedDepartment && selectedSubject) {
      const subjectStillValid = availableSubjects.some(sub => sub.id === selectedSubject);
      if (!subjectStillValid) {
        setSelectedSubject(undefined);
      }
    }
  }, [selectedDepartment, selectedSubject, availableSubjects]);

  const handleResetFilters = () => {
    setSelectedDepartment(undefined);
    setSelectedSemester(undefined);
    setSelectedSubject(undefined);
  };
  
  const hasActiveFilters = selectedDepartment || selectedSemester || selectedSubject;

  return (
    <div className="p-6 bg-card rounded-lg shadow space-y-6 border">
      <h2 className="text-xl font-semibold text-foreground font-headline">Filter Papers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* Department Select */}
        <div>
          <Label htmlFor="department-select" className="flex items-center mb-2">
            <Building className="h-4 w-4 mr-2 text-primary" />
            Department
          </Label>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger id="department-select" className="w-full">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent side="bottom">
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Semester Select */}
        <div>
          <Label htmlFor="semester-select" className="flex items-center mb-2">
            <ListOrdered className="h-4 w-4 mr-2 text-primary" />
            Semester
          </Label>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger id="semester-select" className="w-full">
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent side="bottom">
              {semesters.map((semester) => (
                <SelectItem key={semester} value={semester.toString()}>
                  Semester {semester}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subject Select */}
        <div>
          <Label htmlFor="subject-select" className="flex items-center mb-2">
            <BookOpenText className="h-4 w-4 mr-2 text-primary" />
            Subject
          </Label>
          <Select
            value={selectedSubject}
            onValueChange={setSelectedSubject}
            disabled={!selectedDepartment}
          >
            <SelectTrigger id="subject-select" className="w-full">
              <SelectValue placeholder={
                !selectedDepartment
                  ? "Select Department First"
                  : (availableSubjects.length > 0 ? "Select Subject" : "No subjects for department")
              } />
            </SelectTrigger>
            <SelectContent side="bottom">
              {availableSubjects.map((subj) => (
                <SelectItem key={subj.id} value={subj.id}>
                  {subj.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={handleResetFilters} className="mt-4">
          <X className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      )}
    </div>
  );
}
