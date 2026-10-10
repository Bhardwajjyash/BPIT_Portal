"use client";
import { Toaster } from "react-hot-toast";

export default function GlobalToast() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        // Default duration: 3.5 seconds
        duration: 3500,
        className: "text-sm font-bold shadow-lg rounded-xl border",
        success: {
          style: {
            background: "#ecfdf5", // emerald-50
            color: "#047857", // emerald-700
            borderColor: "#a7f3d0", // emerald-200
          },
          iconTheme: {
            primary: "#10b981", // emerald-500
            secondary: "#ecfdf5",
          },
        },
        error: {
          style: {
            background: "#fff1f2", // rose-50
            color: "#be123c", // rose-700
            borderColor: "#fecdd3", // rose-200
          },
          iconTheme: {
            primary: "#f43f5e", // rose-500
            secondary: "#fff1f2",
          },
        },
      }}
    />
  );
}