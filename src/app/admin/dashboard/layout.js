"use client";

import { useState } from "react";
import { logoutAdmin } from "@/app/actions";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import BulkExportButton from "@/components/BulkExportButton";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Helper to close sidebar when a link is clicked on mobile
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      {/* Mobile Hamburger Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-slate-200 text-slate-700 hover:bg-slate-50 print:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle Menu"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay Background */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden print:hidden backdrop-blur-sm transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* ADMIN SIDEBAR */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 shadow-xl lg:shadow-sm print:hidden
        transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1">
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
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              HOD Portal
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Global Admin
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 flex flex-col overflow-y-auto">
          <Link
            href="/admin/dashboard"
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-slate-100 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 opacity-70" /> Overview
          </Link>

          <Link
            href="/admin/dashboard/faculty"
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-slate-100 transition-colors"
          >
            <Users className="w-5 h-5 opacity-70" /> Manage Mentors
          </Link>

          <Link
            href="/admin/dashboard/students"
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-slate-100 transition-colors"
          >
            <GraduationCap className="w-5 h-5 opacity-70" /> All Students
          </Link>

          <Link
            href="/admin/dashboard/requests"
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-bold hover:bg-slate-100 transition-colors"
          >
            <ClipboardCheck className="w-5 h-5 opacity-70" /> Global Requests
          </Link>

          {/* Export Button Section */}
          <div className="pt-4 mt-4 border-t border-slate-200">
            <BulkExportButton label="Export Dept. Summary" role="admin" />
          </div>
        </nav>

        {/* Spacer to push Logout button to bottom if needed on mobile */}
        <div className="flex-1 lg:hidden" />

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 mt-auto">
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-rose-600 bg-rose-100 hover:bg-rose-200 rounded-xl transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto w-full pt-20 lg:pt-0 p-4 sm:p-6 lg:p-10 scroll-smooth">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
