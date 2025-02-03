"use client";

import { useState } from "react";
import { encrypt } from "@/lib/encryption";
import toast from "react-hot-toast";
import { SubmitReportModalProps } from "@/types/report-submission";
import { MisuseRange } from "@/types/report";
import TelegramVerification from "../common/TelegramVerification";
import StyledDropdown from '../common/StyledDropdown';

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
  const [showTelegramWidget, setShowTelegramWidget] = useState(false);

  const MISUSE_RANGES: MisuseRange[] = [
    "<5k",
    "5-20k",
    "20-50k",
    "50-100k",
    "100-500k",
    "500k+",
  ];

  const misuseRangeOptions = MISUSE_RANGES.map(range => ({
    value: range,
    label: `${range} ARB`
  }));

  const handleVerificationComplete = async (success: boolean, username?: string) => {
    if (success && username) {
      const formattedUsername = `@${username}`;
      setTelegramHandle(formattedUsername);
      setIsVerified(true);
      toast.success('Telegram handle verified successfully');
    } else {
      setIsVerified(false);
      setTelegramHandle('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !file || !misuseRange) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("submitterAddress", walletAddress);
      formData.append("misuseRange", misuseRange);
      
      // Only include telegram handle if verified
      if (isVerified && telegramHandle) {
        const encryptedTelegram =  encrypt(telegramHandle, title);
        formData.append("telegramHandle", encryptedTelegram);
      }
      
      if (file) {
        formData.append("file", file);
      }

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
      setShowTelegramWidget(false);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div
        className="rounded-lg px-6 sm:px-12 py-8 max-w-lg w-full relative overflow-hidden"
        style={{
          background: "#020C1099",
          border: "1px solid",
          backdropFilter: "blur(100px)",
          boxShadow: "0px 4px 50.5px 0px #96F1FF15 inset",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#4ECDC4]/5 to-transparent opacity-30" />
        <div className="relative">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-[#B0E9FF] font-bold tracking-wider text-xl">
              Submit New Report
            </h3>
            <button
              onClick={onClose}
              className="text-[#4ECDC4] hover:text-[#4ecdc5b3] transition-colors"
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
              <label className="block text-gray-300 mb-2 text-s">
                Report Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1A1B1E] text-white rounded-lg px-3 sm:px-4 py-2 text-s focus:ring-2 focus:ring-[#4ECDC4] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-s">
                Misuse Range (ARB)
              </label>
              <StyledDropdown
                value={misuseRange}
                onChange={(value) => setMisuseRange(value as MisuseRange)}
                options={misuseRangeOptions}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-s">
                Telegram Account
              </label>
              <div className="space-y-3">
                {!isVerified && !showTelegramWidget && (
                  <button
                    type="button"
                    onClick={() => setShowTelegramWidget(true)}
                    className="px-4 py-2 rounded-lg bg-[#4ECDC4] text-black hover:bg-[#45b8b0] transition-colors text-s"
                  >
                    Connect Telegram
                  </button>
                )}

                {showTelegramWidget && !isVerified && (
                  <div className="mt-2 p-2 bg-[#1A1B1E] rounded-lg">
                    <p className="text-xs text-gray-300 mb-3">
                      Please verify your Telegram account:
                    </p>
                    <TelegramVerification
                      inputHandle=""
                      onVerificationComplete={handleVerificationComplete}
                    />
                  </div>
                )}

                {isVerified && telegramHandle && (
                  <div className="flex items-center justify-between bg-[#1A1B1E] p-3 rounded-lg">
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
                      <span>{telegramHandle}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTelegramHandle('');
                        setIsVerified(false);
                        setShowTelegramWidget(false);
                      }}
                      className="text-gray-400 hover:text-white"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <p className="text-xs sm:text-sm text-gray-200">
                  Connect your Telegram for communication and payments.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-s">
                Upload File
              </label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full bg-[#1A1B1E] text-white rounded-lg px-3 sm:px-4 py-2 text-xs focus:ring-2 focus:ring-[#4ECDC4] outline-none"
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

            <div className="flex flex-row justify-end gap-3 sm:gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 sm:px-6 py-2 rounded-lg text-gray-300 hover:text-white transition-colors text-s"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#C3FEF8] to-[#D8D8D8] text-black px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg disabled:opacity-50 text-  s"
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
