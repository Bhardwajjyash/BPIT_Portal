"use client";

import { useState } from "react";
import Link from "next/link";
import { submitExtraCurricular } from "@/app/actions";

export default function NewExtraCurricular() {
  // Duration states
  const [durationValue, setDurationValue] = useState("");
  const [durationUnit, setDurationUnit] = useState("");

  // File states for previewing and size validation
  const [photoData, setPhotoData] = useState(null);
  const [proofData, setProofData] = useState(null);

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
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Add Extra-Curricular Activity
          </h1>
          <p className="text-slate-600 font-medium mt-1">
            Submit your activity details for faculty verification.
          </p>
        </div>
        <Link
          href="/student/extra-curricular"
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          &larr; Back to Activities
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 w-full" />

        <form action={submitExtraCurricular} className="p-6 sm:p-8 space-y-6">
          {/* Section: General Details */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              Activity Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Title / Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Annual Cultural Fest"
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
                  placeholder="e.g. 4"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Type <span className="text-rose-600">*</span>
                </label>

                <select
                  name="type"
                  defaultValue=""
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="NSS">NSS</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Litery">Litery</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mode <span className="text-rose-600">*</span>
                </label>
                <select
                  name="mode"
                  defaultValue=""
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                >
                  <option value="" disabled>
                    Select Mode
                  </option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Organization & Location */}
          <div className="pt-2">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              Organization & Logistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Organized By <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="organizedBy"
                  required
                  placeholder="Organization or Institute name"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Organized at <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="place"
                  required
                  placeholder="Venue"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              {/* --- NEW FIELD: SPONSORED BY --- */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Sponsored By <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <select
                  
                  name="sponsored"
                  defaultValue=""
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                >
                  <option value="" disabled>Select Sponsor
                  </option>
                  <option value="AICTE">AICTE</option>
                  <option value="IIT">IIT</option>  
                  <option value="GGSIPU">GGSIPU</option>
                  <option value="Government">Government</option>
                  <option value="Other">Other</option>
                  </select>                
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Level <span className="text-rose-600">*</span>
                </label>
                <select
                  name="level"
                  defaultValue=""
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                >
                  <option value="" disabled>
                    Select Level
                  </option>
                  <option value="College">College</option>
                  <option value="University">University</option>
                  <option value="State">State</option>
                  <option value="National">National</option>
                  <option value="International">International</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Your Role <span className="text-rose-600">*</span>
                </label>
                <select
                  name="role"
                  defaultValue=""
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="Organizer">Organizer</option>
                  <option value="Participant">Participant</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Dates & Achievement */}
          <div className="pt-2">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              Timeline & Position
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Date From <span className="text-rose-600">*</span>
                </label>
                <input
                  type="date"
                  name="dateFrom"
                  required
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Date To <span className="text-rose-600">*</span>
                </label>
                <input
                  type="date"
                  name="dateTo"
                  required
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Duration <span className="text-rose-600">*</span>
                </label>

                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter number"
                    value={durationValue}
                    onChange={(e) => setDurationValue(e.target.value)}
                    className="w-1/2 px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                  />

                  <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value)}
                    className="w-1/2 px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                  >
                    <option value="" disabled>Select Unit</option>
                    <option value="Hours">Hours</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                  </select>
                </div>

                {/* Hidden input sent to backend */}
                <input
                  type="hidden"
                  name="duration"
                  value={durationValue && durationUnit ? `${durationValue} ${durationUnit}` : ""}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Position / Achievement{" "}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="position"
                  placeholder="e.g. 1st Winner, Runner Up"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Prize Money / Award{" "}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="prizeMoney"
                  placeholder="e.g. ₹5000, Gold Medal"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Team Members{" "}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="teamMembers"
                  placeholder="Comma separated names (e.g. Yash, John Doe)"
                  className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section: Supporting Documents */}
          <div className="pt-2">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              Supporting Documents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Event Photo Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex justify-between">
                  <span>Event Photo <span className="text-slate-400 font-normal">(Optional)</span></span>
                  <span className="text-slate-400 text-[10px]">Max 1 MB</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    name="eventPhoto"
                    accept="image/*"
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
              
              {/* Proof / Certificate Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex justify-between">
                  <span>Proof / Certificate <span className="text-rose-600">*</span></span>
                  <span className="text-slate-400 text-[10px]">Max 1 MB</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    name="proofDocument"
                    required
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileChange(e, setProofData)}
                    className="w-full text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer"
                  />
                  {proofData && (
                    <button
                      type="button"
                      onClick={() => openPreview(proofData)}
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
              Key Learnings & Takeaways <span className="text-rose-600">*</span>
            </label>
            <textarea
              name="learnings"
              required
              rows={3}
              placeholder="Briefly describe what you gained or learned from this experience (Max 50 words)..."
              className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium resize-y"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link
              href="/student/extra-curricular"
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