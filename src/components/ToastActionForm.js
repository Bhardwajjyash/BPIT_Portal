"use client";

import toast from "react-hot-toast";

export default function ToastActionForm({ action, loadingMessage, successMessage, children, className }) {
  const handleAction = async (formData) => {
    const toastId = toast.loading(loadingMessage || "Processing...");
    
    try {
      const res = await action(formData);
      
      if (res?.error) {
        toast.error(res.error, { id: toastId });
      } else {
        toast.success(successMessage || "Success!", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred.", { id: toastId });
    }
  };

  return (
    <form action={handleAction} className={className}>
      {children}
    </form>
  );
}