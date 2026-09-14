import { loginAdmin } from "@/app/actions";
import Image from "next/image";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-slate-50 overflow-hidden">
      
      {/* --- BACKGROUND DECORATIVE ELEMENTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top left blue glow */}
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-300/30 blur-[120px]" />
        {/* Bottom right slate glow */}
        <div className="absolute top-[50%] -right-[10%] w-[60%] h-[60%] rounded-full bg-slate-400/30 blur-[120px]" />
        {/* Center top cyan glow */}
        <div className="absolute top-[10%] left-[40%] w-[30%] h-[30%] rounded-full bg-cyan-200/40 blur-[100px]" />
      </div>

      {/* --- MAIN CONTENT (Elevated above background) --- */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md mx-auto">
        
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4 w-34 h-14 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm flex items-center justify-center p-1 flex-shrink-0">
            <Image 
              src="/logo1.jpeg" 
              alt="BPIT Logo" 
              fill 
              sizes="(max-width: 768px) 100vw, 150px" 
              className="object-contain p-1" 
              priority 
            />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm">
            HOD / Admin Portal
          </h1>
          <p className="text-slate-600 font-bold mt-2 text-sm uppercase tracking-wider">
            Authorized Personnel Only
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200/80 w-full overflow-hidden">
          {/* Subtle decorative gradient line */}
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 w-full" />
          
          <div className="p-6 sm:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-slate-900">Admin Sign In</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">Manage institute and faculty settings</p>
            </div>
            
            <form action={loginAdmin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Admin Email
                </label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium hover:border-slate-400" 
                  placeholder="hod@institute.edu" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                <input 
                  type="password" 
                  name="password" 
                  required 
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium hover:border-slate-400" 
                  placeholder="••••••••" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm hover:shadow-md hover:shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2"
              >
                Sign In to Admin Portal
              </button>
            </form>

            {/* Optional Redirect Link */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <Link 
                href="/" 
                className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
              >
                &larr; Back to Main Site
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}