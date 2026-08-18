import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { 
  Users, 
  GraduationCap, 
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  ShieldAlert,
  ClipboardList
} from "lucide-react";
import AdminProfileAvatar from "@/components/AdminProfileAvatar"; // <-- Import added

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const adminId = cookieStore.get('adminId')?.value;
  if (!adminId) redirect('/admin/login');

  // Fetch the Admin details
  const admin = await prisma.admin.findUnique({
    where: { id: adminId }
  });

  // Enhanced Error State matching the portal theme
  if (!admin) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full text-center shadow-sm">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Record Not Found</h2>
          <p className="text-red-700 text-sm">We couldn't locate this admin profile. Please verify your session and try again.</p>
        </div>
      </div>
    );
  }

  // Extract initials for the avatar
  const initials = admin.name
    ? admin.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AD';

  // Global System Stats
  const totalStudents = await prisma.student.count();
  const totalMentors = await prisma.faculty.count();

  // Helper function to efficiently fetch counts across all models for a specific status
  const getStatusTotal = async (status) => {
    const counts = await Promise.all([
      prisma.project.count({ where: { status } }),
      prisma.extraCurricular.count({ where: { status } }),
      prisma.coCurricular.count({ where: { status } }),
      prisma.certification.count({ where: { status } }),
      prisma.researchPaper.count({ where: { status } })
    ]);
    return counts.reduce((acc, curr) => acc + curr, 0);
  };

  const pendingCount = await getStatusTotal('PENDING');
  const approvedCount = await getStatusTotal('APPROVED');
  const rejectedCount = await getStatusTotal('REJECTED');
  const totalRequests = pendingCount + approvedCount + rejectedCount;

  // Reusable Stat Card Component matching the Faculty View
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
        
        {/* --- DYNAMIC ADMIN AVATAR --- */}
        <AdminProfileAvatar 
          currentPic={admin.profilePic} 
          initials={initials} 
          name={admin.name} 
        />
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Profile</h1>
          <p className="text-slate-500 font-medium mt-1">Manage department details and global statistics.</p>
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
              <p className="text-lg font-semibold text-slate-900">{admin.name}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Email Address</p>
              <p className="text-lg font-semibold text-slate-900">{admin.email}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Role</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700">
                {admin.role || 'Global Admin'}
              </span>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Department</p>
              <span className="inline-flex items-center text-slate-900 font-semibold text-lg">
                <Building2 className="w-5 h-5 mr-2 text-slate-400" />
                {admin.department || 'Not specified'}
              </span>
            </div>
          </div>

          {/* --- SECTION 2: Department Overview --- */}
          <div className="mt-8 pt-8 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Department Global Overview
            </h2>

            {/* Global Stats Information Block */}
            <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-8">
                <div>
                  <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Total Mentors</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <p className="text-2xl font-extrabold text-slate-900">{totalMentors}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-1">Total Students</p>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <p className="text-2xl font-extrabold text-slate-900">{totalStudents}</p>
                  </div>
                </div>
              </div>
              
              {/* Grand Total Submissions Block */}
              <div className="sm:text-right flex items-center sm:block pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-6">
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">All Submissions Tracked</p>
                </div>
                <div className="flex items-center sm:justify-end gap-3 text-slate-900">
                  <ClipboardList className="w-6 h-6 text-slate-700" />
                  <p className="text-3xl font-extrabold leading-none">{totalRequests}</p>
                </div>
              </div>
            </div>

            {/* Detailed Status Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard 
                icon={Clock} 
                label="Global Pending" 
                count={pendingCount} 
                colorClass="bg-amber-100 text-amber-600" 
                borderClass="border-amber-200"
              />
              <StatCard 
                icon={CheckCircle2} 
                label="Global Approved" 
                count={approvedCount} 
                colorClass="bg-emerald-100 text-emerald-600" 
                borderClass="border-emerald-200"
              />
              <StatCard 
                icon={XCircle} 
                label="Global Rejected" 
                count={rejectedCount} 
                colorClass="bg-rose-100 text-rose-600" 
                borderClass="border-rose-200"
              />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}