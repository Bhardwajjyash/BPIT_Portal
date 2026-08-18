"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Loader2, X } from "lucide-react";
import { updateProfilePicture } from "@/app/actions";
import AvatarEditor from "react-avatar-editor";
import { useRouter } from "next/navigation";

export default function ProfileAvatar({ currentPic, initials, studentName }) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [scale, setScale] = useState(1.2);
  const editorRef = useRef(null);
  const router = useRouter();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
    e.target.value = ''; // Reset input
  };

  const handleCancel = () => {
    setSelectedImage(null);
    setScale(1.2);
  };

  const handleSave = async () => {
    if (!editorRef.current) return;
    setIsUploading(true);
    
    const canvas = editorRef.current.getImageScaledToCanvas();
    
    canvas.toBlob(async (blob) => {
      try {
        const formData = new FormData();
        formData.append("file", blob, "avatar.jpg");
        
        // IMPORTANT: REPLACE THESE WITH YOUR ACTUAL CLOUDINARY DETAILS
        // Example: If your preset is "student_profiles" and cloud name is "uvk9oavw"
formData.append("upload_preset", "xjiaevan"); // <-- Paste your Unsigned preset name here
const cloudName = "uvk9oavw";                         // <-- Your actual cloud name

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, 
          { method: "POST", body: formData }
        );
        
        const data = await res.json();

        // 🚨 ADDED ERROR CATCHING: If Cloudinary rejects it, show the exact error
        if (!res.ok) {
          console.error("Cloudinary Error Details:", data);
          alert(`Cloudinary Error: ${data.error?.message || "Check your console"}`);
          setIsUploading(false);
          return;
        }

        if (data.secure_url) {
          // Save to database
          await updateProfilePicture(data.secure_url);
          setSelectedImage(null);
          router.refresh(); // 🚨 Force the dashboard to refresh the image
        }
      } catch (error) {
        console.error("Upload failed completely:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }, "image/jpeg", 0.95);
  };

  return (
    <>
      <div className="relative h-20 w-20 rounded-full flex-shrink-0 group cursor-pointer border-4 border-white shadow-md bg-indigo-600 flex items-center justify-center overflow-hidden">
        {currentPic ? (
          <Image
            src={currentPic}
            alt={`${studentName} Profile`}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <span className="text-2xl font-bold text-white">{initials}</span>
        )}

        <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <Camera className="w-6 h-6 text-white mb-1" />
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Edit</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
            
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Adjust Photo</h3>
              <button onClick={handleCancel} disabled={isUploading} className="text-slate-400 hover:text-rose-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col items-center bg-slate-100/50">
              <div className="rounded-full overflow-hidden shadow-inner bg-slate-200 border-2 border-white">
                <AvatarEditor
                  ref={editorRef}
                  image={selectedImage}
                  width={220}
                  height={220}
                  border={0}
                  borderRadius={110}
                  color={[248, 250, 252, 0.8]}
                  scale={scale}
                  rotate={0}
                  className="cursor-move"
                />
              </div>
              
              <div className="w-full mt-6 flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Zoom</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.01"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="flex-1 accent-indigo-600"
                  disabled={isUploading}
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
              <button
                onClick={handleCancel}
                disabled={isUploading}
                className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUploading}
                className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
              >
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isUploading ? "Saving..." : "Save Photo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}