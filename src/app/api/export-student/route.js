import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import ExcelJS from "exceljs";
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const cookieStore = await cookies();
  const adminId = cookieStore.get("adminId")?.value;
  const facultyId = cookieStore.get("facultyId")?.value;
  const studentIdCookie = cookieStore.get("userId")?.value;

  // 1. Verify Authentication
  if (!adminId && !facultyId && !studentIdCookie) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  // 2. Determine Target Student
  const { searchParams } = new URL(request.url || 'http://localhost');
  let targetStudentId = searchParams.get("studentId");

  if (!targetStudentId) {
    if (studentIdCookie) {
      targetStudentId = studentIdCookie;
    } else {
      return NextResponse.json({ error: "Student ID missing. Please log in again." }, { status: 400 });
    }
  }

  try {
    // 3. Fetch ONLY APPROVED student data
    const student = await prisma.student.findUnique({
      where: { id: targetStudentId },
      include: {
        projects: { where: { status: 'APPROVED' } },
        extraCurriculars: { where: { status: 'APPROVED' } },
        coCurriculars: { where: { status: 'APPROVED' } },
        certifications: { where: { status: 'APPROVED' } },
        researchPapers: { where: { status: 'APPROVED' } },
      }
    });

    if (!student) {
      return NextResponse.json({ error: "Student record not found in database." }, { status: 404 });
    }

    // 4. Initialize Excel Workbook
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Portal System";
    workbook.created = new Date();

    // --- Helper function to create uniquely formatted sheets ---
    const createSheet = (name, title, data, columns, studentInfo) => {
      const sheet = workbook.addWorksheet(name);

      // Set column properties (without headers to avoid auto-filling row 1)
      columns.forEach((col, index) => {
        sheet.getColumn(index + 1).width = col.width || 20;
        sheet.getColumn(index + 1).key = col.key; // Keep key for mapping data later
      });

      // Row 1: College Name
      sheet.mergeCells(1, 1, 1, columns.length);
      const row1 = sheet.getCell(1, 1);
      row1.value = 'Bhagwan Parshuram Institute of Technology';
      row1.font = { bold: true, size: 14 };
      row1.alignment = { horizontal: 'center' };

      // Row 2: Department
      sheet.mergeCells(2, 1, 2, columns.length);
      const row2 = sheet.getCell(2, 1);
      row2.value = 'Department of Information Technology';
      row2.font = { bold: true, size: 12 };
      row2.alignment = { horizontal: 'center' };

      // Row 3: Empty automatically

      // Row 4: Sheet Specific Title
      sheet.mergeCells(4, 1, 4, columns.length);
      const row4 = sheet.getCell(4, 1);
      row4.value = title;
      row4.font = { bold: true, size: 12 };
      row4.alignment = { horizontal: 'center' };

      // Row 5: Empty automatically

      // Row 6: Student Info (Matching your image structure)
      sheet.getCell('A6').value = 'Batch:';
      sheet.getCell('A6').font = { bold: true };
      sheet.getCell('B6').value = studentInfo.batch || 'N/A';

      sheet.getCell('D6').value = 'Section:';
      sheet.getCell('D6').font = { bold: true };
      sheet.getCell('E6').value = studentInfo.section || 'N/A';

      sheet.getCell('G6').value = 'Enrollment No:';
      sheet.getCell('G6').font = { bold: true };
      sheet.getCell('H6').value = studentInfo.enrollmentNo || 'N/A';

      sheet.getCell('J6').value = 'Name of Student:';
      sheet.getCell('J6').font = { bold: true };
      sheet.getCell('K6').value = studentInfo.name || 'N/A';

      // Row 7: Empty automatically

      // Row 8: Table Headers
      const headerRow = sheet.getRow(8);
      columns.forEach((col, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.value = col.header;
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; // White Text
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } }; // Indigo Background
      });

      // Data Rows (Starting from Row 9)
      if (data && data.length > 0) {
        data.forEach((item) => {
          const rowData = {};
          columns.forEach(col => {
             rowData[col.key] = item[col.key];
          });
          sheet.addRow(rowData);
        });
      }
    };

    // --- Create Sheets with ALL Database Fields & Formatting ---
    
    createSheet("Projects", "Details of Participation on Projects", student.projects, [
      { header: 'Project Name', key: 'projectName', width: 25 },
      { header: 'Semester', key: 'semester', width: 10 },
      { header: 'Project Type', key: 'type', width: 20 },
      { header: 'Tech Stack', key: 'techStack', width: 30 },
      { header: 'Status', key: 'projectStatus', width: 20 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'Key Learnings', key: 'learnings', width: 40 },
      { header: 'Supervisor', key: 'supervisor', width: 20 },
      { header: 'Team Members', key: 'teamMembers', width: 20 },
      { header: 'Achievements', key: 'achievements', width: 25 },
      { header: 'Start Date', key: 'dateFrom', width: 15 },
      { header: 'End Date', key: 'dateTo', width: 15 },
      { header: 'GitHub Link', key: 'githubLink', width: 30 },
      { header: 'Proof Document', key: 'proofUrl', width: 30 },
      { header: 'Photo URL', key: 'photoUrl', width: 30 }
    ], student);

    createSheet("Extra-Curricular", "Details of Participation on Extra-curricular Activities / Events", student.extraCurriculars, [
      { header: 'Title', key: 'title', width: 25 },
      { header: 'Semester', key: 'semester', width: 10 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Mode', key: 'mode', width: 15 },
      { header: 'Level', key: 'level', width: 15 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Position', key: 'position', width: 15 },
      { header: 'Organized By', key: 'organizedBy', width: 20 },
      { header: 'Place', key: 'place', width: 20 },
      { header: 'Start Date', key: 'dateFrom', width: 15 },
      { header: 'End Date', key: 'dateTo', width: 15 },
      { header: 'Duration', key: 'duration', width: 15 },
      { header: 'Team Members', key: 'teamMembers', width: 20 },
      { header: 'Prize Money', key: 'prizeMoney', width: 15 },
      { header: 'Learnings', key: 'learnings', width: 40 },
      { header: 'Sponsored By', key: 'sponsored', width: 15 },
      { header: 'Proof Document', key: 'proofUrl', width: 30 },
      { header: 'Photo URL', key: 'photoUrl', width: 30 }
    ], student);

    createSheet("Co-Curricular", "Details of Participation on Co-curricular Activities / Events", student.coCurriculars, [
      { header: 'Title', key: 'title', width: 25 },
      { header: 'Semester', key: 'semester', width: 10 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Mode', key: 'mode', width: 15 },
      { header: 'Level', key: 'level', width: 15 },
      { header: 'Role', key: 'role', width: 15 },
      { header: 'Position', key: 'position', width: 15 },
      { header: 'Organized By', key: 'organizedBy', width: 20 },
      { header: 'Place', key: 'place', width: 20 },
      { header: 'Start Date', key: 'dateFrom', width: 15 },
      { header: 'End Date', key: 'dateTo', width: 15 },
      { header: 'Duration', key: 'duration', width: 15 },
      { header: 'Team Members', key: 'teamMembers', width: 20 },
      { header: 'Prize Money', key: 'prizeMoney', width: 15 },
      { header: 'Learnings', key: 'learnings', width: 40 },
      { header: 'Sponsored By', key: 'sponsored', width: 15 },
      { header: 'Proof Document', key: 'proofUrl', width: 30 },
      { header: 'Photo URL', key: 'photoUrl', width: 30 }
    ], student);

    createSheet("Certifications", "Details of Certifications Completed", student.certifications, [
      { header: 'Course Name', key: 'courseName', width: 30 },
      { header: 'Semester', key: 'semester', width: 10 },
      { header: 'Mode', key: 'mode', width: 15 },
      { header: 'Organized By', key: 'organizedBy', width: 20 },
      { header: 'Certified By', key: 'certifiedBy', width: 20 },
      { header: 'Position', key: 'position', width: 15 },
      { header: 'Max Marks/Grade', key: 'maxMarksGrade', width: 15 },
      { header: 'Marks Obtained', key: 'marksObtained', width: 15 },
      { header: 'Start Date', key: 'dateFrom', width: 15 },
      { header: 'End Date', key: 'dateTo', width: 15 },
      { header: 'Duration', key: 'duration', width: 15 },
      { header: 'Learnings', key: 'learnings', width: 40 },
      { header: 'Sponsored By', key: 'sponsored', width: 15 },
      { header: 'Certificate (URL)', key: 'proofUrl', width: 30 },
      { header: 'Photo URL', key: 'photoUrl', width: 30 }
    ], student);

    createSheet("Research Papers", "Details of Published Research Papers", student.researchPapers, [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Semester', key: 'semester', width: 10 },
      { header: 'Paper Type', key: 'type', width: 15 },
      { header: 'Authors', key: 'authors', width: 25 },
      { header: 'Supervisor', key: 'supervisor', width: 20 },
      { header: 'Journal/Conference', key: 'journalName', width: 25 },
      { header: 'Published By', key: 'publishedBy', width: 20 },
      { header: 'Month & Year', key: 'monthYear', width: 15 },
      { header: 'Volume/Issue', key: 'volumeIssue', width: 15 },
      { header: 'Indexing', key: 'indexing', width: 15 },
      { header: 'Paper Status', key: 'paperStatus', width: 15 },
      { header: 'Organization', key: 'organization', width: 20 },
      { header: 'Achievements', key: 'achievements', width: 25 },
      { header: 'Learnings', key: 'learnings', width: 40 },
      { header: 'DOI URL', key: 'doiUrl', width: 30 },
      { header: 'Document URL', key: 'proofUrl', width: 30 },
      { header: 'Photo URL', key: 'photoUrl', width: 30 }
    ], student);

    // 5. Generate and send the file
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Format filename safely
    const safeName = (student.name || 'student').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${safeName}_archive_LATEST.xlsx`;

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