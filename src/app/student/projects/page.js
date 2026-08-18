import Link from 'next/link';
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { Eye, Edit, Trash2 } from "lucide-react";
import { deleteProject } from "@/app/actions";

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  let projects = [];
  try {
    const rawProjects = await prisma.project.findMany({
      where: { studentId: userId },
      orderBy: { id: 'desc' } // Shows newest added first
    });

    projects = JSON.parse(JSON.stringify(rawProjects));
  } catch (error) {
    console.error("Database fetch error:", error);
  }

  const getStatusBadgeStyles = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-100 border-emerald-300 text-emerald-950';
      case 'REJECTED':
        return 'bg-rose-100 border-rose-300 text-rose-950';
      default:
        return 'bg-amber-100 border-amber-300 text-amber-950';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Projects</h1>
          <p className="text-slate-600 font-medium mt-1">Showcase your technical projects, software builds, and academic work.</p>
        </div>
        <Link 
          href="/student/projects/new" 
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-colors bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Project
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-slate-200">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No projects added yet</h3>
          <p className="text-slate-600 max-w-sm mb-6">Submit your first technical or academic project to build your portfolio.</p>
          <Link href="/student/projects/new" className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline inline-flex items-center">
            Submit your first project &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
              
              {/* Top Section: Info & Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{project.projectName}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border shadow-sm whitespace-nowrap ${getStatusBadgeStyles(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center text-sm font-semibold text-slate-600 gap-3">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {project.type}
                    </span>
                    <span className="text-slate-400 hidden sm:inline">•</span>
                    <span className="flex items-center truncate max-w-[200px] sm:max-w-[300px]">
                      <svg className="w-4 h-4 mr-1.5 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      <span className="truncate">{project.techStack}</span>
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                  <Link 
                    href={`/student/projects/${project.id}`} 
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>

                  {project.status !== 'APPROVED' && (
                    <Link 
                      href={`/student/projects/${project.id}/edit`} 
                      className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                      title="Edit & Resubmit"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                  )}

                  <form action={deleteProject}>
                    <input type="hidden" name="id" value={project.id} />
                    <button 
                      type="submit" 
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                      title="Delete Project"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Bottom Section: Rejection Remarks Alert */}
              {project.status === 'REJECTED' && project.rejectionReason && (
                <div className="mt-1 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                  <div className="mt-0.5 text-rose-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-rose-800 uppercase tracking-wider mb-0.5">Faculty Feedback / Rejection Reason</p>
                    <p className="text-sm font-medium text-rose-700">{project.rejectionReason}</p>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}