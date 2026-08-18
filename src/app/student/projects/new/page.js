"use client";

import { useState, useRef } from "react";
import Link from 'next/link';
import { submitProject } from "@/app/actions";

export default function NewProject() {
  const formRef = useRef(null); // Reference to the form to reset native inputs

  const [photoData, setPhotoData] = useState(null);
  const [preview, setPreview] = useState({ isOpen: false, url: "", type: "" });

  const [techInput, setTechInput] = useState("");
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const commonTechs = [
    "React", "Node.js", "Express", "PostgreSQL", "MongoDB", "Python", 
    "Java", "Tailwind CSS", "Next.js", "Docker", "Prisma", "Redis", 
    "Socket.io", "Cloudinary", "Machine Learning"
  ];

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

  const handleFileChange = (e, setFileState) => {
    const file = e.target.files[0];
    
    if (!file) {
      setFileState(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds the 1 MB limit. Please select a smaller file.");
      e.target.value = "";
      setFileState(null);
      return;
    }

    setFileState({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "pdf",
    });
  };

  const openPreview = (data) => setPreview({ isOpen: true, url: data.url, type: data.type });
  const closePreview = () => setPreview({ isOpen: false, url: "", type: "" });

  const filteredTechs = commonTechs.filter(
    tech => tech.toLowerCase().includes(techInput.toLowerCase()) && !selectedTechs.includes(tech)
  );

  const handleAddTech = (tech) => {
    const trimmed = tech.trim();
    if (trimmed && !selectedTechs.includes(trimmed)) {
      setSelectedTechs([...selectedTechs, trimmed]);
    }
    setTechInput("");
    setShowSuggestions(false);
  };

  const handleRemoveTech = (techToRemove) => {
    setSelectedTechs(selectedTechs.filter(tech => tech !== techToRemove));
  };

  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTech(techInput);
    }
  };

  // --- NEW CLIENT ACTION HANDLER ---
  const clientAction = async (formData) => {
    const result = await submitProject(formData);
    
    // If the server action returns an error, show it and stop (don't clear the form)
    if (result?.error) {
      alert(result.error);
      return;
    }
    
    // If successful (or right before redirect), clear all React states
    setSelectedTechs([]);
    setTechInput("");
    setPhotoData(null);
    formRef.current?.reset(); // Clear all standard HTML inputs
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Add New Project</h1>
          <p className="text-slate-600 font-medium mt-1">Submit your technical project details for faculty verification.</p>
        </div>
        <Link 
          href="/student/projects" 
          className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          &larr; Back to Projects
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 w-full" />
        
        {/* Swapped action to use clientAction and added ref */}
        <form ref={formRef} action={clientAction} className="p-6 sm:p-8 space-y-6">
          
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Project Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Project Name <span className="text-rose-600">*</span>
                </label>
                <input type="text" name="projectName" required placeholder="e.g. BookMania" className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Semester (1-8) <span className="text-rose-600">*</span>
                </label>
                <input type="number" name="semester" min="1" max="8" required placeholder="e.g. 4" className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Type <span className="text-rose-600">*</span>
                </label>
                <select name="type" className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium">
                  <option value="Website">Website</option>
                  <option value="Web Dev">Web Dev</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Research">Research</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Status <span className="text-rose-600">*</span>
                </label>
                <select name="projectStatus" className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium">
                  <option value="Working">Working</option>
                  <option value="Live">Live</option>
                  <option value="Deployed">Deployed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Start Date <span className="text-rose-600">*</span>
                </label>
                <input type="date" name="dateFrom" required className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  End Date <span className="text-rose-600">*</span>
                </label>
                <input type="date" name="dateTo" required className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  GitHub / Repository Link
                </label>
                <input type="url" name="githubLink" placeholder="https://github.com/your-username/repo" className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Name of Supervisor
                </label>
                <input type="text" name="supervisor" placeholder="e.g. Dr. A. B. Smith" className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Team Members <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input type="text" name="teamMembers" placeholder="Comma separated names" className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Tech Stack / Tools Used <span className="text-rose-600">*</span>
                </label>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTechs.map(tech => (
                    <span key={tech} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 shadow-sm">
                      {tech}
                      <button type="button" onClick={() => handleRemoveTech(tech)} className="ml-1.5 text-indigo-500 hover:text-indigo-900 focus:outline-none">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>

                <div className="relative">
                  <input 
                    type="text" 
                    value={techInput}
                    onChange={(e) => {
                      setTechInput(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onKeyDown={handleTechKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Type a tool and press Enter (e.g. Node.js)"
                    className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                  />
                  
                  {showSuggestions && techInput && (
                    <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-48 rounded-xl py-1 text-sm border border-slate-200 overflow-auto">
                      {filteredTechs.length > 0 ? (
                        filteredTechs.map(tech => (
                          <li key={tech} onMouseDown={() => handleAddTech(tech)} className="cursor-pointer select-none relative px-4 py-2 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium">
                            {tech}
                          </li>
                        ))
                      ) : (
                        <li onMouseDown={() => handleAddTech(techInput)} className="cursor-pointer select-none relative px-4 py-2 bg-indigo-50 text-indigo-700 font-medium">
                          Add &quot;{techInput}&quot;
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <input type="hidden" name="techStack" value={selectedTechs.join(', ')} required />
              </div>

            </div>
          </div>

          <div className="pt-2 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Project Details & Outcomes</h2>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Brief Description & functionalities <span className="text-rose-600">*</span>
              </label>
              <textarea name="description" required rows={3} placeholder="Explain the problem your project solves..." className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium resize-y"></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Learnings from Project <span className="text-rose-600">*</span>
              </label>
              <textarea name="learnings" required rows={2} placeholder="Key technical skills, challenges overcome..." className="w-full px-3.5 py-2.5 text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium resize-y"></textarea>
            </div>
          </div>

          <div className="pt-2">
            <h2 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Supporting Documents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex justify-between">
                  <span>Proof Document / URL <span className="text-rose-600">*</span></span>
                  <span className="text-slate-400 text-[10px]">Max 1 MB</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    name="proofDocument"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange(e, setPhotoData)}
                    className="w-full text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer"
                  />
                  {photoData && (
                    <button type="button" onClick={() => openPreview(photoData)} className="px-4 py-2.5 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm">
                      View
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Link href="/student/projects" className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={selectedTechs.length === 0} className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-colors bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              Submit for Verification
            </button>
          </div>

        </form>
      </div>

      {preview.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-slate-800">Document Preview</h3>
              <button type="button" onClick={closePreview} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto bg-slate-100 flex items-center justify-center min-h-[50vh]">
              {preview.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview.url} alt="Preview" className="max-w-full max-h-[70vh] object-contain rounded shadow-sm border border-slate-200" />
              ) : (
                <iframe src={preview.url} className="w-full h-[70vh] rounded shadow-sm border border-slate-200 bg-white" title="PDF Preview" />
              )}
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end bg-white">
              <button type="button" onClick={closePreview} className="px-6 py-2.5 text-sm font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}