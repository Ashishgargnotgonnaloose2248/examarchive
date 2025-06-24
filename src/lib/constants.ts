
import type { Department, Subject, Paper } from '@/types';

export const DEPARTMENTS: Department[] = [
  { id: 'cse', name: 'Computer Science & Engineering' },
  { id: 'csd', name: 'Computer Science & Design'},
  { id: 'ece', name: 'Electronics & Communication Engineering' },
  { id: 'et', name: 'Electronics & Telecommunication' },
  { id: 'it', name: 'Information Technology'},
  { id: 'mac', name:'Mathematics & Computing' },
  { id: 'cm', name: 'Chemical Engineering'},
  { id: 'me', name: 'Mechanical Engineering' },
  { id: 'ce', name: 'Civil Engineering' },
  { id: 'ee', name: 'Electrical Engineering' },
  { id: 'io', name: 'IT-IOT'},
  { id: 'eo', name: 'EE-IOT'},
  { id: 'ir', name: 'IT-AIR' },
  { id: 'csbs', name: 'Computer Science and Business Systems'},
  { id: 'ai', name: 'Artificial Intelligence'},
  { id: 'am', name: 'Artificial Intelligence & Machine Learning'},
  { id: 'ad', name: 'Artificial Intelligence & Data Science'},
  
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

export const SEMESTERS: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

export const PAPERS: Paper[] = [
  { id: 'p1', title: 'Midterm Exam - Data Structures', departmentId: 'cse', subjectId: 'ds', semester: 3, year: 2023, fileUrl: '/papers/oops pyq[1].pdf', fileType: 'pdf' },
  { id: 'p2', title: 'Final Exam - Algorithms', departmentId: 'cse', subjectId: 'algo', semester: 4, year: 2022, fileUrl: '/papers/cse_algo_2022_final.pdf', fileType: 'pdf' },
  { id: 'p3', title: 'Quiz 1 - Operating Systems', departmentId: 'cse', subjectId: 'os', semester: 5, year: 2024, fileUrl: '/papers/cse_os_2024_q1.docx', fileType: 'docx' },
  { id: 'p4', title: 'Signals and Systems - End Sem', departmentId: 'ece', subjectId: 'signals', semester: 6, year: 2023, fileUrl: '/papers/ece_signals_2023_end.pdf', fileType: 'pdf' },
  { id: 'p5', title: 'Thermodynamics - Assignment', departmentId: 'me', subjectId: 'thermo', semester: 2, year: 2022, fileUrl: '/papers/me_thermo_2022_assign.txt', fileType: 'txt' },
  { id: 'p6', title: 'DBMS - Sessional Test 1', departmentId: 'cse', subjectId: 'dbms', semester: 5, year: 2023, fileUrl: '/papers/cse_dbms_2023_s1.pdf', fileType: 'pdf' },
  { id: 'p7', title: 'VLSI Design - Mid Sem', departmentId: 'ece', subjectId: 'vlsi', semester: 7, year: 2024, fileUrl: '/papers/ece_vlsi_2024_mid.pdf', fileType: 'pdf' },
  { id: 'p8', title: 'Data Structures - Final Exam', departmentId: 'cse', subjectId: 'ds', semester: 4, year: 2022, fileUrl: '/papers/cse_ds_2022_final.pdf', fileType: 'pdf' },
];

export const ADMIN_EMAIL = "admin@mitsgwl.ac.in";
