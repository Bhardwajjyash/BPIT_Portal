import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateAchievementStatus } from "@/app/actions";
import { ClipboardCheck, CheckCircle, XCircle } from "lucide-react";

export default async function GlobalRequestsPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get('adminId')?.value) redirect('/admin/login');

  // Fetch all pending requests globally, injecting their category types
  const pendingProjects = await prisma.project.findMany({ where: { status: 'PENDING' }, include: { student: true } });
  const pendingExtra = await prisma.extraCurricular.findMany({ where: { status: 'PENDING' }, include: { student: true } });
  const pendingCo = await prisma.coCurricular.findMany({ where: { status: 'PENDING' }, include: { student: true } });
  const pendingCerts = await prisma.certification.findMany({ where: { status: 'PENDING' }, include: { student: true } });
  const pendingResearch = await prisma.researchPaper.findMany({ where: { status: 'PENDING' }, include: { student: true } });

  // Combine and map common properties
  const allRequests = [
    ...pendingProjects.map(i => ({ ...i, titleLabel: i.projectName, category: 'project', tag: 'Project' })),
    ...pendingExtra.map(i => ({ ...i, titleLabel: i.title, category: 'extraCurricular', tag: 'Extra-Curricular' })),
    ...pendingCo.map(i => ({ ...i, titleLabel: i.title, category: 'coCurricular', tag: 'Co-Curricular' })),
    ...pendingCerts.map(i => ({ ...i, titleLabel: i.courseName, category: 'certification', tag: 'Certification' })),
    ...pendingResearch.map(i => ({ ...i, titleLabel: i.title, category: 'researchPaper', tag: 'Research Paper' }))
  ];

  // Sort by newest submission (dateFrom or fallback to id to keep UI consistent)
  allRequests.sort((a, b) => new Date(b.dateFrom || 0) - new Date(a.dateFrom || 0));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Global Pending Requests</h1>
        <p className="text-slate-600 font-medium mt-1">Review and override approvals for all student submissions.</p>
      </div>

      {allRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-slate-200">
            <ClipboardCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">All caught up!</h3>
          <p className="text-slate-600 max-w-sm mb-6">There are no pending requests globally across the department.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {allRequests.map((req) => (
            <div key={req.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 hover:border-indigo-300 transition-colors">
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900">{req.titleLabel}</h3>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase border border-slate-200 bg-slate-100 text-slate-600">
                    {req.tag}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-600 flex flex-wrap items-center gap-2">
                  <span><span className="text-slate-400 font-medium">Student:</span> {req.student.name}</span>
                  <span className="text-slate-300">•</span>
                  <span><span className="text-slate-400 font-medium">Enrollment:</span> {req.student.enrollmentNo}</span>
                  {req.proofUrl && req.proofUrl !== 'https://example.com/no-proof-provided' && (
                    <>
                      <span className="text-slate-300">•</span>
                      <a href={req.proofUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        View Proof File
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons (Approve / Reject with Remarks) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full xl:w-auto border-t xl:border-t-0 border-slate-100 pt-4 xl:pt-0 mt-2 xl:mt-0">
                <form action={updateAchievementStatus} className="flex">
                  <input type="hidden" name="id" value={req.id} />
                  <input type="hidden" name="category" value={req.category} />
                  <input type="hidden" name="status" value="APPROVED" />
                  <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-sm rounded-xl transition-colors">
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                </form>

                <form action={updateAchievementStatus} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full xl:w-auto">
                  <input type="hidden" name="id" value={req.id} />
                  <input type="hidden" name="category" value={req.category} />
                  <input type="hidden" name="status" value="REJECTED" />
                  
                  <input 
                    type="text" 
                    name="remarks" 
                    required 
                    placeholder="Reason for rejection..." 
                    className="w-full sm:w-48 text-sm px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 placeholder-slate-400"
                  />
                  
                  <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-sm rounded-xl transition-colors">
                    <XCircle className="w-4 h-4" /> Reject
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