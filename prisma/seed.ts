import { PrismaClient } from '@prisma/client';
import { DEPARTMENTS, SUBJECTS, PAPERS } from '../src/lib/constants';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed Departments
  for (const dept of DEPARTMENTS) {
    await prisma.department.upsert({
      where: { id: dept.id },
      update: {},
      create: {
        id: dept.id,
        name: dept.name,
      },
    });
  }

  // Seed Subjects
  for (const subj of SUBJECTS) {
    await prisma.subject.upsert({
      where: { id: subj.id },
      update: {},
      create: {
        id: subj.id,
        name: subj.name,
        departmentId: subj.departmentId,
      },
    });
  }

  // Seed Papers
  for (const paper of PAPERS) {
    await prisma.paper.upsert({
      where: { id: paper.id },
      update: {},
      create: {
        id: paper.id,
        title: paper.title,
        departmentId: paper.departmentId,
        subjectId: paper.subjectId,
        semester: paper.semester,
        year: paper.year,
        fileUrl: paper.fileUrl,
        fileType: paper.fileType,
      },
    });
  }

  console.log('✅ Seeding complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
