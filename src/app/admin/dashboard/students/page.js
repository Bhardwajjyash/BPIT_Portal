import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Users, Search, Filter, XCircle } from "lucide-react";
import { adminAssignMentor } from "@/app/actions";
import ExportButton from "@/components/ExportButton";

export default async function AllStudentsPage({ searchParams }) {
  const cookieStore = await cookies();
  const adminId = cookieStore.get('adminId')?.value;
  
  if (!adminId) redirect('/admin/login');

  // Await searchParams for Next.js 15 compatibility
  const params = await searchParams;
  const searchQuery = params?.search || '';
  const sectionQuery = params?.section || '';

  // 1. Fetch the logged-in admin to get their exact department
  const currentAdmin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { departmentName: true }
  });

  // 2. Dynamically fetch the available sections for this specific department
  const sectionRecords = await prisma.student.findMany({
    where: currentAdmin?.departmentName ? { departmentName: currentAdmin.departmentName } : {},
    select: { section: true },
    distinct: ['section'],
    orderBy: { section: 'asc' }
  });
  const availableSections = sectionRecords.map(s => s.section).filter(Boolean);

  // 3. Build the highly specific filter clause based on URL parameters
  const filterClause = {
    // A. Lock to HOD's department
    ...(currentAdmin?.departmentName && { departmentName: currentAdmin.departmentName }),
    // B. Apply Section Filter if selected
    ...(sectionQuery && { section: sectionQuery }),
    // C. Apply Search Query (Matches Name OR Enrollment Number)
    ...(searchQuery && {
      OR: [
        { name: { contains: searchQuery } },
        { enrollmentNo: { contains: searchQuery } }
      ]
    })
  };

  // 4. Fetch strictly scoped and filtered students
  const students = await prisma.student.findMany({
    where: filterClause,
    include: { mentor: true },
    orderBy: { name: 'asc' }
  });

  // 5. Fetch scoped mentors for the dropdown
  const mentors = await prisma.faculty.findMany({
    where: currentAdmin?.departmentName ? { departmentName: currentAdmin.departmentName } : {},
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">All Students</h1>
        <p className="text-slate-600 font-medium mt-1">Manage all students and their mentor assignments globally.</p>
        
        {currentAdmin?.departmentName && (
          <span className="inline-block mt-3 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
            {currentAdmin.departmentName}
          </span>
        )}
      </div>

      {/* --- SEARCH AND FILTER BAR --- */}
      <form method="GET" className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col sm:flex-row gap-3 items-center">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            name="search" 
            defaultValue={searchQuery}
            placeholder="Search by student name or enrollment no..." 
            className="w-full pl-9 pr-4 py-2.5 text-sm font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 transition-all"
          />
        </div>

        {/* Section Dropdown */}
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select 
            name="section" 
            defaultValue={sectionQuery}
            className="w-full pl-9 pr-4 py-2.5 text-sm font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 appearance-none cursor-pointer transition-all"
          >
            <option value="">All Sections</option>
            {availableSections.map(sec => (
              <option key={sec} value={sec}>Section {sec}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
          Apply
        </button>

        {/* Clear Filters Button (Only shows if a filter is active) */}
        {(searchQuery || sectionQuery) && (
          <Link 
            href="/admin/dashboard/students" 
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <XCircle className="w-4 h-4" /> Clear
          </Link>
        )}
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {students.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="bg-slate-50 p-4 rounded-full border border-slate-200 mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No students found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search query or section filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Student Details</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Batch & Section</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Assigned Mentor</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Assign / Reassign</th>
                  <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Export Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => {
                  const initials = student.name
                    ? student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    : 'ST';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden flex-shrink-0 border border-slate-100">
                            {student.profilePic ? (
                              <Image 
                                src={student.profilePic} 
                                alt={`${student.name} Profile`}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            ) : (
                              initials
                            )}
                          </div>

                          <div>
                            <p className="font-bold text-slate-900">{student.name}</p>
                            <p className="text-xs font-semibold text-slate-500">{student.enrollmentNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-bold text-slate-700">{student.batch}</p>
                        <p className="text-xs text-slate-500">Section {student.section}</p>
                      </td>
                      <td className="p-4">
                        {student.mentor ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Users className="w-3.5 h-3.5 mr-1" />
                            {student.mentor.name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <form action={adminAssignMentor} className="flex items-center gap-2">
                          <input type="hidden" name="studentId" value={student.id} />
                          <select 
                            name="mentorId" 
                            defaultValue={student.mentorId || ""}
                            className="text-sm border border-slate-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">-- No Mentor --</option>
                            {mentors.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                          <button type="submit" className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">
                            Save
                          </button>
                        </form>
                      </td>
                      <td className="p-4">
                        <ExportButton 
                          studentId={student.id} 
                          label="Export Excel" 
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}