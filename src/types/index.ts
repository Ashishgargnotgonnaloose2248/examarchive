
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
  semester: number;
  year: number; // Added optional year
  fileUrl: string;
  fileType: 'pdf' | 'docx' | 'txt';
}

export interface Filters {
  department: string | undefined;
  semester: string | undefined;
  subject: string | undefined;
}
