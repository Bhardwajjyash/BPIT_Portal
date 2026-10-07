import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

// Force Next.js to skip all static optimizations
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

export async function GET(request) {
  const cookieStore = await cookies();
  const adminId = cookieStore.get("adminId")?.value;
  const facultyId = cookieStore.get("facultyId")?.value;

  const { searchParams } = new URL(request.url || 'http://localhost');
  const role = searchParams.get("role");
  const type = searchParams.get("type") || "summary";
  
  const filterType = searchParams.get("filterType"); 
  const filterValue = searchParams.get("filterValue");
  const section = searchParams.get("section");
  const enrollmentNo = searchParams.get("enrollmentNo");
  const filterMentorId = searchParams.get("mentorId");

  if (!adminId && !facultyId) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    let students = [];
    let personName = "";
    let isRoleAdmin = false;
    let filterTitle = "All Students";
    const whereClause = {};

    if (role === 'admin' && adminId) {
      const admin = await prisma.admin.findUnique({ where: { id: adminId } });
      personName = admin?.name || "HOD";
      isRoleAdmin = true;
      
      if (filterType === 'section' && filterValue) {
        whereClause.section = filterValue;
        filterTitle = `Section: ${filterValue}`;
      } else if (filterType === 'mentor' && filterValue) {
        whereClause.mentorId = filterValue;
        filterTitle = `Mentor ID: ${filterValue}`;
      } else if (filterType === 'students' && filterValue) {
        const studentIds = filterValue.split(',');
        whereClause.id = { in: studentIds };
        filterTitle = `Custom Student Selection`;
      } else {
        if (section) { whereClause.section = section; filterTitle = `Section: ${section}`; }
        if (enrollmentNo) { whereClause.enrollmentNo = enrollmentNo; filterTitle = `Student: ${enrollmentNo}`; }
        if (filterMentorId) { whereClause.mentorId = filterMentorId; filterTitle = `Mentor: ${filterMentorId}`; }
      }
    } else if (role === 'mentor' && facultyId) {
      const faculty = await prisma.faculty.findUnique({ where: { id: facultyId } });
      personName = faculty?.name || "Faculty Mentor";
      whereClause.mentorId = facultyId;
      filterTitle = `My Mentees`;
    } else {
      return NextResponse.json({ error: "Invalid role or missing authentication." }, { status: 403 });
    }

    students = await prisma.student.findMany({
      where: whereClause,
      include: {
        projects: type === 'summary' ? { where: { status: 'APPROVED' } } : true,
        extraCurriculars: type === 'summary' ? { where: { status: 'APPROVED' } } : true,
        coCurriculars: type === 'summary' ? { where: { status: 'APPROVED' } } : true,
        certifications: type === 'summary' ? { where: { status: 'APPROVED' } } : true,
        researchPapers: type === 'summary' ? { where: { status: 'APPROVED' } } : true,
      },
      orderBy: { name: 'asc' }
    });

    // ------------------------------------------------------------------------
    // ULTIMATE TURBOPACK BYPASS
    // Splitting the string prevents AST parsers from reading the import.
    // ------------------------------------------------------------------------
    const libName = "ex" + "celjs";
    const ExcelJSModule = await import(libName);
    const ExcelJS = ExcelJSModule.default || ExcelJSModule;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Portal System";
    workbook.created = new Date();

    if (type === 'detailed') {
      const createBulkSheet = (name, title, dataExtractor, activityColumns) => {
        const sheet = workbook.addWorksheet(name);
        
        const columns = [
          { header: 'Student Name', key: 'studentName', width: 25 },
          { header: 'Enrollment No', key: 'enrollmentNo', width: 20 },
          { header: 'Section', key: 'section', width: 10 },
          ...activityColumns
        ];

        columns.forEach((col, index) => {
          sheet.getColumn(index + 1).width = col.width;
          sheet.getColumn(index + 1).key = col.key;
        });

        sheet.mergeCells(1, 1, 1, columns.length);
        sheet.getCell('A1').value = 'Bhagwan Parshuram Institute of Technology';
        sheet.getCell('A1').font = { bold: true, size: 14 };
        sheet.getCell('A1').alignment = { horizontal: 'center' };

        sheet.mergeCells(2, 1, 2, columns.length);
        sheet.getCell('A2').value = 'Department of Information Technology';
        sheet.getCell('A2').font = { bold: true, size: 12 };
        sheet.getCell('A2').alignment = { horizontal: 'center' };

        sheet.mergeCells(4, 1, 4, columns.length);
        sheet.getCell('A4').value = title;
        sheet.getCell('A4').font = { bold: true, size: 12 };
        sheet.getCell('A4').alignment = { horizontal: 'center' };

        sheet.getCell('A6').value = 'Filter Applied:';
        sheet.getCell('A6').font = { bold: true };
        sheet.getCell('B6').value = filterTitle;

        const headerRow = sheet.getRow(8);
        columns.forEach((col, index) => {
          const cell = headerRow.getCell(index + 1);
          cell.value = col.header;
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
        });

        students.forEach(student => {
          const activities = dataExtractor(student);
          if (activities && activities.length > 0) {
            activities.forEach(item => {
              const rowData = {
                studentName: student.name,
                enrollmentNo: student.enrollmentNo || 'N/A',
                section: student.section || 'N/A',
              };
              activityColumns.forEach(col => {
                rowData[col.key] = item[col.key];
              });
              sheet.addRow(rowData);
            });
          }
        });
      };

      createBulkSheet("Projects", "Bulk Project Details", s => s.projects, [
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
        { header: 'Proof Document', key: 'proofUrl', width: 30 }
      ]);

      createBulkSheet("Extra-Curricular", "Bulk Extra-Curricular Details", s => s.extraCurriculars, [
        { header: 'Title', key: 'title', width: 25 },
        { header: 'Semester', key: 'semester', width: 10 },
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Mode', key: 'mode', width: 15 },
        { header: 'Level', key: 'level', width: 15 },
        { header: 'Role', key: 'role', width: 15 },
        { header: 'Position', key: 'position', width: 15 },
        { header: 'Organized By', key: 'organizedBy', width: 20 },
        { header: 'Place', key: 'place', width: 20 },
        { header: 'Duration', key: 'duration', width: 15 },
        { header: 'Prize Money', key: 'prizeMoney', width: 15 },
        { header: 'Learnings', key: 'learnings', width: 40 },
        { header: 'Sponsored By', key: 'sponsored', width: 15 },
        { header: 'Proof Document', key: 'proofUrl', width: 30 }
      ]);

      createBulkSheet("Co-Curricular", "Bulk Co-Curricular Details", s => s.coCurriculars, [
        { header: 'Title', key: 'title', width: 25 },
        { header: 'Semester', key: 'semester', width: 10 },
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Mode', key: 'mode', width: 15 },
        { header: 'Level', key: 'level', width: 15 },
        { header: 'Role', key: 'role', width: 15 },
        { header: 'Position', key: 'position', width: 15 },
        { header: 'Organized By', key: 'organizedBy', width: 20 },
        { header: 'Place', key: 'place', width: 20 },
        { header: 'Duration', key: 'duration', width: 15 },
        { header: 'Prize Money', key: 'prizeMoney', width: 15 },
        { header: 'Learnings', key: 'learnings', width: 40 },
        { header: 'Sponsored By', key: 'sponsored', width: 15 },
        { header: 'Proof Document', key: 'proofUrl', width: 30 }
      ]);

      createBulkSheet("Certifications", "Bulk Certifications Details", s => s.certifications, [
        { header: 'Course Name', key: 'courseName', width: 30 },
        { header: 'Semester', key: 'semester', width: 10 },
        { header: 'Mode', key: 'mode', width: 15 },
        { header: 'Organized By', key: 'organizedBy', width: 20 },
        { header: 'Certified By', key: 'certifiedBy', width: 20 },
        { header: 'Position', key: 'position', width: 15 },
        { header: 'Max Marks/Grade', key: 'maxMarksGrade', width: 15 },
        { header: 'Marks Obtained', key: 'marksObtained', width: 15 },
        { header: 'Duration', key: 'duration', width: 15 },
        { header: 'Learnings', key: 'learnings', width: 40 },
        { header: 'Sponsored By', key: 'sponsored', width: 15 },
        { header: 'Certificate (URL)', key: 'proofUrl', width: 30 }
      ]);

      createBulkSheet("Research Papers", "Bulk Published Research Papers", s => s.researchPapers, [
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
        { header: 'Document URL', key: 'proofUrl', width: 30 }
      ]);
    } else {
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

      sheet.mergeCells(4, 1, 4, columns.length);
      const row4 = sheet.getCell('A4');
      row4.value = isRoleAdmin ? 'Department Student Activity Summary' : 'Mentee Activity Summary';
      row4.font = { bold: true, size: 12 };
      row4.alignment = { horizontal: 'center' };

      sheet.getCell('A6').value = isRoleAdmin ? 'HOD Name:' : 'Mentor Name:';
      sheet.getCell('A6').font = { bold: true };
      sheet.getCell('B6').value = personName;

      sheet.getCell('D6').value = 'Filter:';
      sheet.getCell('D6').font = { bold: true };
      sheet.getCell('E6').value = filterTitle;

      const headerRow = sheet.getRow(8);
      columns.forEach((col, index) => {
        const cell = headerRow.getCell(index + 1);
        cell.value = col.header;
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
      });

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
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const filename = type === 'detailed' 
      ? `Detailed_Bulk_Data_${new Date().getTime()}.xlsx` 
      : (isRoleAdmin ? `Dept_Summary_${new Date().getTime()}.xlsx` : `Mentee_Summary_${new Date().getTime()}.xlsx`);

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