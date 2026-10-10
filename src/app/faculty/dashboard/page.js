import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { 
  Users, 
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  ClipboardList
} from "lucide-react";
import FacultyProfileAvatar from "@/components/FacultyProfileAvatar"; // <-- Import added
import ChangePasswordForm from "@/components/ChangePasswordForm";

export default async function FacultyProfilePage() {
  // 1. Get the current faculty's ID from their session cookie
  const cookieStore = await cookies();
  const facultyId = cookieStore.get('facultyId')?.value;

  // 2. Fetch their specific details ALONG with their students and achievement statuses
  const faculty = await prisma.faculty.findUnique({
    where: { id: facultyId },
    include: {
      students: {
        include: {
          projects: { select: { status: true } },
          extraCurriculars: { select: { status: true } },
          coCurriculars: { select: { status: true } },
          certifications: { select: { status: true } },
          researchPapers: { select: { status: true } },
        }
      }
    }
  });

  // Enhanced Error State matching the student theme
  if (!faculty) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full text-center shadow-sm">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-red-900 mb-2">Record Not Found</h2>
          <p className="text-red-700 text-sm">We couldn't locate this faculty profile. Please verify your session and try again.</p>
        </div>
      </div>
    );
  }

  // Extract initials for the avatar
  const initials = faculty.name
    ? faculty.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'FC';

  // --- Calculate Dashboard Stats ---
  const totalStudents = faculty.students.length;
  let pendingCount = 0;
  let approvedCount = 0;
  let rejectedCount = 0;

  faculty.students.forEach(student => {
    const allAchievements = [
      ...student.projects,
      ...student.extraCurriculars,
      ...student.coCurriculars,
      ...student.certifications,
      ...student.researchPapers
    ];

    allAchievements.forEach(item => {
      if (item.status === 'PENDING') pendingCount++;
      if (item.status === 'APPROVED') approvedCount++;
      if (item.status === 'REJECTED') rejectedCount++;
    });
  });

  const totalRequests = pendingCount + approvedCount + rejectedCount;

  // Helper component for summary stat cards
  const StatCard = ({ icon: Icon, label, count, colorClass, borderClass }) => (
    <div className={`bg-slate-50 rounded-xl p-5 border ${borderClass} flex flex-col hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>
      <span className="text-3xl font-extrabold text-slate-900">{count}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8 flex items-center space-x-4">
        
        {/* --- DYNAMIC FACULTY AVATAR --- */}
        <FacultyProfileAvatar 
          currentPic={faculty.profilePic} 
          initials={initials} 
          name={faculty.name} 
        />
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Faculty Profile</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your details and view verification statistics.</p>
        </div>
      </div>
      
      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Decorative top border matching student theme */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 w-full"></div>
        
        <div className="p-6 sm:p-8">
          
          {/* --- SECTION 1: Personal Details --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Full Name</p>
              <p className="text-lg font-semibold text-slate-900">{faculty.name}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Email Address</p>
              <p className="text-lg font-semibold text-slate-900">{faculty.email}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Designation</p>
              <p className="text-lg font-semibold text-slate-900">
                {faculty.designation || <span className="text-slate-400 italic font-medium">Not provided</span>}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Department</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700">
                {faculty.departmentName || 'Not specified'}
              </span>
            </div>
          </div>

          {/* --- SECTION 2: Mentorship & Verification Summary --- */}
          <div className="mt-8 pt-8 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Mentorship & Verification Overview
            </h2>

            {/* Global Stats Block */}
            <div className="mb-6 bg-indigo-50/50 border border-indigo-100 rounded-xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold tracking-wider text-indigo-500 uppercase mb-1">Assigned Mentees</p>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-700" />
                  <p className="text-2xl font-extrabold text-indigo-900">
                    {totalStudents} <span className="text-sm font-bold text-indigo-600">Students</span>
                  </p>
                </div>
              </div>
              
              <div className="text-right hidden sm:block border-l border-indigo-200 pl-6">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">Total Submissions Tracked</p>
                <div className="flex items-center justify-end gap-2 text-indigo-600">
                  <ClipboardList className="w-6 h-6" />
                  <p className="text-3xl font-extrabold leading-none">{totalRequests}</p>
                </div>
              </div>
            </div>

            {/* Detailed Status Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard 
                icon={Clock} 
                label="Pending Review" 
                count={pendingCount} 
                colorClass="bg-amber-100 text-amber-600" 
                borderClass="border-amber-200"
              />
              <StatCard 
                icon={CheckCircle2} 
                label="Approved" 
                count={approvedCount} 
                colorClass="bg-emerald-100 text-emerald-600" 
                borderClass="border-emerald-200"
              />
              <StatCard 
                icon={XCircle} 
                label="Rejected" 
                count={rejectedCount} 
                colorClass="bg-rose-100 text-rose-600" 
                borderClass="border-rose-200"
              />
            </div>
            <ChangePasswordForm />
          </div>

        </div>
      </div>
    </div>
  );
}