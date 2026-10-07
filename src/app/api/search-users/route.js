import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Adjust path to your db.js if needed
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); 
  const query = searchParams.get("query");

  if (!query || query.length < 2) return NextResponse.json([]);

  try {
    if (type === "mentor") {
      const mentors = await prisma.faculty.findMany({
        // Removed mode: "insensitive" - MySQL does this automatically
        where: { name: { contains: query } },
        select: { id: true, name: true, department: true },
        take: 5,
      });
      return NextResponse.json(mentors);
    } 
    
    if (type === "student") {
      const students = await prisma.student.findMany({
        where: {
          OR: [
            // Removed mode: "insensitive" - MySQL does this automatically
            { name: { contains: query } },
            { enrollmentNo: { contains: query } }
          ]
        },
        select: { id: true, name: true, enrollmentNo: true, section: true },
        take: 5,
      });
      return NextResponse.json(students);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}