"use client";

import { Download } from "lucide-react";
import { useState } from "react";

export default function ExportButton({ studentId = "", label = "Download Report" }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const url = `/api/export-student${studentId ? `?studentId=${studentId}` : ""}`;
      
      const response = await fetch(url);
      
      // If the backend returns an error JSON, catch it and alert the user
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "Unknown error occurred" }));
        alert(`Download failed: ${errData.error}`);
        setIsLoading(false);
        return;
      }

      // If successful, securely convert the binary data into an Excel file blob
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Extract the correct filename from the headers
      const disposition = response.headers.get('content-disposition');
      let filename = 'student_archive_LATEST.xlsx';
      if (disposition && disposition.indexOf('filename=') !== -1) {
        filename = disposition.split('filename=')[1].replace(/"/g, '');
      }

      // Trigger the actual file download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up browser memory
      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error("Download error:", error);
      alert("An error occurred while downloading the file. Check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white transition-colors bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <Download className={`w-4 h-4 mr-2 ${isLoading ? 'animate-bounce' : ''}`} />
      {isLoading ? "Generating..." : label}
    </button>
  );
}