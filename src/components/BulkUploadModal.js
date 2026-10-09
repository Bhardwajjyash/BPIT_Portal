"use client";
import { useActionState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadStudentsExcel, uploadFacultyExcel } from "@/app/actions";

export default function BulkUploadModal({ type }) {
  // Use the correct action depending on whether it's for students or faculty
  const action = type === "student" ? uploadStudentsExcel : uploadFacultyExcel;
  const [state, formAction, isPending] = useActionState(action, null);
  const formRef = useRef(null);

  if (state?.success) {
    formRef.current?.reset();
  }

  return (
    <div className="bg-indigo-50 border border-indigo-100 p-5 sm:p-6 rounded-2xl mb-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
      <div className="flex-1">
        <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-indigo-600" />
          Bulk Excel Upload ({type === "student" ? "Students" : "Mentors"})
        </h3>
        <p className="text-sm text-indigo-700 mt-1">
          {type === "student" 
            ? "Upload an .xlsx file. Expected columns: Name, EnrollmentNo, FatherName, Email, Section, Batch, Department." 
            : "Upload an .xlsx file. Expected columns: Name, Email, Designation, Department."}
        </p>
      </div>

      <form ref={formRef} action={formAction} className="flex w-full sm:w-auto items-center gap-3">
        <input 
          type="file" 
          name="file" 
          accept=".xlsx" 
          required
          className="text-sm w-full sm:w-auto file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer text-indigo-900 border border-indigo-200 rounded-xl bg-white"
        />
        <button 
          type="submit" 
          disabled={isPending}
          className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isPending ? "Uploading..." : "Upload Data"}
        </button>
      </form>

      {/* Success/Error Feedback */}
      {state?.error && (
        <div className="absolute mt-16 right-8 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <AlertCircle className="w-4 h-4" /> {state.error}
        </div>
      )}
      {state?.success && (
        <div className="absolute mt-16 right-8 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" /> {state.success}
        </div>
      )}
    </div>
  );
}