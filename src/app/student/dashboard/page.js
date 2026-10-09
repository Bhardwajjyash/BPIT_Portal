import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { 
  UserCircle, 
  FolderGit2, 
  Sparkles, 
  BookOpen, 
  Award, 
  FileText,
  Activity,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import ExportButton from "@/components/ExportButton";
import ProfileAvatar from "@/components/ProfileAvatar";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export default async function StudentProfile() {
  // 1. Get the current user's ID from their session cookie
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  // 2. Fetch specific details + Mentor info + Activity Statuses for counting
  const student = await prisma.student.findUnique({
    where: { id: userId },
    include: {
      mentor: true,
      projects: { select: { status: true } },
      extraCurriculars: { select: { status: true } },
      coCurriculars: { select: { status: true } },
      certifications: { select: { status: true } },
      researchPapers: { select: { status: true } },
    }
  });

  // Enhanced Error State
  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full text-center shadow-sm">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-red-900 mb-2">Record Not Found</h2>
          <p className="text-red-700 text-sm">We couldn't locate this student profile. Please verify your session and try again.</p>
        </div>
      </div>
    );
  }

  // Extract initials for the avatar
  const initials = student.name
    ? student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'ST';

  // Helper function to calculate total, verified, pending, and rejected counts
  const getStats = (items) => {
    const total = items?.length || 0;
    const verified = items?.filter(i => i.status === 'APPROVED').length || 0;
    const pending = items?.filter(i => i.status === 'PENDING').length || 0;
    const rejected = items?.filter(i => i.status === 'REJECTED').length || 0;
    return { total, verified, pending, rejected };
  };

  // Calculate stats for each category
  const projStats = getStats(student.projects);
  const extraStats = getStats(student.extraCurriculars);
  const coStats = getStats(student.coCurriculars);
  const certStats = getStats(student.certifications);
  const researchStats = getStats(student.researchPapers);

  // Calculate Grand Totals
  const grandTotal = projStats.total + extraStats.total + coStats.total + certStats.total + researchStats.total;
  const grandVerified = projStats.verified + extraStats.verified + coStats.verified + certStats.verified + researchStats.verified;
  const grandPending = projStats.pending + extraStats.pending + coStats.pending + certStats.pending + researchStats.pending;
  const grandRejected = projStats.rejected + extraStats.rejected + coStats.rejected + certStats.rejected + researchStats.rejected;

  // Enhanced Stat Card Component with 3 badges
  const StatCard = ({ icon: Icon, label, stats, colorClass }) => (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-slate-700">{label}</span>
        </div>
        <span className="text-2xl font-extrabold text-slate-900">{stats.total}</span>
      </div>
      
      {/* Verification Breakdown Footer */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold pt-3 border-t border-slate-200/60 mt-auto">
        <span className="flex items-center gap-1 text-emerald-700 bg-emerald-100/70 px-1.5 py-1 rounded-md" title="Approved">
          <CheckCircle2 className="w-3 h-3" />
          {stats.verified}
        </span>
        <span className="flex items-center gap-1 text-amber-700 bg-amber-100/70 px-1.5 py-1 rounded-md" title="Pending">
          <Clock className="w-3 h-3" />
          {stats.pending}
        </span>
        <span className="flex items-center gap-1 text-rose-700 bg-rose-100/70 px-1.5 py-1 rounded-md" title="Rejected">
          <XCircle className="w-3 h-3" />
          {stats.rejected}
        </span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          
          {/* Use the new interactive component here */}
          <ProfileAvatar 
            currentPic={student.profilePic} 
            initials={initials} 
            studentName={student.name} 
          />
          
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Profile</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your academic details and view your progress.</p>
          </div>
        </div>
        
        {/* Export Button aligned to the right */}
        <div className="flex-shrink-0">
          <ExportButton label="Export My Data" />
        </div>
      </div>
      
      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Decorative top border */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 w-full"></div>
        
        <div className="p-6 sm:p-8">
          
          {/* --- SECTION 1: Personal Details --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Full Name</p>
              <p className="text-lg font-semibold text-slate-900">{student.name}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Enrollment Number</p>
              <p className="text-lg font-semibold text-slate-900">
                {student.enrollmentNo || <span className="text-slate-400 italic font-medium">Not provided</span>}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Email Address</p>
              <p className="text-lg font-semibold text-slate-900">{student.email}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Account Role</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700 capitalize">
                student
              </span>
            </div>
          </div>

          {/* --- SECTION 2: Academic & Activity Summary --- */}
          <div className="mt-8 pt-8 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Activity & Mentorship Summary
            </h2>

            {/* Mentor & Global Stats Information Block */}
            <div className="mb-6 bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-wider text-indigo-500 uppercase mb-1">Assigned Faculty Mentor</p>
                <div className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-indigo-700" />
                  <p className="text-lg font-bold text-indigo-900">
                    {student.mentor ? student.mentor.name : 'No Mentor Assigned Yet'}
                  </p>
                </div>
              </div>
              
              {/* Grand Total Breakdown Block */}
              <div className="sm:text-right flex items-center sm:block">
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Total Submissions</p>
                </div>
                <div className="flex items-center sm:justify-end gap-3">
                  <p className="text-4xl font-extrabold text-indigo-600 leading-none mr-1">{grandTotal}</p>
                  <div className="flex flex-col text-left gap-1">
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded leading-none uppercase tracking-wider">
                      {grandVerified} Verified
                    </span>
                    <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded leading-none uppercase tracking-wider">
                      {grandPending} Pending
                    </span>
                    <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded leading-none uppercase tracking-wider">
                      {grandRejected} Rejected
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard 
                icon={FolderGit2} 
                label="Projects" 
                stats={projStats} 
                colorClass="bg-blue-100 text-blue-600" 
              />
              <StatCard 
                icon={Sparkles} 
                label="Extra-Curricular" 
                stats={extraStats} 
                colorClass="bg-amber-100 text-amber-600" 
              />
              <StatCard 
                icon={BookOpen} 
                label="Co-Curricular" 
                stats={coStats} 
                colorClass="bg-purple-100 text-purple-600" 
              />
              <StatCard 
                icon={Award} 
                label="Certifications" 
                stats={certStats} 
                colorClass="bg-emerald-100 text-emerald-600" 
              />
              <StatCard 
                icon={FileText} 
                label="Research Papers" 
                stats={researchStats} 
                colorClass="bg-rose-100 text-rose-600" 
              />
            </div>
            <ChangePasswordForm />
          </div>

        </div>
      </div>
    </div>
  );
}