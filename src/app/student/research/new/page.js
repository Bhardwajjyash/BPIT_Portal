"use client";

import { useState } from "react";
import Link from 'next/link';
import { submitResearchPaper } from "@/app/actions";

export default function NewResearchPaper() {
  // File states for previewing and size validation
  const [photoData, setPhotoData] = useState(null);

  // Modal preview states
  const [preview, setPreview] = useState({ isOpen: false, url: "", type: "" });

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB in bytes

  // Handler for file selection and validation
  const handleFileChange = (e, setFileState) => {
    const file = e.target.files[0];
    
    if (!file) {
      setFileState(null);
      return;
    }

    // Check file size (1 MB limit)
    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds the 1 MB limit. Please select a smaller file.");
      e.target.value = ""; // Reset the input field
      setFileState(null);
      return;
    }

    // Store file details and create a local URL for the preview modal
    setFileState({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "pdf",
    });
  };

  const openPreview = (data) => {
    setPreview({ isOpen: true, url: data.url, type: data.type });
  };

  const closePreview = () => {
    setPreview({ isOpen: false, url: "", type: "" });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Top Header & Navigation */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Add Research Paper</h1>
          <p className="text-slate-600 font-medium mt-1">Submit your academic research and publications for verification.</p>
        </div>
        <Link 
          href="/student/research" 
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          &larr; Back to Research
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 w-full" />
        
        <form action={submitResearchPaper} className="p-6 sm:p-8 space-y-6">
          
          {/* Section: Paper Overview */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Paper Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Title of the Paper <span className="text-rose-600">*</span>
                </label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  placeholder="e.g. Deep Learning Approaches in Computer Vision"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Semester (1-8) <span className="text-rose-600">*</span>
                </label>
                <input 
                  type="number" 
                  name="semester" 
                  min="1" 
                  max="8" 
                  required 
                  placeholder="e.g. 7"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  List of Authors <span className="text-rose-600">*</span>
                </label>
                <input 
                  type="text" 
                  name="authors" 
                  required 
                  placeholder="e.g. John Doe, Dr. Jane Smith"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Name of Supervisor <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input 
                  type="text" 
                  name="supervisor" 
                  placeholder="e.g. Dr. C M Sharma"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Organization / Affiliation <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input 
                  type="text" 
                  name="organization" 
                  placeholder="e.g. Department of IT / Research Lab"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

            </div>
          </div>

          {/* Section: Publication Details */}
          <div className="pt-2">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Publication & Venue</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Type <span className="text-rose-600">*</span>
                </label>
                <select 
                  name="type" 
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                >
                  <option value="Journal">Journal</option>
                  <option value="Book Chapter">Book Chapter</option>
                  <option value="Conference">Conference</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Name of Journal / Book / Conference <span className="text-rose-600">*</span>
                </label>
                <input 
                  type="text" 
                  name="journalName" 
                  required 
                  placeholder="e.g. IEEE Transactions on Software Engineering"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Published / Organized By <span className="text-rose-600">*</span>
                </label>
                <input 
                  type="text" 
                  name="publishedBy" 
                  required 
                  placeholder="e.g. IEEE, Springer, Elsevier"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Month & Year <span className="text-rose-600">*</span>
                </label>
                <input 
                  type="text" 
                  name="monthYear" 
                  required 
                  placeholder="e.g. May 2026"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

            </div>
          </div>

          {/* Section: Indexing & Citation Details */}
          <div className="pt-2">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Indexing & Identifiers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Volume & Issue No <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input 
                  type="text" 
                  name="volumeIssue" 
                  placeholder="e.g. Vol. 12, Issue 4"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  DOI Number / URL <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input 
                  type="text" 
                  name="doiUrl" 
                  placeholder="e.g. 10.1000/182 or https://doi.org/..."
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Indexing <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input 
                  type="text" 
                  name="indexing" 
                  placeholder="e.g. SCI, Scopus, Web of Science"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Paper Status <span className="text-rose-600">*</span>
                </label>
                <select 
                  name="paperStatus" 
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                >
                  <option value="Published">Published</option>
                  <option value="Presented">Presented</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Submitted">Submitted</option>
                </select>
              </div>

            </div>
          </div>

          {/* Section: Supporting Documents */}
          <div className="pt-2">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              Supporting Documents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Proof Photo/Document Field (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex justify-between">
                  <span>Proof Document / Photo <span className="text-slate-400 font-normal">(Optional)</span></span>
                  <span className="text-slate-400 text-[10px]">Max 1 MB</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    name="proofDocument"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, setPhotoData)}
                    className="w-full text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer"
                  />
                  {photoData && (
                    <button
                      type="button"
                      onClick={() => openPreview(photoData)}
                      className="px-4 py-2.5 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm"
                    >
                      View
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Section: Textarea */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Learnings & Outcomes <span className="text-rose-600">*</span> <span className="text-slate-400 font-normal lowercase">(Max 100 words)</span>
            </label>
            <textarea 
              name="learnings" 
              required 
              rows={3}
              placeholder="Briefly describe key findings, research methodologies used, or impact of this work..."
              className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium resize-y"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link 
              href="/student/research"
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit" 
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-colors bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit for Verification
            </button>
          </div>

        </form>
      </div>

      {/* --- PREVIEW MODAL --- */}
      {preview.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-800">Document Preview</h3>
              <button
                type="button"
                onClick={closePreview}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 flex-1 overflow-auto bg-slate-100 flex items-center justify-center min-h-[50vh]">
              {preview.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={preview.url} 
                  alt="Document Preview" 
                  className="max-w-full max-h-[70vh] object-contain rounded shadow-sm border border-slate-200" 
                />
              ) : (
                <iframe 
                  src={preview.url} 
                  className="w-full h-[70vh] rounded shadow-sm border border-slate-200 bg-white" 
                  title="PDF Preview"
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 flex justify-end bg-white">
              <button
                type="button"
                onClick={closePreview}
                className="px-6 py-2.5 text-sm font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Close Preview
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}