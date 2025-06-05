"use client";

import { useState, useEffect, useMemo }from 'react';
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
import { Building, BookOpenText, CalendarDays, X } from 'lucide-react';

interface PaperFiltersProps {
  departments: Department[];
  subjects: Subject[];
  years: number[];
  onFilterChange: (filters: Filters) => void;
  currentFilters: Filters;
}

export function PaperFilters({
  departments,
  subjects,
  years,
  onFilterChange,
  currentFilters
}: PaperFiltersProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(currentFilters.department);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(currentFilters.subject);
  const [selectedYear, setSelectedYear] = useState<string | undefined>(currentFilters.year);

  useEffect(() => {
    onFilterChange({
      department: selectedDepartment,
      subject: selectedSubject,
      year: selectedYear,
    });
  }, [selectedDepartment, selectedSubject, selectedYear, onFilterChange]);
  
  // Update local state if currentFilters prop changes (e.g. from parent reset)
  useEffect(() => {
    setSelectedDepartment(currentFilters.department);
    setSelectedSubject(currentFilters.subject);
    setSelectedYear(currentFilters.year);
  }, [currentFilters]);


  const availableSubjects = useMemo(() => {
    if (!selectedDepartment) return [];
    return subjects.filter(subject => subject.departmentId === selectedDepartment);
  }, [selectedDepartment, subjects]);

  // If department changes, reset subject if it's no longer valid
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
    setSelectedSubject(undefined);
    setSelectedYear(undefined);
  };
  
  const hasActiveFilters = selectedDepartment || selectedSubject || selectedYear;

  return (
    <div className="p-6 bg-card rounded-lg shadow space-y-6 border">
      <h2 className="text-xl font-semibold text-foreground font-headline">Filter Papers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div>
          <Label htmlFor="department-select" className="flex items-center mb-2">
            <Building className="h-4 w-4 mr-2 text-primary" />
            Department
          </Label>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger id="department-select" className="w-full">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
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
            disabled={!selectedDepartment || availableSubjects.length === 0}
          >
            <SelectTrigger id="subject-select" className="w-full">
              <SelectValue placeholder={!selectedDepartment ? "Select Department First" : "Select Subject"} />
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

        <div>
          <Label htmlFor="year-select" className="flex items-center mb-2">
            <CalendarDays className="h-4 w-4 mr-2 text-primary" />
            Year
          </Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger id="year-select" className="w-full">
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
