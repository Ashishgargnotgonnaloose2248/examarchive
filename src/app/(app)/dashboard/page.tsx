
"use client";

import { useState, useMemo, useCallback } from 'react';
import { PaperFilters } from '@/components/dashboard/PaperFilters';
import { PaperList } from '@/components/dashboard/PaperList';
import { PAPERS, DEPARTMENTS, SUBJECTS, YEARS } from '@/lib/constants';
import type { Filters, Paper } from '@/types';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  const [filters, setFilters] = useState<Filters>({
    department: undefined,
    subject: undefined,
    year: undefined,
  });

  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []); // setFilters is stable, so empty dependency array is fine

  const filteredPapers = useMemo(() => {
    return PAPERS.filter((paper) => {
      const departmentMatch = !filters.department || paper.departmentId === filters.department;
      const subjectMatch = !filters.subject || paper.subjectId === filters.subject;
      const yearMatch = !filters.year || paper.year.toString() === filters.year;
      return departmentMatch && subjectMatch && yearMatch;
    });
  }, [filters]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-headline">Question Paper Archive</h1>
        <p className="text-muted-foreground">
          Find and download previous year question papers for your department and subjects.
        </p>
      </div>
      <Separator />
      <PaperFilters
        departments={DEPARTMENTS}
        subjects={SUBJECTS}
        years={YEARS}
        onFilterChange={handleFilterChange}
        currentFilters={filters}
      />
      <PaperList papers={filteredPapers} />
    </div>
  );
}
