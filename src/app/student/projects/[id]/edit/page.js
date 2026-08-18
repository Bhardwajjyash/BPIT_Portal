import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { updateAndResubmitProject } from "@/app/actions";

export default async function EditProjectPage({ params }) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) redirect('/');

  const project = await prisma.project.findUnique({
    where: { id }
  });

  if (!project || project.studentId !== userId) notFound();
  
  if (project.status === 'APPROVED') {
    redirect('/student/projects');
  }

  const dateFromStr = project.dateFrom ? new Date(project.dateFrom).toISOString().split('T')[0] : '';
  const dateToStr = project.dateTo ? new Date(project.dateTo).toISOString().split('T')[0] : '';

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <Link href="/student/projects" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Projects
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-2xl font-extrabold text-slate-900">Edit Project</h1>
          <p className="text-slate-500 font-medium mt-1">Update details to resubmit for mentor review.</p>
        </div>

        <form action={updateAndResubmitProject} className="p-6 sm:p-8 space-y-6">
          <input type="hidden" name="id" value={project.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Project Name *</label>
              <input type="text" name="projectName" required defaultValue={project.projectName} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Semester *</label>
              <input type="number" name="semester" required min="1" max="8" defaultValue={project.semester} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Type *</label>
              <select name="type" required defaultValue={project.type} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="Website">Website</option>
                <option value="Web Dev">Web Dev</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Hardware">Hardware</option>
                <option value="Research">Research</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Status *</label>
              <select name="projectStatus" required defaultValue={project.projectStatus} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="Working">Working</option>
                <option value="Live">Live</option>
                <option value="Deployed">Deployed</option>
              </select>
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
              <label className="block text-sm font-bold text-slate-700 mb-2">GitHub / Repo Link</label>
              <input type="url" name="githubLink" defaultValue={project.githubLink} placeholder="https://github.com/..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Supervisor Name</label>
              <input type="text" name="supervisor" defaultValue={project.supervisor} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Team Members</label>
              <input type="text" name="teamMembers" defaultValue={project.teamMembers} placeholder="Comma separated names" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Tech Stack / Tools *</label>
              <input type="text" name="techStack" required defaultValue={project.techStack} placeholder="e.g., React, Node.js, Express" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Project Description *</label>
              <textarea name="description" required rows="4" defaultValue={project.description} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Learnings / Outcomes *</label>
              <textarea name="learnings" required rows="3" defaultValue={project.learnings} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/student/projects" className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
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