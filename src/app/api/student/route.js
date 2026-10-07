import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; 
// import { getCurrentAdminSession } from '@/lib/session'; 

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // 1. Get the currently logged-in HOD/Admin session
    // WARNING: This will crash at runtime if getCurrentAdminSession is not imported/defined
    const admin = await getCurrentAdminSession(); 

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Build the dynamic where clause based on the new relational schema
    let studentWhereClause = {};
    
    // If the admin has a specific departmentName (e.g., 'Information Technology'), 
    // filter students by that exact department string.
    // If it is null (like for your General Admin), the query object remains empty and fetches everyone.
    if (admin.departmentName) {
      studentWhereClause = {
        departmentName: admin.departmentName
      };
    }

    // 3. Fetch only the students belonging to this HOD's department
    const scopedStudents = await prisma.student.findMany({
      where: studentWhereClause,
      include: {
        projects: true, // include related records if needed for your UI/exports
        certifications: true,
        department: true // Optional: Includes the linked department record if you need it
      }
    });

    return NextResponse.json({ students: scopedStudents }, { status: 200 });
  } catch (error) {
    console.error('Error fetching scoped students:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}