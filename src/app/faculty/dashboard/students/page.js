import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { assignStudentToMentor, removeStudentFromMentor } from "@/app/actions";
import { UserPlus, Search, UserMinus } from "lucide-react";
import ExportButton from "@/components/ExportButton";

export default async function ManageStudentsPage({ searchParams }) {
  const cookieStore = await cookies();
  const facultyId = cookieStore.get('facultyId')?.value;
  if (!facultyId) redirect('/faculty/login');

  // Await searchParams as required in newer Next.js versions
  const params = await searchParams;
  const searchQuery = params?.query || '';

  // 1. Fetch currently assigned mentees
  const mentees = await prisma.student.findMany({
    where: { mentorId: facultyId }
  });

  // 2. Fetch search result if query exists
  let searchResult = null;
  if (searchQuery.length === 11) {
    searchResult = await prisma.student.findUnique({
      where: { enrollmentNo: searchQuery }
    });
  }

  return (
    <div className="space-y-8">
      {/* Search and Add Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <UserPlus className="text-indigo-600 w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-900">Add Student to Mentee Group</h2>
        </div>
        <p className="text-sm text-slate-600 mb-6">Enter an 11-digit enrollment number to search the database.</p>
        
        {/* Search Form updates the URL ?query=... */}
        <form className="flex flex-col sm:flex-row gap-3 mb-6" method="GET">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              name="query"
              defaultValue={searchQuery}
              pattern="[0-9]{11}"
              placeholder="e.g 08220803123" 
              className="placeholder:text-slate-600 w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
            />
          </div>
          <button type="submit" className="px-8 py-3 text-sm font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
            Search
          </button>
        </form>

        {/* Search Result Display */}
        {searchQuery && (
          <div className="border border-indigo-100 bg-indigo-50/30 rounded-xl p-4 flex justify-between items-center">
            {searchResult ? (
              <>
                <div>
                  <p className="font-bold text-slate-900">{searchResult.name}</p>
                  <p className="text-xs text-slate-500">Enrollment: {searchResult.enrollmentNo}</p>
                </div>
                {searchResult.mentorId === facultyId ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-lg">Already Added</span>
                ) : (
                  <form action={assignStudentToMentor}>
                    <input type="hidden" name="enrollmentNo" value={searchResult.enrollmentNo} />
                    <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                      Add Mentee
                    </button>
                  </form>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500">No student found with enrollment number {searchQuery}.</p>
            )}
          </div>
        )}
      </div>

      {/* List of Currently Assigned Students */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Your Assigned Mentees</h2>
        {mentees.length === 0 ? (
          <p className="text-sm text-slate-500">You haven't added any mentees yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {mentees.map(student => (
              <div key={student.id} className="border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 hover:border-indigo-200 transition-colors">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.enrollmentNo}</p>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Export Button for this specific student */}
                  <div className="flex-1 sm:flex-none">
                    <ExportButton 
                      studentId={student.id} 
                      label="Export Data" 
                    />
                  </div>
                  
                  {/* Remove Student Button */}
                  <form action={removeStudentFromMentor}>
                    <input type="hidden" name="studentId" value={student.id} />
                    <button type="submit" className="p-2.5 text-rose-500 hover:bg-rose-100 rounded-xl transition-colors border border-transparent hover:border-rose-200" title="Remove Student">
                      <UserMinus className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}