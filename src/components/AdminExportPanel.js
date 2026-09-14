"use client";
import { useState, useEffect } from "react";
import { Download, Filter, X, Search } from "lucide-react";

export default function AdminExportPanel() {
  // STRICT SINGLE FILTER STATE
  const [activeFilter, setActiveFilter] = useState("section");
  
  // Isolated Values
  const [section, setSection] = useState("A");
  
  const [mentorQuery, setMentorQuery] = useState("");
  const [mentorResults, setMentorResults] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const [studentQuery, setStudentQuery] = useState("");
  const [studentResults, setStudentResults] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Completely wipe all other filter data when switching modes
  const handleFilterChange = (e) => {
    setActiveFilter(e.target.value);
    setMentorQuery("");
    setMentorResults([]);
    setSelectedMentor(null);
    setStudentQuery("");
    setStudentResults([]);
    setSelectedStudents([]);
  };

  useEffect(() => {
    const fetchSearch = async () => {
      if (activeFilter === "mentor" && mentorQuery.length > 1 && !selectedMentor) {
        const res = await fetch(`/api/search-users?type=mentor&query=${mentorQuery}`);
        setMentorResults(await res.json());
      } else if (activeFilter === "students" && studentQuery.length > 1) {
        const res = await fetch(`/api/search-users?type=student&query=${studentQuery}`);
        setStudentResults(await res.json());
      }
    };
    const timer = setTimeout(fetchSearch, 300);
    return () => clearTimeout(timer);
  }, [mentorQuery, studentQuery, activeFilter, selectedMentor]);

  const handleDownload = (exportType) => {
    const params = new URLSearchParams();
    params.append("role", "admin");
    params.append("type", exportType); // 'detailed' or 'summary'
    params.append("filterType", activeFilter);
    
    if (activeFilter === "section") params.append("filterValue", section);
    if (activeFilter === "mentor" && selectedMentor) params.append("filterValue", selectedMentor.id);
    if (activeFilter === "students" && selectedStudents.length > 0) {
      params.append("filterValue", selectedStudents.map(s => s.id).join(','));
    }

    window.location.href = `/api/export-bulk?${params.toString()}`;
  };

  const addStudent = (student) => {
    if (!selectedStudents.find(s => s.id === student.id)) {
      setSelectedStudents([...selectedStudents, student]);
    }
    setStudentQuery("");
    setStudentResults([]);
  };

  const removeStudent = (id) => {
    setSelectedStudents(selectedStudents.filter(s => s.id !== id));
  };

  return (
    <div className="pt-4 mt-4 border-t border-slate-200">
      <div className="px-4 mb-3 flex items-center gap-2 text-slate-800 font-bold text-sm">
        <Filter className="w-4 h-4 text-indigo-600" /> Export Data
      </div>
      
      <div className="px-4 space-y-3">
        {/* MASTER FILTER SELECTOR */}
        <select 
          className="w-full bg-white border-2 border-indigo-100 text-indigo-700 font-bold p-2 rounded-lg text-sm focus:outline-none"
          value={activeFilter} 
          onChange={handleFilterChange}
        >
          <option value="section">1. Filter by Section</option>
          <option value="mentor">2. Filter by Mentor</option>
          <option value="students">3. Select Specific Students</option>
        </select>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg shadow-inner min-h-[80px]">
          {/* 1. SECTION FILTER */}
          {activeFilter === "section" && (
            <select 
              className="w-full bg-white border border-slate-300 p-2 rounded-lg text-sm text-slate-700 font-medium outline-none"
              value={section} 
              onChange={(e) => setSection(e.target.value)}
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          )}

          {/* 2. MENTOR FILTER */}
          {activeFilter === "mentor" && (
            <div className="relative">
              {selectedMentor ? (
                <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 p-2 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-indigo-700 truncate">{selectedMentor.name}</span>
                    <span className="text-xs text-indigo-500">{selectedMentor.department}</span>
                  </div>
                  <button onClick={() => setSelectedMentor(null)} className="p-1 hover:bg-indigo-200 rounded">
                    <X className="w-4 h-4 text-indigo-600" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2">
                    <Search className="w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Type mentor name..." className="w-full bg-transparent p-2 text-sm outline-none text-slate-700" value={mentorQuery} onChange={(e) => setMentorQuery(e.target.value)} />
                  </div>
                  {mentorResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-lg rounded-lg overflow-hidden z-50">
                      {mentorResults.map(m => (
                        <div key={m.id} onClick={() => { setSelectedMentor(m); setMentorResults([]); }} className="p-2 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0">
                          <p className="font-bold text-slate-700">{m.name}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* 3. STUDENTS FILTER */}
          {activeFilter === "students" && (
            <div className="relative">
              <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2 mb-2">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search by name/enrollment..." className="w-full bg-transparent p-2 text-sm outline-none text-slate-700" value={studentQuery} onChange={(e) => setStudentQuery(e.target.value)} />
              </div>
              {studentResults.length > 0 && (
                <div className="absolute top-10 left-0 right-0 bg-white border border-slate-200 shadow-lg rounded-lg overflow-hidden z-50 max-h-40 overflow-y-auto">
                  {studentResults.map(s => (
                    <div key={s.id} onClick={() => addStudent(s)} className="p-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100">
                      <p className="font-bold text-slate-700 text-sm">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.enrollmentNo}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex flex-col gap-1 max-h-32 overflow-y-auto custom-scrollbar">
                {selectedStudents.map(s => (
                  <div key={s.id} className="flex justify-between items-center bg-white border border-slate-200 p-1.5 rounded-md">
                    <span className="text-xs font-bold text-slate-700 truncate">{s.name}</span>
                    <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-rose-500" onClick={() => removeStudent(s.id)} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DOWNLOAD BUTTONS */}
        <div className="flex flex-col gap-2 pt-2">
          <button 
            onClick={() => handleDownload('detailed')}
            disabled={(activeFilter === 'mentor' && !selectedMentor) || (activeFilter === 'students' && selectedStudents.length === 0)}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-2.5 px-3 text-xs rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Full 5-Sheet Details
          </button>
          <button 
            onClick={() => handleDownload('summary')}
            disabled={(activeFilter === 'mentor' && !selectedMentor) || (activeFilter === 'students' && selectedStudents.length === 0)}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 disabled:text-slate-400 disabled:bg-slate-100 disabled:cursor-not-allowed font-bold py-2.5 px-3 text-xs rounded-lg border border-slate-200 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Basic Summary
          </button>
        </div>
      </div>
    </div>
  );
}