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
import AdminProfileAvatar from "@/components/AdminProfileAvatar";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const adminId = cookieStore.get('adminId')?.value;
  if (!adminId) redirect('/admin/login');

  // Fetch the Admin details
  const admin = await prisma.admin.findUnique({
    where: { id: adminId }
  });

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

  const initials = admin.name
    ? admin.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AD';

  // 1. Build the dynamic department filters
  const isGlobalAdmin = !admin.departmentName;
  
  // Filter for direct relations (Students, Faculty)
  const deptFilter = isGlobalAdmin ? {} : { departmentName: admin.departmentName };
  
  // Filter for nested relations (Achievements belong to students in this department)
  const nestedStudentFilter = isGlobalAdmin ? {} : { student: { departmentName: admin.departmentName } };

  // 2. Apply filters to the counts
  const totalStudents = await prisma.student.count({ where: deptFilter });
  const totalMentors = await prisma.faculty.count({ where: deptFilter });

  // 3. Apply filters to the achievement status counts
  const getStatusTotal = async (status) => {
    const baseWhere = { status, ...nestedStudentFilter };
    
    const counts = await Promise.all([
      prisma.project.count({ where: baseWhere }),
      prisma.extraCurricular.count({ where: baseWhere }),
      prisma.coCurricular.count({ where: baseWhere }),
      prisma.certification.count({ where: baseWhere }),
      prisma.researchPaper.count({ where: baseWhere })
    ]);
    return counts.reduce((acc, curr) => acc + curr, 0);
  };

  const pendingCount = await getStatusTotal('PENDING');
  const approvedCount = await getStatusTotal('APPROVED');
  const rejectedCount = await getStatusTotal('REJECTED');
  const totalRequests = pendingCount + approvedCount + rejectedCount;

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
      <div className="mb-8 flex items-center space-x-4">
        <AdminProfileAvatar 
          currentPic={admin.profilePic} 
          initials={initials} 
          name={admin.name} 
        />
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Profile</h1>
          <p className="text-slate-500 font-medium mt-1">
            {isGlobalAdmin ? 'Manage global college statistics.' : `Manage statistics for ${admin.departmentName}.`}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 w-full"></div>
        
        <div className="p-6 sm:p-8">
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
                {/* 🔧 FIX: Updated to departmentName */}
                {admin.departmentName || 'All Departments (Global)'} 
              </span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              {isGlobalAdmin ? 'Global Overview' : 'Department Overview'}
            </h2>

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
              
              <div className="sm:text-right flex items-center sm:block pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-6">
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">All Submissions</p>
                </div>
                <div className="flex items-center sm:justify-end gap-3 text-slate-900">
                  <ClipboardList className="w-6 h-6 text-slate-700" />
                  <p className="text-3xl font-extrabold leading-none">{totalRequests}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard 
                icon={Clock} 
                label="Pending" 
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
          </div>
        </div>
      </div>
    </div>
  );
}