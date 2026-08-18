import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateAchievementStatus } from "@/app/actions";
import { ClipboardList, CheckCircle, XCircle, Eye, X, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function PendingRequestsPage({ searchParams }) {
  const cookieStore = await cookies();
  const facultyId = cookieStore.get('facultyId')?.value;
  if (!facultyId) redirect('/faculty/login');

  const params = await searchParams;
  const viewId = params?.viewId;
  const viewCategory = params?.category;

  // Fetch mentees and ALL their pending achievements
  const mentees = await prisma.student.findMany({
    where: { mentorId: facultyId },
    include: {
      projects: { where: { status: 'PENDING' } },
      extraCurriculars: { where: { status: 'PENDING' } },
      coCurriculars: { where: { status: 'PENDING' } },
      certifications: { where: { status: 'PENDING' } },
      researchPapers: { where: { status: 'PENDING' } }
    }
  });

  const pendingRequests = [];

  mentees.forEach(student => {
    student.projects.forEach(p => pendingRequests.push({
      id: p.id,
      category: 'project',
      label: 'Project',
      title: p.projectName,
      studentName: student.name,
      enrollmentNo: student.enrollmentNo,
      fullData: p
    }));
    student.extraCurriculars?.forEach(e => pendingRequests.push({
      id: e.id,
      category: 'extraCurricular',
      label: 'Extra-Curricular',
      title: e.title,
      studentName: student.name,
      enrollmentNo: student.enrollmentNo,
      fullData: e
    }));
    student.coCurriculars?.forEach(c => pendingRequests.push({
      id: c.id,
      category: 'coCurricular',
      label: 'Co-Curricular',
      title: c.title,
      studentName: student.name,
      enrollmentNo: student.enrollmentNo,
      fullData: c
    }));
    student.certifications?.forEach(c => pendingRequests.push({
      id: c.id,
      category: 'certification',
      label: 'Certification',
      title: c.courseName,
      studentName: student.name,
      enrollmentNo: student.enrollmentNo,
      fullData: c
    }));
    student.researchPapers?.forEach(r => pendingRequests.push({
      id: r.id,
      category: 'researchPaper',
      label: 'Research Paper',
      title: r.title,
      studentName: student.name,
      enrollmentNo: student.enrollmentNo,
      fullData: r
    }));
  });

  const selectedRequest = pendingRequests.find(r => r.id === viewId && r.category === viewCategory);

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Helper function for rendering detail rows
  const DetailRow = ({ label, value, isLink }) => {
    if (!value) return null; // Hide the row entirely if the student didn't provide this optional info
    return (
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        {isLink ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-indigo-600 hover:underline flex items-center gap-1 truncate block">
            Open Link <ExternalLink className="w-3 h-3 flex-shrink-0" />
          </a>
        ) : (
          <p className="text-sm font-semibold text-slate-800 break-words whitespace-pre-wrap">{value}</p>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* ------------------------------------- */}
      {/* MAIN LIST VIEW                        */}
      {/* ------------------------------------- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <ClipboardList className="text-indigo-600 w-5 h-5" />
          <h2 className="text-lg font-bold text-slate-900">Pending Mentee Approvals</h2>
        </div>
        
        {pendingRequests.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl py-12 flex flex-col items-center justify-center">
            <CheckCircle className="w-12 h-12 text-emerald-400 mb-3" />
            <p className="text-slate-500 text-sm font-medium">All caught up! No pending requests found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map((req, index) => (
              <div key={`${req.category}-${req.id}-${index}`} className="border border-slate-200 rounded-xl p-5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                      {req.label}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      {req.studentName} ({req.enrollmentNo})
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{req.title}</h3>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full xl:w-auto mt-2 xl:mt-0">
                  <Link 
                    href={`?viewId=${req.id}&category=${req.category}`}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl shadow-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                  
                  <form action={updateAchievementStatus}>
                    <input type="hidden" name="id" value={req.id} />
                    <input type="hidden" name="category" value={req.category} />
                    <input type="hidden" name="status" value="APPROVED" />
                    <button type="submit" className="flex w-full sm:w-auto items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                  </form>
                  
                  {/* Updated Reject Form with Remarks Input */}
                  <form action={updateAchievementStatus} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full xl:w-auto">
                    <input type="hidden" name="id" value={req.id} />
                    <input type="hidden" name="category" value={req.category} />
                    <input type="hidden" name="status" value="REJECTED" />
                    <input 
                      type="text" 
                      name="remarks" 
                      required 
                      placeholder="Rejection remark..." 
                      className="w-full sm:w-36 text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder-slate-400"
                    />
                    <button type="submit" className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-600 bg-rose-100 hover:bg-rose-200 rounded-xl shadow-sm transition-colors">
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------------------------- */}
      {/* FULL DETAIL MODAL OVERLAY             */}
      {/* ------------------------------------- */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                    {selectedRequest.label}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Submitted by {selectedRequest.studentName}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 pr-4">{selectedRequest.title}</h2>
              </div>
              
              <Link 
                href="/faculty/dashboard/requests" 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </Link>
            </div>

            {/* Modal Body (Scrollable with ALL fields) */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. PROJECT DETAILS */}
                {selectedRequest.category === 'project' && (
                  <>
                    <DetailRow label="Semester" value={`Semester ${selectedRequest.fullData.semester}`} />
                    <DetailRow label="Project Type" value={selectedRequest.fullData.type} />
                    <DetailRow label="Development Status" value={selectedRequest.fullData.projectStatus} />
                    <DetailRow label="Tech Stack" value={selectedRequest.fullData.techStack} />
                    <DetailRow label="Supervisor / Guide" value={selectedRequest.fullData.supervisor} />
                    <DetailRow label="Organization / Client" value={selectedRequest.fullData.organization} />
                    <DetailRow label="Start Date" value={formatDate(selectedRequest.fullData.dateFrom)} />
                    <DetailRow label="End Date" value={formatDate(selectedRequest.fullData.dateTo)} />
                    <DetailRow label="GitHub / Repo Link" value={selectedRequest.fullData.githubLink} isLink />
                  </>
                )}

                {/* 2. EXTRA-CURRICULAR & CO-CURRICULAR DETAILS */}
                {(selectedRequest.category === 'extraCurricular' || selectedRequest.category === 'coCurricular') && (
                  <>
                    <DetailRow label="Semester" value={`Semester ${selectedRequest.fullData.semester}`} />
                    <DetailRow label="Activity Type" value={selectedRequest.fullData.type} />
                    <DetailRow label="Mode" value={selectedRequest.fullData.mode} />
                    <DetailRow label="Organized By" value={selectedRequest.fullData.organizedBy} />
                    <DetailRow label="Place / Location" value={selectedRequest.fullData.place} />
                    <DetailRow label="Level" value={selectedRequest.fullData.level} />
                    <DetailRow label="Role" value={selectedRequest.fullData.role} />
                    <DetailRow label="Position Achieved" value={selectedRequest.fullData.position} />
                    <DetailRow label="Prize Money" value={selectedRequest.fullData.prizeMoney} />
                    <DetailRow label="Team Members" value={selectedRequest.fullData.teamMembers} />
                    <DetailRow label="Duration" value={selectedRequest.fullData.duration} />
                    <DetailRow label="Start Date" value={formatDate(selectedRequest.fullData.dateFrom)} />
                    <DetailRow label="End Date" value={formatDate(selectedRequest.fullData.dateTo)} />
                  </>
                )}

                {/* 3. CERTIFICATION DETAILS */}
                {selectedRequest.category === 'certification' && (
                  <>
                    <DetailRow label="Semester" value={`Semester ${selectedRequest.fullData.semester}`} />
                    <DetailRow label="Mode" value={selectedRequest.fullData.mode} />
                    <DetailRow label="Organized By" value={selectedRequest.fullData.organizedBy} />
                    <DetailRow label="Certified By / Authority" value={selectedRequest.fullData.certifiedBy} />
                    <DetailRow label="Position" value={selectedRequest.fullData.position} />
                    <DetailRow label="Duration" value={selectedRequest.fullData.duration} />
                    <DetailRow label="Max Marks / Total Grade" value={selectedRequest.fullData.maxMarksGrade} />
                    <DetailRow label="Marks / Grade Obtained" value={selectedRequest.fullData.marksObtained} />
                    <DetailRow label="Start Date" value={formatDate(selectedRequest.fullData.dateFrom)} />
                    <DetailRow label="End Date" value={formatDate(selectedRequest.fullData.dateTo)} />
                  </>
                )}

                {/* 4. RESEARCH PAPER DETAILS */}
                {selectedRequest.category === 'researchPaper' && (
                  <>
                    <DetailRow label="Semester" value={`Semester ${selectedRequest.fullData.semester}`} />
                    <DetailRow label="Paper Type" value={selectedRequest.fullData.type} />
                    <DetailRow label="Authors" value={selectedRequest.fullData.authors} />
                    <DetailRow label="Journal / Conference Name" value={selectedRequest.fullData.journalName} />
                    <DetailRow label="Published By" value={selectedRequest.fullData.publishedBy} />
                    <DetailRow label="Indexing" value={selectedRequest.fullData.indexing} />
                    <DetailRow label="Paper Status" value={selectedRequest.fullData.paperStatus} />
                    <DetailRow label="Month & Year" value={selectedRequest.fullData.monthYear} />
                    <DetailRow label="Volume / Issue" value={selectedRequest.fullData.volumeIssue} />
                    <DetailRow label="DOI URL" value={selectedRequest.fullData.doiUrl} isLink />
                  </>
                )}

                {/* 5. COMMON LONG-FORM TEXT & ATTACHMENTS (Spans full width) */}
                <div className="sm:col-span-2 space-y-4 mt-2">
                  <DetailRow 
                    label={selectedRequest.category === 'project' ? "Project Description" : "Key Learnings / Description"} 
                    value={selectedRequest.fullData.description || selectedRequest.fullData.learnings} 
                  />
                  
                  {/* Show second long-form field if the model has both (e.g. projects have both description and learnings) */}
                  {selectedRequest.category === 'project' && selectedRequest.fullData.learnings && (
                     <DetailRow label="Key Learnings" value={selectedRequest.fullData.learnings} />
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailRow label="Proof Document / Certificate" value={selectedRequest.fullData.proofUrl} isLink />
                    <DetailRow label="Event Photo / Screenshot" value={selectedRequest.fullData.photoUrl} isLink />
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer (Action Buttons) */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link 
                href="/faculty/dashboard/requests"
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-slate-600 text-center bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors order-last sm:order-first"
              >
                Close
              </Link>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {/* Updated Reject Form for Modal */}
                <form action={updateAchievementStatus} className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <input type="hidden" name="id" value={selectedRequest.id} />
                  <input type="hidden" name="category" value={selectedRequest.category} />
                  <input type="hidden" name="status" value="REJECTED" />
                  <input 
                    type="text" 
                    name="remarks" 
                    required 
                    placeholder="Reason for rejection..." 
                    className="w-full sm:w-48 text-sm px-3 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder-slate-400"
                  />
                  <button type="submit" className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-xl shadow-sm transition-colors whitespace-nowrap">
                    Reject
                  </button>
                </form>
                
                <form action={updateAchievementStatus} className="w-full sm:w-auto">
                  <input type="hidden" name="id" value={selectedRequest.id} />
                  <input type="hidden" name="category" value={selectedRequest.category} />
                  <input type="hidden" name="status" value="APPROVED" />
                  <button type="submit" className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors whitespace-nowrap">
                    Approve Request
                  </button>
                </form>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}