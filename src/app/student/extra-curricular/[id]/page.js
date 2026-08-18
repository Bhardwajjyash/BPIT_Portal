import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default async function ViewExtraCurricularPage({ params }) {
  const { id } = await params;
  
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;
  if (!userId) redirect('/');

  const activity = await prisma.extraCurricular.findUnique({
    where: { id }
  });

  if (!activity || activity.studentId !== userId) {
    notFound();
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getStatusBadge = (status) => {
    if (status === 'APPROVED') return "bg-emerald-100 text-emerald-800";
    if (status === 'REJECTED') return "bg-rose-100 text-rose-800";
    return "bg-amber-100 text-amber-800";
  };

  const Detail = ({ label, value, isLink }) => (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</p>
      {isLink && value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
          Open Link <ExternalLink className="w-4 h-4" />
        </a>
      ) : (
        <p className="text-sm font-semibold text-slate-900 whitespace-pre-wrap">{value || 'N/A'}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      
      <Link href="/student/extra-curricular" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Activities
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-t-2xl shadow-sm border border-slate-200 border-b-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-extrabold text-slate-900">{activity.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${getStatusBadge(activity.status)}`}>
              {activity.status}
            </span>
          </div>
          <p className="text-slate-500 font-medium text-sm">Organized by {activity.organizedBy}</p>
        </div>
        
        {activity.status !== 'APPROVED' && (
          <Link href={`/student/extra-curricular/${activity.id}/edit`} className="px-5 py-2.5 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
            Edit Details
          </Link>
        )}
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-b-2xl shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Detail label="Semester" value={`Semester ${activity.semester}`} />
        <Detail label="Activity Type" value={activity.type} />
        <Detail label="Mode" value={activity.mode} />
        <Detail label="Level" value={activity.level} />
        <Detail label="Place" value={activity.place} />
        <Detail label="Duration" value={activity.duration} />
        <Detail label="Your Role" value={activity.role} />
        <Detail label="Position / Rank" value={activity.position} />
        <Detail label="Prize Money" value={activity.prizeMoney} />
        <Detail label="Team Members" value={activity.teamMembers} />
        <Detail label="Start Date" value={formatDate(activity.dateFrom)} />
        <Detail label="End Date" value={formatDate(activity.dateTo)} />
        
        <div className="md:col-span-2">
          <Detail label="Key Learnings / Description" value={activity.learnings} />
        </div>
        <div className="md:col-span-2">
          <Detail label="Proof Document" value={activity.proofUrl} isLink />
        </div>
      </div>
    </div>
  );
}