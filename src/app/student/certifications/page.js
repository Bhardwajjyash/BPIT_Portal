import Link from 'next/link';
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { Eye, Edit, Trash2 } from "lucide-react";
import { deleteCertification } from "@/app/actions"; // We will add this action below

export default async function CertificationsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  let certs = [];
  try {
    const rawCerts = await prisma.certification.findMany({
      where: { studentId: userId },
      orderBy: { dateFrom: 'desc' } // Shows newest first
    });
    
    certs = JSON.parse(JSON.stringify(rawCerts));
  } catch (error) {
    console.error("Database fetch error:", error);
  }

  // Helper to color-code the status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return "bg-emerald-100 border-emerald-300 text-emerald-800";
      case 'REJECTED':
        return "bg-rose-100 border-rose-300 text-rose-800";
      default: // PENDING
        return "bg-amber-100 border-amber-300 text-amber-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Certifications</h1>
          <p className="text-slate-600 font-medium mt-1">Manage and show off your verified course certifications and credentials.</p>
        </div>
        <Link 
          href="/student/certifications/new" 
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-colors bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Certification
        </Link>
      </div>

      {/* Content Section */}
      {!certs || certs.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-slate-200">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No certifications found</h3>
          <p className="text-slate-600 max-w-sm mb-6">You haven't uploaded or added any course certifications yet.</p>
          <Link href="/student/certifications/new" className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline inline-flex items-center">
            Add your first certification &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {certs.map((cert) => (
            <div key={cert.id} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-indigo-300 hover:shadow-md transition-all duration-200">
              
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{cert.courseName}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border shadow-sm whitespace-nowrap ${getStatusBadge(cert.status)}`}>
                    {cert.status}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center text-sm font-semibold text-slate-600 gap-3">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Certified by {cert.certifiedBy}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons: View, Edit, Delete */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                
                {/* 1. View Button */}
                <Link 
                  href={`/student/certifications/${cert.id}`} 
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </Link>

                {/* 2. Edit Button (Hidden if already approved) */}
                {cert.status !== 'APPROVED' && (
                  <Link 
                    href={`/student/certifications/${cert.id}/edit`} 
                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                    title="Edit & Resubmit"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                )}

                {/* 3. Delete Button */}
                <form action={deleteCertification}>
                  <input type="hidden" name="id" value={cert.id} />
                  <button 
                    type="submit" 
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" 
                    title="Delete Certification"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </form>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}