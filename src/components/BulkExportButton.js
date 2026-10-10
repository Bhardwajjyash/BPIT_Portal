"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function BulkExportButton({ label = "Export Summary Excel", role = "admin" }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    // Show a loading toast that will be replaced when finished
    const toastId = toast.loading("Generating export file...");

    try {
      // Append the explicit role to the request URL
      const response = await fetch(`/api/export-bulk?role=${role}`);
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: "Unknown error occurred" }));
        // Replace loading toast with error
        toast.error(`Download failed: ${errData.error}`, { id: toastId });
        setIsLoading(false);
        return;
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const disposition = response.headers.get('content-disposition');
      let filename = 'Summary.xlsx';
      if (disposition && disposition.indexOf('filename=') !== -1) {
        filename = disposition.split('filename=')[1].replace(/"/g, '');
      }

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);

      // Replace loading toast with success
      toast.success("Export downloaded successfully!", { id: toastId });

    } catch (error) {
      console.error("Download error:", error);
      // Replace loading toast with error
      toast.error("An error occurred while downloading the file.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed border border-indigo-200 mt-4 w-full"
    >
      <Download className={`w-4 h-4 ${isLoading ? 'animate-bounce' : ''}`} />
      {isLoading ? "Generating..." : label}
    </button>
  );
}