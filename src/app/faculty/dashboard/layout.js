"use client";

import { useState } from "react";
import { logoutFaculty } from "@/app/actions";
import Link from "next/link";
import { User, UserPlus, ClipboardList, LogOut, Menu, X } from "lucide-react";
import Image from 'next/image';
import BulkExportButton from "@/components/BulkExportButton";

export default function FacultyDashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Helper to close sidebar when a link is clicked on mobile
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Mobile Hamburger Button */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-200 text-slate-700 hover:bg-slate-50 print:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle Menu"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay Background */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden print:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 shadow-xl lg:shadow-sm print:hidden
        transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Dashboard Branding */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1 flex-shrink-0">
            <Image
              src="/logo1-1.png"
              alt="BPIT Logo"
              fill
              sizes="44px"
              className="object-contain p-1"
              priority
            />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Mentor Panel</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Dept. of IT</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 flex flex-col overflow-y-auto">
          <Link 
            href="/faculty/dashboard" 
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-bold text-base hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <User className="w-5 h-5 opacity-70" />
            My Profile
          </Link>
          
          <Link 
            href="/faculty/dashboard/students" 
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-bold text-base hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <UserPlus className="w-5 h-5 opacity-70" />
            Manage Students
          </Link>
          
          <Link 
            href="/faculty/dashboard/requests" 
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-bold text-base hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ClipboardList className="w-5 h-5 opacity-70" />
            Pending Requests
          </Link>

          <div className="pt-4 mt-4 border-t border-slate-200">
            <BulkExportButton label="Export Mentees Summary" role="mentor" />
          </div>
        </nav>

        {/* Spacer to push Logout button to bottom if needed */}
        <div className="flex-1 lg:hidden" />

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
          <form action={logoutFaculty}>
            <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-rose-600 bg-rose-100 hover:bg-rose-200 rounded-xl transition-colors shadow-sm">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN DYNAMIC CONTENT AREA */}
      <main className="flex-1 overflow-y-auto w-full pt-20 lg:pt-0 p-4 sm:p-6 lg:p-10 scroll-smooth">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}