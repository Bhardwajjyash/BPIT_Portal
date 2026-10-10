"use client";

import { useState } from "react";
import { Trash2, X, AlertTriangle } from "lucide-react";
import { deleteMentor } from "@/app/actions";
import toast from "react-hot-toast";

export default function DeleteMentorButton({ mentorId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    const formData = new FormData();
    formData.append("id", mentorId);
    
    const res = await deleteMentor(formData);
    
    setIsDeleting(false);
    setIsOpen(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Mentor deleted successfully!");
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-slate-400 hover:text-rose-600 transition-colors p-1" 
        title="Remove Mentor"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Mentor?</h3>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to delete this mentor? This action cannot be undone and will unassign all their current students.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  No, Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}