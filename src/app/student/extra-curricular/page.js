import Link from 'next/link';
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { Eye, Edit, Trash2 } from "lucide-react";
import { deleteExtraCurricular } from "@/app/actions";

export default async function ExtraCurricularPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  let activities = [];
  try {
    const rawActivities = await prisma.extraCurricular.findMany({
      where: { studentId: userId },
      orderBy: { dateFrom: 'desc' }
    });
    
    activities = JSON.parse(JSON.stringify(rawActivities));
  } catch (error) {
    console.error("Database fetch error:", error);
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return "bg-emerald-100 border-emerald-300 text-emerald-800";
      case 'REJECTED':
        return "bg-rose-100 border-rose-300 text-rose-800";
      default: // PENDING
        return "bg-amber-100 border-amber-300 text-amber-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Extra-Curricular Activities</h1>
          <p className="text-slate-600 font-medium mt-1">Track and manage your co-curricular and social involvements.</p>
        </div>
        <Link 
          href="/student/extra-curricular/new" 
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-colors bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Activity
        </Link>
      </div>

      {!activities || activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-slate-200">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No activities found</h3>
          <p className="text-slate-600 max-w-sm mb-6">You haven't recorded any extra-curricular activities yet. Start building your portfolio.</p>
          <Link href="/student/extra-curricular/new" className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline inline-flex items-center">
            Create your first entry &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {activities.map((item) => (
            <div key={item.id} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
              
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{item.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border shadow-sm whitespace-nowrap ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center text-sm font-semibold text-slate-600 gap-3">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {item.type}
                  </span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Organized by {item.organizedBy}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                
                <Link 
                  href={`/student/extra-curricular/${item.id}`} 
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </Link>

                {item.status !== 'APPROVED' && (
                  <Link 
                    href={`/student/extra-curricular/${item.id}/edit`} 
                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                    title="Edit & Resubmit"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                )}

                <form action={deleteExtraCurricular}>
                  <input type="hidden" name="id" value={item.id} />
                  <button 
                    type="submit" 
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                    title="Delete Activity"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </form>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}