// /src/app/api/update-paper/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const id           = formData.get("id") as string;
    const title        = formData.get("title") as string;
    const year         = parseInt(formData.get("year") as string);
    const semester     = parseInt(formData.get("semester") as string);
    const subjectId    = formData.get("subjectId") as string;
    const departmentId = formData.get("departmentId") as string;
    const file         = formData.get("file") as File | null;

    let fileUrl: string | undefined;
    let fileType: string | undefined;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const upload = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "exam-papers",
            filename_override: file.name,
            unique_filename: false,
          },
          (err, result) => (err ? reject(err) : resolve(result))
        ).end(buffer);
      }) as any;

      fileUrl = upload.secure_url;
      fileType = upload.format ?? file.name.split(".").pop() ?? "raw";
    }

    const updatedPaper = await prisma.paper.update({
      where: { id },
      data: {
        title,
        year,
        semester,
        subjectId,
        departmentId,
        ...(fileUrl && { fileUrl }),
        ...(fileType && { fileType }),
      },
    });

    return NextResponse.json({ success: true, paper: updatedPaper });
  } catch (error) {
    console.error("❌ Update failed:", error);
    return NextResponse.json({ error: "Failed to update paper" }, { status: 500 });
  }
}
