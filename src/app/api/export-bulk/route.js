import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import ExcelJS from "exceljs";

export async function GET(request) {
  const cookieStore = await cookies();
  const adminId = cookieStore.get("adminId")?.value;
  const facultyId = cookieStore.get("facultyId")?.value;

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  if (!adminId && !facultyId) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    let students = [];
    let personName = "";
    let isRoleAdmin = false;

    // Check explicit role from the frontend to avoid cookie overlap conflicts
    if (role === 'admin' && adminId) {
      const admin = await prisma.admin.findUnique({ where: { id: adminId } });
      personName = admin?.name || "HOD";
      isRoleAdmin = true;
      
      // Admin gets ALL students
      students = await prisma.student.findMany({
        include: {
          projects: { where: { status: 'APPROVED' } },
          extraCurriculars: { where: { status: 'APPROVED' } },
          coCurriculars: { where: { status: 'APPROVED' } },
          certifications: { where: { status: 'APPROVED' } },
          researchPapers: { where: { status: 'APPROVED' } },
        },
        orderBy: { name: 'asc' }
      });
    } else if (role === 'mentor' && facultyId) {
      const faculty = await prisma.faculty.findUnique({ where: { id: facultyId } });
      personName = faculty?.name || "Faculty Mentor";
      
      // Mentor gets ONLY their mentees
      students = await prisma.student.findMany({
        where: { mentorId: facultyId },
        include: {
          projects: { where: { status: 'APPROVED' } },
          extraCurriculars: { where: { status: 'APPROVED' } },
          coCurriculars: { where: { status: 'APPROVED' } },
          certifications: { where: { status: 'APPROVED' } },
          researchPapers: { where: { status: 'APPROVED' } },
        },
        orderBy: { name: 'asc' }
      });
    } else {
      return NextResponse.json({ error: "Invalid role or missing authentication for this action." }, { status: 403 });
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Activity Summary");

    const columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Student Name', key: 'name', width: 25 },
      { header: 'Enrollment No', key: 'enrollmentNo', width: 20 },
      { header: 'Section', key: 'section', width: 10 },
      { header: 'Projects', key: 'projects', width: 15 },
      { header: 'Extra-Curricular', key: 'extra', width: 18 },
      { header: 'Co-Curricular', key: 'co', width: 18 },
      { header: 'Certifications', key: 'cert', width: 15 },
      { header: 'Research Papers', key: 'research', width: 18 },
      { header: 'Total Approved', key: 'total', width: 18 }
    ];

    columns.forEach((col, index) => {
      sheet.getColumn(index + 1).width = col.width;
      sheet.getColumn(index + 1).key = col.key;
    });

    // Row 1 & 2: College Info
    sheet.mergeCells(1, 1, 1, columns.length);
    const row1 = sheet.getCell('A1');
    row1.value = 'Bhagwan Parshuram Institute of Technology';
    row1.font = { bold: true, size: 14 };
    row1.alignment = { horizontal: 'center' };

    sheet.mergeCells(2, 1, 2, columns.length);
    const row2 = sheet.getCell('A2');
    row2.value = 'Department of Information Technology';
    row2.font = { bold: true, size: 12 };
    row2.alignment = { horizontal: 'center' };

    // Row 4: Title
    sheet.mergeCells(4, 1, 4, columns.length);
    const row4 = sheet.getCell('A4');
    row4.value = isRoleAdmin ? 'Department Student Activity Summary' : 'Mentee Activity Summary';
    row4.font = { bold: true, size: 12 };
    row4.alignment = { horizontal: 'center' };

    // Row 6: Dynamic Info (Admin vs Mentor)
    sheet.getCell('A6').value = isRoleAdmin ? 'HOD Name:' : 'Mentor Name:';
    sheet.getCell('A6').font = { bold: true };
    sheet.getCell('B6').value = personName;

    sheet.getCell('D6').value = 'Department:';
    sheet.getCell('D6').font = { bold: true };
    sheet.getCell('E6').value = 'Information Technology';

    // Row 8: Headers
    const headerRow = sheet.getRow(8);
    columns.forEach((col, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = col.header;
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
    });

    // Row 9+: Data Mapping
    if (students && students.length > 0) {
      students.forEach((student, index) => {
        const projCount = student.projects.length;
        const extraCount = student.extraCurriculars.length;
        const coCount = student.coCurriculars.length;
        const certCount = student.certifications.length;
        const researchCount = student.researchPapers.length;
        const total = projCount + extraCount + coCount + certCount + researchCount;

        sheet.addRow({
          sno: index + 1,
          name: student.name,
          enrollmentNo: student.enrollmentNo || 'N/A',
          section: student.section || 'N/A',
          projects: projCount,
          extra: extraCount,
          co: coCount,
          cert: certCount,
          research: researchCount,
          total: total
        });
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const filename = isRoleAdmin ? 'IT_Department_Summary.xlsx' : 'Mentee_Summary.xlsx';

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}