import Link from 'next/link';
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { Eye, Edit, Trash2 } from "lucide-react";
import { deleteResearchPaper } from "@/app/actions";

export default async function ResearchPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  let papers = [];
  try {
    const rawPapers = await prisma.researchPaper.findMany({
      where: { studentId: userId },
      orderBy: { id: 'desc' } // Order by newest added
    });

    papers = JSON.parse(JSON.stringify(rawPapers));
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
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Research Papers</h1>
          <p className="text-slate-600 font-medium mt-1">Manage and track your academic research, journal submissions, and publications.</p>
        </div>
        <Link 
          href="/student/research/new" 
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-colors bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Paper
        </Link>
      </div>

      {!papers || papers.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-slate-200">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No research papers found</h3>
          <p className="text-slate-600 max-w-sm mb-6">You haven't recorded any research submissions or publications yet.</p>
          <Link href="/student/research/new" className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline inline-flex items-center">
            Add your first research paper &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {papers.map((paper) => (
            <div key={paper.id} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
              
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{paper.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border shadow-sm whitespace-nowrap ${getStatusBadge(paper.status)}`}>
                    {paper.status}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center text-sm font-semibold text-slate-600 gap-3">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    {paper.journalName}
                  </span>
                  {paper.paperStatus && (
                    <>
                      <span className="text-slate-400 hidden sm:inline">•</span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {paper.paperStatus}
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                <Link 
                  href={`/student/research/${paper.id}`} 
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </Link>

                {paper.status !== 'APPROVED' && (
                  <Link 
                    href={`/student/research/${paper.id}/edit`} 
                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                    title="Edit & Resubmit"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                )}

                <form action={deleteResearchPaper}>
                  <input type="hidden" name="id" value={paper.id} />
                  <button 
                    type="submit" 
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                    title="Delete Paper"
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