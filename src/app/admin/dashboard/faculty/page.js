import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Users, 
  Mail, 
  Building2, 
  UserPlus, 
  Trash2,
  CheckCircle2,
  Clock,
  XCircle 
} from "lucide-react";
import BulkUploadModal from "@/components/BulkUploadModal";

export default async function ManageMentorsPage() {
  const cookieStore = await cookies();
  const adminId = cookieStore.get('adminId')?.value;
  if (!adminId) redirect('/admin/login');

  // 1. Fetch Admin to get department scope
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: { departmentName: true }
  });

  // 2. Build where clause for department filtering
  const filterClause = admin?.departmentName 
    ? { departmentName: admin.departmentName } 
    : {};

  // 3. Fetch scoped faculty with their respective counts
  const rawMentors = await prisma.faculty.findMany({
    where: filterClause,
    include: {
      _count: {
        select: { students: true }
      },
      students: {
        select: {
          projects: { select: { status: true } },
          extraCurriculars: { select: { status: true } },
          coCurriculars: { select: { status: true } },
          certifications: { select: { status: true } },
          researchPapers: { select: { status: true } },
        }
      }
    },
    orderBy: { name: 'asc' }
  });

  // Calculate the verification stats for each mentor
  const mentors = rawMentors.map(mentor => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;

    mentor.students.forEach(student => {
      const allAchievements = [
        ...student.projects,
        ...student.extraCurriculars,
        ...student.coCurriculars,
        ...student.certifications,
        ...student.researchPapers
      ];

      allAchievements.forEach(item => {
        if (item.status === 'PENDING') pending++;
        if (item.status === 'APPROVED') approved++;
        if (item.status === 'REJECTED') rejected++;
      });
    });

    return {
      ...mentor,
      stats: { pending, approved, rejected }
    };
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Mentors</h1>
          <p className="text-slate-600 font-medium mt-1">View and manage faculty accounts and their student loads.</p>
        </div>
        <Link 
          href="/admin/dashboard/faculty/new" 
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-colors bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <UserPlus className="w-5 h-5 mr-2 -ml-1" />
          Add New Mentor
        </Link>
      </div>
      <BulkUploadModal type="faculty" />
      {!mentors || mentors.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-slate-200">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No mentors found</h3>
          <p className="text-slate-600 max-w-sm mb-6">You haven't added any faculty members to the system yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mentors.map((mentor) => {
            const initials = mentor.name
              ? mentor.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
              : 'FC';

            return (
              <div key={mentor.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors flex flex-col justify-between">
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    
                    {/* --- DYNAMIC MENTOR PROFILE PICTURE OR INITIALS --- */}
                    <div className="relative w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm overflow-hidden flex-shrink-0 border border-slate-100">
                      {mentor.profilePic ? (
                        <Image 
                          src={mentor.profilePic} 
                          alt={`${mentor.name} Profile`}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{mentor.name}</h3>
                      <p className="text-xs font-semibold text-slate-500">{mentor.designation || 'Faculty'}</p>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button className="text-slate-400 hover:text-rose-600 transition-colors p-1" title="Remove Mentor">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    {mentor.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {/* 🔧 FIX: Changed to mentor.departmentName */}
                    {mentor.departmentName || 'Unassigned Dept'}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Student Load</span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      <Users className="w-3.5 h-3.5 mr-1.5" />
                      {mentor._count.students} Assigned
                    </span>
                  </div>

                  {/* Mentor Workload / Verification Stats */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex flex-1 items-center justify-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1.5 rounded-lg text-xs font-bold" title="Total Approved">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {mentor.stats.approved}
                    </span>
                    <span className="flex flex-1 items-center justify-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1.5 rounded-lg text-xs font-bold" title="Pending Review">
                      <Clock className="w-3.5 h-3.5" /> {mentor.stats.pending}
                    </span>
                    <span className="flex flex-1 items-center justify-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-100 px-2 py-1.5 rounded-lg text-xs font-bold" title="Total Rejected">
                      <XCircle className="w-3.5 h-3.5" /> {mentor.stats.rejected}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}