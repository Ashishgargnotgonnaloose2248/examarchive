// lib/actions/getSubjects.ts
import prisma from "@/lib/prisma";

export const getSubjects = async () => {
  return await prisma.subject.findMany();
};
