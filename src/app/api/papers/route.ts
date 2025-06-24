/* ────────────────────────────────────────────────────────────────── */
/*  File:  src/app/api/papers/route.ts                               */
/* ────────────────────────────────────────────────────────────────── */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";

/* ------------------------------------------------------------------ */
/* 1.  GET /api/papers  -> return papers (optionally filtered)         */
/* ------------------------------------------------------------------ */
export async function GET(req: NextRequest) {
  console.log("API HIT");
  try {
    const { searchParams } = new URL(req.url);

    const where: any = {
      departmentId: searchParams.get("departmentId") ?? undefined,
      subjectId:    searchParams.get("subjectId")    ?? undefined,
      semester:     searchParams.get("semester") ? +searchParams.get("semester")! : undefined,
      year:         searchParams.get("year")     ? +searchParams.get("year")!     : undefined,
    };

    const papers = await prisma.paper.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(papers);
  } catch (err) {
    console.error("❌ Failed to fetch papers:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/* ------------------------------------------------------------------ */
/* 2.  POST /api/papers                                               */
/*     – Create  ➜ if *no* id provided                                 */
/*     – Update  ➜ if id provided                                     */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  try {
    /* ----- parse multipart form ----- */
    const formData     = await req.formData();

    /*  Detect create vs. update  */
    const id           = formData.get("id") as string | null;   //  present  => update
    const isUpdate     = !!id;

    const title        = formData.get("title")        as string;
    const year         = Number(formData.get("year"));
    const semester     = Number(formData.get("semester"));
    const departmentId = formData.get("departmentId") as string;
    const subjectId    = formData.get("subjectId")    as string;
    const file         = formData.get("file")         as File | null;

    /* ----- sanity-check required fields ----- */
    if (!title || isNaN(year) || isNaN(semester) || !departmentId || !subjectId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    /* ---------------------------------------------------------- */
    /*  If a new file was sent, upload it to Cloudinary           */
    /* ---------------------------------------------------------- */
    let fileUrl:  string | undefined;
    let fileType: string | undefined;
    let fileName: string | undefined;

    if (file && file.size) {
      /* Build Cloudinary public_id with original extension intact */
      const originalExt = file.name.split(".").pop()?.toLowerCase() ?? "raw";
      const safeName    = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const publicId    = `exam-papers/${id ?? uuidv4()}_${safeName}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      const uploadRes: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            public_id: "publicId",
            overwrite: true,
            type: "upload",
          },
          (err, res) => (err ? reject(err) : resolve(res))
        ).end(buffer);
      });

      fileUrl  = uploadRes.secure_url;
      fileType = originalExt;
      fileName = file.name;
    }

    /* ---------------------------------------------------------- */
    /*  CREATE                                                    */
    /* ---------------------------------------------------------- */
    if (!isUpdate) {
      if (!fileUrl) {
        return NextResponse.json({ error: "File is required for new paper" }, { status: 400 });
      }

      const newPaper = await prisma.paper.create({
        data: {
          title,
          year,
          semester,
          departmentId,
          subjectId,
          fileType: fileType!,
          fileUrl:  fileUrl!,
          fileName: fileName!,   // assumes you added this column
        },
      });

      return NextResponse.json(newPaper, { status: 201 });
    }

    /* ---------------------------------------------------------- */
    /*  UPDATE                                                    */
    /* ---------------------------------------------------------- */
    const updatedPaper = await prisma.paper.update({
      where: { id },
      data: {
        title,
        year,
        semester,
        departmentId,
        subjectId,
        ...(fileUrl  && { fileUrl }),
        ...(fileType && { fileType }),
        ...(fileName && { fileName }),
      },
    });

    return NextResponse.json(updatedPaper, { status: 200 });
  } catch (err) {
    console.error("❌ /api/papers error:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
