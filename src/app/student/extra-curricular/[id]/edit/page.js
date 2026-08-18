import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateAndResubmitExtraCurricular } from "@/app/actions";

export default async function EditExtraCurricularPage({ params }) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) redirect('/');

  const activity = await prisma.extraCurricular.findUnique({
    where: { id }
  });

  if (!activity || activity.studentId !== userId) notFound();
  
  if (activity.status === 'APPROVED') {
    redirect('/student/extra-curricular');
  }

  const dateFromStr = activity.dateFrom ? new Date(activity.dateFrom).toISOString().split('T')[0] : '';
  const dateToStr = activity.dateTo ? new Date(activity.dateTo).toISOString().split('T')[0] : '';

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <Link href="/student/extra-curricular" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Activities
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-2xl font-extrabold text-slate-900">Edit Activity</h1>
          <p className="text-slate-500 font-medium mt-1">Update details to resubmit for mentor review.</p>
        </div>

        <form action={updateAndResubmitExtraCurricular} className="p-6 sm:p-8 space-y-6">
          <input type="hidden" name="id" value={activity.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Activity Title *</label>
              <input type="text" name="title" required defaultValue={activity.title} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Semester *</label>
              <input type="number" name="semester" required min="1" max="8" defaultValue={activity.semester} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Activity Type *</label>
              <select name="type" required defaultValue={activity.type} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="Sports">Sports</option>
                <option value="Cultural">Cultural</option>
                <option value="Social Work">Social Work</option>
                <option value="NCC/NSS">NCC / NSS</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mode *</label>
              <select name="mode" required defaultValue={activity.mode} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Level *</label>
              <select name="level" required defaultValue={activity.level} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="College">College</option>
                <option value="State">State</option>
                <option value="National">National</option>
                <option value="International">International</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Organized By *</label>
              <input type="text" name="organizedBy" required defaultValue={activity.organizedBy} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Place / Location *</label>
              <input type="text" name="place" required defaultValue={activity.place} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
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
              <label className="block text-sm font-bold text-slate-700 mb-2">Duration</label>
              <input type="text" name="duration" defaultValue={activity.duration} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Role *</label>
              <input type="text" name="role" required defaultValue={activity.role} placeholder="Player, Volunteer, etc." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Position / Rank</label>
              <input type="text" name="position" defaultValue={activity.position} placeholder="e.g., Winner, Captain" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Prize Money / Award</label>
              <input type="text" name="prizeMoney" defaultValue={activity.prizeMoney} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Team Members (if any)</label>
              <input type="text" name="teamMembers" defaultValue={activity.teamMembers} placeholder="Comma separated names" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Key Learnings / Description *</label>
              <textarea name="learnings" required rows="4" defaultValue={activity.learnings} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/student/extra-curricular" className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
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