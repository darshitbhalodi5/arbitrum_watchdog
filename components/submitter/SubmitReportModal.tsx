"use client";

import { useState } from "react";
import { encrypt } from "@/lib/encryption";
import toast from "react-hot-toast";
import { SubmitReportModalProps } from "@/types/report-submission";
import { MisuseRange } from "@/types/report";

const SubmitReportModal = ({
  isOpen,
  onClose,
  onSubmit,
  walletAddress,
}: SubmitReportModalProps) => {
  const [title, setTitle] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [misuseRange, setMisuseRange] = useState<MisuseRange>("<5k");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const MISUSE_RANGES: MisuseRange[] = ["<5k", "5-20k", "20-50k", "50-100k", "100-500k", "500k+"];

  const handleVerifyTelegram = () => {
    if (!telegramHandle) {
      toast.error('Please enter your Telegram handle');
      return;
    }

    // Basic validation for Telegram handle format
    const telegramRegex = /^@?[a-zA-Z0-9_]{5,32}$/;
    const formattedHandle = telegramHandle.startsWith('@') ? telegramHandle : `@${telegramHandle}`;

    if (!telegramRegex.test(formattedHandle)) {
      toast.error('Invalid Telegram handle format. Handle should be 5-32 characters and can only contain letters, numbers, and underscores.');
      return;
    }

    setTelegramHandle(formattedHandle);
    setIsVerified(true);
    toast.success('Telegram handle verified successfully!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !telegramHandle || !file || !misuseRange) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!isVerified) {
      toast.error('Please verify your Telegram handle first');
      return;
    }

    setIsSubmitting(true);

    try {
      // Encrypt telegram handle using title as key
      const encryptedTelegram = await encrypt(telegramHandle, title);

      // Create form data for file upload
      const formData = new FormData();
      formData.append("title", title);
      formData.append("telegramHandle", encryptedTelegram);
      formData.append("submitterAddress", walletAddress);
      formData.append("misuseRange", misuseRange);
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
      setMisuseRange("<5k");
      setIsVerified(false);
      onSubmit();
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
                Misuse Range (ARB)
              </label>
              <select
                value={misuseRange}
                onChange={(e) => setMisuseRange(e.target.value as MisuseRange)}
                className="w-full bg-[#1A1B1E] text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-[#4ECDC4] outline-none"
                required
              >
                {MISUSE_RANGES.map((range) => (
                  <option key={range} value={range}>
                    {range} ARB
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm sm:text-base">
                Telegram Account
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={telegramHandle}
                    onChange={(e) => {
                      setTelegramHandle(e.target.value);
                      setIsVerified(false);
                    }}
                    placeholder="@username"
                    className="flex-1 bg-[#1A1B1E] text-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:ring-2 focus:ring-[#4ECDC4] outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleVerifyTelegram}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                      isVerified
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-[#4ECDC4] text-black hover:bg-[#45b8b0]'
                    }`}
                  >
                    {isVerified ? 'Verified ✓' : 'Verify'}
                  </button>
                </div>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  It will be used for payments and communication.              </p>
                {isVerified && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Telegram handle verified</span>
                  </div>
                )}
              </div>
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
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Max. Upload Size: 2 MB
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
                disabled={isSubmitting || !isVerified}
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
