"use client";
import { useState, useActionState, useEffect } from "react";
import { processForgotPassword } from "@/app/actions";
import { X } from "lucide-react";
import toast from "react-hot-toast";

// Pass the role prop as "student", "faculty", or "admin"
export default function ForgotPasswordModal({ role }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(processForgotPassword, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      setIsOpen(false); // Automatically close the modal on success
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  if (!isOpen) {
    return (
      <button 
        type="button" 
        onClick={() => setIsOpen(true)}
        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        Forgot Password?
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-xl font-bold text-slate-900 mb-2">Reset Password</h3>
        <p className="text-sm text-slate-500 mb-6">Enter your registered email to receive a temporary password.</p>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="role" value={role} />
          <div>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="Enter your email" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-70"
          >
            {isPending ? "Sending..." : "Send Temporary Password"}
          </button>
        </form>
      </div>
    </div>
  );
}