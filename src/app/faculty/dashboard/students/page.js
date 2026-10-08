import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { assignStudentToMentor, removeStudentFromMentor } from "@/app/actions";
import { UserPlus, Search, UserMinus, ChevronDown } from "lucide-react";
import ExportButton from "@/components/ExportButton";

// Helper to convert full department names to acronyms (e.g., "Information Technology" -> "IT")
const getShortDept = (name) => {
  if (!name) return 'Dept';
  if (name.includes('Data Science')) return 'CSE-DS';
  if (name.includes('Computer Science & Engineering')) return 'CSE';
  if (name.includes('Information Technology')) return 'IT';
  if (name.includes('Electronics & Communication')) return 'ECE';
  if (name.includes('Electrical & Electronics')) return 'EEE';
  return name;
};

export default async function ManageStudentsPage({ searchParams }) {
  const cookieStore = await cookies();
  const facultyId = cookieStore.get('facultyId')?.value;
  if (!facultyId) redirect('/faculty/login');

  const params = await searchParams;
  const searchQuery = params?.query || '';

  // 1. Fetch current Faculty details (to get their department)
  const faculty = await prisma.faculty.findUnique({
    where: { id: facultyId },
    select: { departmentName: true }
  });

  const shortDept = getShortDept(faculty?.departmentName);

  // 2. Fetch currently assigned mentees
  const mentees = await prisma.student.findMany({
    where: { mentorId: facultyId },
    orderBy: { name: 'asc' }
  });

  // 3. Fetch search result if query exists (now accepts 10 OR 11 digits)
  let searchResult = null;
  if (searchQuery.length >= 10 && searchQuery.length <= 11) {
    searchResult = await prisma.student.findUnique({
      where: { enrollmentNo: searchQuery }
    });
  }

  // 4. Fetch all students in the faculty's department to populate the section groups
  const deptStudents = await prisma.student.findMany({
    where: { 
      departmentName: faculty?.departmentName || undefined 
    },
    orderBy: [
      { section: 'asc' },
      { name: 'asc' }
    ]
  });

  // 5. Group students by section
  const groupedStudents = deptStudents.reduce((acc, student) => {
    const sec = student.section || 'Unassigned';
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(student);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      
      {/* Search and Add Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-2">
          <UserPlus className="text-indigo-600 w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-900">Search & Add Mentee</h2>
        </div>
        <p className="text-sm text-slate-600 mb-6">Enter a 10 or 11-digit enrollment number to search the database directly.</p>
        
        {/* Search Form */}
        <form className="flex flex-col sm:flex-row gap-3 mb-6" method="GET">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              name="query"
              defaultValue={searchQuery}
              pattern="[0-9]{10,11}"
              placeholder="e.g. 08220803123" 
              // 🔧 FIX: Added text-slate-900 so typed text is dark and visible
              className="text-slate-900 placeholder:text-slate-400 w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
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
        <h2 className="text-lg font-bold text-slate-900 mb-4">Your Assigned Mentees ({mentees.length})</h2>
        {mentees.length === 0 ? (
          <p className="text-sm text-slate-500">You haven't added any mentees yet. Search above or browse sections below to add them.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentees.map(student => (
              <div key={student.id} className="border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 hover:border-indigo-200 transition-colors">
                <div className="truncate w-full pr-4">
                  <p className="font-bold text-slate-900 text-sm truncate">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.enrollmentNo} • Sec {student.section}</p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <ExportButton 
                    studentId={student.id} 
                    label="Export" 
                  />
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

      {/* Browse Department Sections (Accordion UI without client-side state) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Browse {shortDept} Students</h2>
        <p className="text-sm text-slate-600 mb-6">Expand a section to quickly find and add students to your mentee list.</p>
        
        <div className="space-y-3">
          {Object.keys(groupedStudents).map(section => (
            <details 
              key={section} 
              className="group border border-slate-200 rounded-xl bg-slate-50 overflow-hidden open:bg-white open:shadow-sm transition-all"
            >
              <summary className="p-4 font-bold text-slate-800 cursor-pointer flex justify-between items-center hover:bg-slate-100 group-open:bg-indigo-50 group-open:text-indigo-800 transition-colors list-none [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-2">
                  <ChevronDown className="w-4 h-4 text-slate-400 group-open:-rotate-180 transition-transform duration-200" />
                  <span>{shortDept} - Section {section}</span>
                </div>
                <span className="text-xs font-semibold bg-white border border-slate-200 px-3 py-1 rounded-full group-open:bg-indigo-100 group-open:border-indigo-200 text-slate-600 group-open:text-indigo-700">
                  {groupedStudents[section].length} Students
                </span>
              </summary>
              
              <div className="p-4 border-t border-slate-100 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                  {groupedStudents[section].map(student => (
                    <div key={student.id} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-indigo-200 transition-colors">
                      <div className="overflow-hidden pr-3">
                        <p className="text-sm font-bold text-slate-900 truncate">{student.name}</p>
                        <p className="text-xs text-slate-500 truncate">{student.enrollmentNo}</p>
                      </div>
                      
                      {/* Status/Action Buttons */}
                      <div className="shrink-0">
                        {student.mentorId === facultyId ? (
                          <span className="inline-block text-[10px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-md">
                            Added
                          </span>
                        ) : student.mentorId ? (
                          <span className="inline-block text-[10px] uppercase tracking-wider font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-md" title="Assigned to someone else">
                            Taken
                          </span>
                        ) : (
                          <form action={assignStudentToMentor}>
                            <input type="hidden" name="enrollmentNo" value={student.enrollmentNo} />
                            <button type="submit" className="text-[10px] uppercase tracking-wider font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-600 hover:text-white border border-indigo-200 hover:border-indigo-600 px-3 py-1.5 rounded-md transition-colors">
                              Add
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>

    </div>
  );
}