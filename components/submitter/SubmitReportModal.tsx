"use client";

import { useState } from "react";
import { encrypt } from "@/lib/encryption";
import toast from "react-hot-toast";
import { SubmitReportModalProps } from "@/types/report-submission";

const SubmitReportModal = ({
  isOpen,
  onClose,
  onSubmit,
  walletAddress,
}: SubmitReportModalProps) => {
  const [title, setTitle] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle report sub mission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Encrypt telegram handle using title as key
      const encryptedTelegram = await encrypt(telegramHandle, title);

      // Create form data for file upload
      const formData = new FormData();
      formData.append("title", title);
      formData.append("telegramHandle", encryptedTelegram);
      formData.append("submitterAddress", walletAddress);
      if (file) {
        formData.append("file", file);
      }

      // Submit to API
      const response = await fetch("/api/reports", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      toast.success("Report submitted successfully");
      setTitle("");
      setTelegramHandle("");
      setFile(null);
      onSubmit(); // Call onSubmit to trigger refresh
      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#2C2D31] rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Submit New Report
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                Report Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1A1B1E] text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-[#4ECDC4] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                Telegram Handle
              </label>
              <input
                type="text"
                value={telegramHandle}
                onChange={(e) => setTelegramHandle(e.target.value)}
                className="w-full bg-[#1A1B1E] text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-[#4ECDC4] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                Upload File
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full bg-[#1A1B1E] text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-[#4ECDC4] outline-none"
                accept=".pdf,.doc,.docx,.txt"
                required
              />
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Supported formats: PDF, DOC, DOCX, TXT
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#C3FEF8] to-[#D8D8D8] text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg disabled:opacity-50 text-sm sm:text-base"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitReportModal;
