import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import { adminAssignMentor } from "@/app/actions";
import ExportButton from "@/components/ExportButton";
import Image from "next/image"; // 1. Import Next.js Image component

export default async function AllStudentsPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get('adminId')?.value) redirect('/admin/login');

  const students = await prisma.student.findMany({
    include: { mentor: true },
    orderBy: { name: 'asc' }
  });

  const mentors = await prisma.faculty.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">All Students</h1>
        <p className="text-slate-600 font-medium mt-1">Manage all students and their mentor assignments globally.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
                // Generate initials fallback in case profilePic is null
                const initials = student.name
                  ? student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                  : 'ST';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        
                        {/* --- DYNAMIC STUDENT PROFILE PICTURE OR INITIALS --- */}
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
      </div>
    </div>
  );
}