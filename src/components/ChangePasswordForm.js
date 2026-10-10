"use client";
import { useActionState, useRef, useEffect } from "react";
import { changePassword } from "@/app/actions";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePassword, null);
  const formRef = useRef(null);

  // Watch for changes in the server action 'state'
  useEffect(() => {
    if (state?.success) {
      toast.success(state.success); // Trigger Success Toast
      formRef.current?.reset();     // Clear form
    }
    if (state?.error) {
      toast.error(state.error);     // Trigger Error Toast
    }
  }, [state]);

  return (
    <div className="mt-8 pt-8 border-t border-slate-100">
      <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Lock className="w-5 h-5 text-indigo-600" />
        Account Security
      </h2>
      
      <form ref={formRef} action={formAction} className="bg-slate-50 border border-slate-200 p-5 sm:p-6 rounded-2xl max-w-xl">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Current Password</label>
            <input type="password" name="oldPassword" required className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">New Password</label>
              <input type="password" name="newPassword" required className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Confirm Password</label>
              <input type="password" name="confirmPassword" required className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70">
            {isPending ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}