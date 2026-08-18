import Link from "next/link";
import { createMentor } from "@/app/actions";
import { UserPlus, ArrowLeft } from "lucide-react";

export default function AddMentorPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/dashboard/faculty" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Mentors
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Add New Mentor</h1>
            <p className="text-slate-500 font-medium mt-1">Create a new faculty account for mentorship.</p>
          </div>
        </div>

        <form action={createMentor} className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
              <input type="text" name="name" required placeholder="e.g. Dr. John Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
              <input type="email" name="email" required placeholder="faculty@institute.edu" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password *</label>
              <input type="text" name="password" required placeholder="Set initial password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Designation *</label>
              <input type="text" name="designation" required placeholder="e.g. Assistant Professor" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Department *</label>
              <input type="text" name="department" required placeholder="e.g. Information Technology" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <Link href="/admin/dashboard/faculty" className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </Link>
            <button type="submit" className="px-6 py-3 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm">
              Create Mentor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}