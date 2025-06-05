
export interface Department {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  departmentId: string;
}

export interface Paper {
  id: string;
  title: string;
  departmentId: string;
  subjectId: string;
  year: number;
  fileUrl: string; 
  fileType: 'pdf' | 'docx' | 'txt';
}

export interface Filters {
  department: string | undefined;
  subject: string | undefined;
  year: string | undefined;
}
