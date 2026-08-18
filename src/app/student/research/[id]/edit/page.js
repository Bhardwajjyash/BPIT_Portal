import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateAndResubmitResearchPaper } from "@/app/actions";

export default async function EditResearchPaperPage({ params }) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) redirect('/');

  const paper = await prisma.researchPaper.findUnique({
    where: { id }
  });

  if (!paper || paper.studentId !== userId) notFound();
  
  if (paper.status === 'APPROVED') {
    redirect('/student/research');
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <Link href="/student/research" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Research
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-2xl font-extrabold text-slate-900">Edit Research Paper</h1>
          <p className="text-slate-500 font-medium mt-1">Update details to resubmit for mentor review.</p>
        </div>

        <form action={updateAndResubmitResearchPaper} className="p-6 sm:p-8 space-y-6">
          <input type="hidden" name="id" value={paper.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Paper Title *</label>
              <input type="text" name="title" required defaultValue={paper.title} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Semester *</label>
              <input type="number" name="semester" required min="1" max="8" defaultValue={paper.semester} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Paper Type *</label>
              <select name="type" required defaultValue={paper.type} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="Journal">Journal</option>
                <option value="Conference">Conference</option>
                <option value="Book Chapter">Book Chapter</option>
                <option value="Patent">Patent</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Authors *</label>
              <input type="text" name="authors" required defaultValue={paper.authors} placeholder="e.g., Jane Doe, John Smith" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Journal / Conference Name *</label>
              <input type="text" name="journalName" required defaultValue={paper.journalName} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Published By (Publisher) *</label>
              <input type="text" name="publishedBy" required defaultValue={paper.publishedBy} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Indexing</label>
              <select name="indexing" defaultValue={paper.indexing || ""} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="" disabled>Select Indexing...</option>
                <option value="SCI/SCIE">SCI / SCIE</option>
                <option value="Scopus">Scopus</option>
                <option value="Web of Science">Web of Science</option>
                <option value="UGC Care">UGC Care</option>
                <option value="Peer Reviewed">Peer Reviewed</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Current Status *</label>
              <select name="paperStatus" required defaultValue={paper.paperStatus} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="Published">Published</option>
                <option value="Accepted">Accepted</option>
                <option value="Under Review">Under Review</option>
                <option value="Submitted">Submitted</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Month & Year (e.g., Aug 2024)</label>
              <input type="text" name="monthYear" defaultValue={paper.monthYear} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Volume & Issue (Optional)</label>
              <input type="text" name="volumeIssue" defaultValue={paper.volumeIssue} placeholder="e.g., Vol 12, Issue 3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">DOI URL / Web Link</label>
              <input type="url" name="doiUrl" defaultValue={paper.doiUrl} placeholder="https://doi.org/..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Abstract / Key Learnings *</label>
              <textarea name="learnings" required rows="4" defaultValue={paper.learnings} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/student/research" className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </Link>
            <button type="submit" className="px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm">
              Update & Resubmit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}