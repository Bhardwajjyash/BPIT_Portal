"use client";

import { updateAchievementStatus } from "@/app/actions";
import toast from "react-hot-toast";

export default function ReviewActionForm({ children, className }) {
  const handleFormAction = async (formData) => {
    const status = formData.get("status");
    const isApproving = status === "APPROVED";
    
    // 1. Show the loading toast immediately
    const toastId = toast.loading(isApproving ? "Approving request..." : "Rejecting request...");
    
    try {
      // 2. Call the server action
      const res = await updateAchievementStatus(formData);
      
      // 3. Update the toast based on the server response
      if (res?.error) {
        toast.error(res.error, { id: toastId });
      } else {
        toast.success(isApproving ? "Request approved!" : "Request rejected!", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred while updating.", { id: toastId });
    }
  };

  return (
    <form action={handleFormAction} className={className}>
      {children}
    </form>
  );
}