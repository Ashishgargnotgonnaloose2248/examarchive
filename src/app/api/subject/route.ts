import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/* GET /api/subject – fetch all subjects                              */
/* ------------------------------------------------------------------ */
export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {department: true},
    });
    return NextResponse.json(subjects);
  } catch (error) {
    console.error("❌ Failed to fetch subjects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/* ------------------------------------------------------------------ */
/* POST /api/subject – create a new subject                           */
/* Expects JSON: { id: string, name: string, departmentId: string }   */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  try {
    const { id, name, departmentId } = await req.json();

    /* ------------------- validation -------------------- */
    if (!id || !name || !departmentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    /* -------------- duplicate‐ID safeguard ------------- */
    const existing = await prisma.subject.findUnique({ where: { id } });
    if (existing) {
      return NextResponse.json(
        { error: "Subject ID already exists" },
        { status: 409 },
      );
    }

    /* ----------------- create subject ------------------ */
    const newSubject = await prisma.subject.create({
      data: {
        id,          // custom ID from the form (e.g., "CS201")
        name,
        departmentId,
      },
    });

    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to add subject:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
