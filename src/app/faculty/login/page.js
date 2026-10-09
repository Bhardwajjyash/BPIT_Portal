"use client";
import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { loginFaculty } from "@/app/actions";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";

export default function FacultyLoginPage() {
  const [state, formAction, isPending] = useActionState(loginFaculty, null);
  const [showPassword, setShowPassword] = useState(false); // ✅ Added state for password

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-slate-50 overflow-hidden">
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-300/30 blur-[120px]" />
        <div className="absolute top-[50%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-300/30 blur-[120px]" />
        <div className="absolute top-[10%] left-[40%] w-[30%] h-[30%] rounded-full bg-violet-200/40 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md mx-auto">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4 w-34 h-14 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm flex items-center justify-center p-1 flex-shrink-0">
            <Image src="/logo1.jpeg" alt="BPIT Logo" fill sizes="(max-width: 768px) 100vw, 150px" className="object-contain p-1" priority />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm">
            Faculty & Mentor Portal
          </h1>
          <p className="text-slate-600 font-bold mt-2 text-sm uppercase tracking-wider">
            Department of Information Technology
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-purple-900/5 border border-slate-200/80 w-full overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-600 w-full" />
          
          <div className="p-6 sm:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-slate-900">Faculty Sign In</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">Review and verify student achievements</p>
            </div>
            
            {state?.error && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold rounded-xl flex items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {state.error}
              </div>
            )}
            
            <form action={formAction} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Faculty Email
                </label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm font-medium hover:border-slate-400" 
                  placeholder="faculty@bpit.edu.in" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                {/* ✅ Added relative wrapper and toggle button */}
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    required 
                    className="w-full px-3.5 py-2.5 pr-12 text-slate-900 bg-slate-50/50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm font-medium hover:border-slate-400" 
                    placeholder="••••••••" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isPending}
                className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white transition-all bg-purple-600 rounded-xl hover:bg-purple-700 shadow-sm hover:shadow-md hover:shadow-purple-600/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? "Signing In..." : "Sign In as Mentor"}
              </button>
            </form>

            
              <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-3">
              <div className="mt-2">
                <ForgotPasswordModal role="admin" />
                </div>
                <p className="text-sm text-slate-500 font-medium">
                <Link href="/" className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                  Back to Home Page &rarr;
                </Link>
              </p>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}