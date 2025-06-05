import type { Department, Subject, Paper } from '@/types';

export const DEPARTMENTS: Department[] = [
  { id: 'cse', name: 'Computer Science & Engineering' },
  { id: 'ece', name: 'Electronics & Communication Engineering' },
  { id: 'me', name: 'Mechanical Engineering' },
  { id: 'ce', name: 'Civil Engineering' },
  { id: 'ee', name: 'Electrical Engineering' },
];

export const SUBJECTS: Subject[] = [
  // CSE
  { id: 'ds', name: 'Data Structures', departmentId: 'cse' },
  { id: 'algo', name: 'Algorithms', departmentId: 'cse' },
  { id: 'dbms', name: 'Database Management Systems', departmentId: 'cse' },
  { id: 'os', name: 'Operating Systems', departmentId: 'cse' },
  // ECE
  { id: 'signals', name: 'Signals and Systems', departmentId: 'ece' },
  { id: 'vlsi', name: 'VLSI Design', departmentId: 'ece' },
  { id: 'comms', name: 'Communication Systems', departmentId: 'ece' },
  // ME
  { id: 'thermo', name: 'Thermodynamics', departmentId: 'me' },
  { id: 'fluid', name: 'Fluid Mechanics', departmentId: 'me' },
  // CE
  { id: 'som', name: 'Strength of Materials', departmentId: 'ce' },
  { id: 'survey', name: 'Surveying', departmentId: 'ce' },
  // EE
  { id: 'circuits', name: 'Circuit Theory', departmentId: 'ee' },
  { id: 'machines', name: 'Electrical Machines', departmentId: 'ee' },
];

export const YEARS: number[] = [2024, 2023, 2022, 2021, 2020];

export const PAPERS: Paper[] = [
  { id: 'p1', title: 'Midterm Exam - Data Structures', departmentId: 'cse', subjectId: 'ds', year: 2023, fileUrl: '/papers/cse_ds_2023_mid.pdf', fileType: 'pdf' },
  { id: 'p2', title: 'Final Exam - Algorithms', departmentId: 'cse', subjectId: 'algo', year: 2022, fileUrl: '/papers/cse_algo_2022_final.pdf', fileType: 'pdf' },
  { id: 'p3', title: 'Quiz 1 - Operating Systems', departmentId: 'cse', subjectId: 'os', year: 2024, fileUrl: '/papers/cse_os_2024_q1.docx', fileType: 'docx' },
  { id: 'p4', title: 'Signals and Systems - End Sem', departmentId: 'ece', subjectId: 'signals', year: 2023, fileUrl: '/papers/ece_signals_2023_end.pdf', fileType: 'pdf' },
  { id: 'p5', title: 'Thermodynamics - Assignment', departmentId: 'me', subjectId: 'thermo', year: 2022, fileUrl: '/papers/me_thermo_2022_assign.txt', fileType: 'txt' },
  { id: 'p6', title: 'DBMS - Sessional Test 1', departmentId: 'cse', subjectId: 'dbms', year: 2023, fileUrl: '/papers/cse_dbms_2023_s1.pdf', fileType: 'pdf' },
  { id: 'p7', title: 'VLSI Design - Mid Sem', departmentId: 'ece', subjectId: 'vlsi', year: 2024, fileUrl: '/papers/ece_vlsi_2024_mid.pdf', fileType: 'pdf' },
  { id: 'p8', title: 'Data Structures - Final Exam', departmentId: 'cse', subjectId: 'ds', year: 2022, fileUrl: '/papers/cse_ds_2022_final.pdf', fileType: 'pdf' },
];
