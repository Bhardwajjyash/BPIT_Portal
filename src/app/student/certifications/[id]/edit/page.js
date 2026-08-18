import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateAndResubmitCertification } from "@/app/actions";

export default async function EditCertificationPage({ params }) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) redirect('/');

  const cert = await prisma.certification.findUnique({
    where: { id }
  });

  if (!cert || cert.studentId !== userId) notFound();
  
  // Security check: Don't allow editing if it's already approved
  if (cert.status === 'APPROVED') {
    redirect('/student/certifications');
  }

  // Format dates for HTML <input type="date"> (YYYY-MM-DD)
  const dateFromStr = cert.dateFrom ? new Date(cert.dateFrom).toISOString().split('T')[0] : '';
  const dateToStr = cert.dateTo ? new Date(cert.dateTo).toISOString().split('T')[0] : '';

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <Link href="/student/certifications" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Certifications
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-2xl font-extrabold text-slate-900">Edit Certification</h1>
          <p className="text-slate-500 font-medium mt-1">Update details to resubmit for mentor review.</p>
        </div>

        <form action={updateAndResubmitCertification} className="p-6 sm:p-8 space-y-6">
          {/* Hidden ID field crucial for the update action */}
          <input type="hidden" name="id" value={cert.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Course Name *</label>
              <input type="text" name="courseName" required defaultValue={cert.courseName} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Semester *</label>
              <input type="number" name="semester" required min="1" max="8" defaultValue={cert.semester} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mode *</label>
              <select name="mode" required defaultValue={cert.mode} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Organized By *</label>
              <input type="text" name="organizedBy" required defaultValue={cert.organizedBy} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Certified By *</label>
              <input type="text" name="certifiedBy" required defaultValue={cert.certifiedBy} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Duration (e.g., 8 Weeks)</label>
              <input type="text" name="duration" defaultValue={cert.duration} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Start Date *</label>
              <input type="date" name="dateFrom" required defaultValue={dateFromStr} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">End Date *</label>
              <input type="date" name="dateTo" required defaultValue={dateToStr} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Max Marks / Grade</label>
              <input type="text" name="maxMarksGrade" defaultValue={cert.maxMarksGrade} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Marks / Grade Obtained</label>
              <input type="text" name="marksObtained" defaultValue={cert.marksObtained} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Key Learnings *</label>
              <textarea name="learnings" required rows="4" defaultValue={cert.learnings} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/student/certifications" className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
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