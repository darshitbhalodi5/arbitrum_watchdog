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

  const handleVerifyTelegram = () => {
    if (!telegramHandle) {
      toast.error("Please enter your Telegram handle");
      return;
    }

    // Basic validation for Telegram handle format
    const telegramRegex = /^@?[a-zA-Z0-9_]{5,32}$/;
    const formattedHandle = telegramHandle.startsWith("@")
      ? telegramHandle
      : `@${telegramHandle}`;

    if (!telegramRegex.test(formattedHandle)) {
      toast.error(
        "Invalid Telegram handle format. Handle should be 5-32 characters and can only contain letters, numbers, and underscores."
      );
      return;
    }

    setTelegramHandle(formattedHandle);
    setShowTelegramWidget(true);
    // console.log('Showing Telegram widget for verification');
  };

  const handleVerificationComplete = (success: boolean, username?: string) => {
    // console.log('Verification complete:', { success, username });

    if (success && username) {
      const formattedUsername = `@${username}`;
      if (formattedUsername.toLowerCase() !== telegramHandle.toLowerCase()) {
        console.error("Username mismatch:", {
          input: telegramHandle.toLowerCase(),
          telegram: formattedUsername.toLowerCase(),
        });
        toast.error("The provided handle does not match your Telegram account");
        setIsVerified(false);
        return;
      }

      setIsVerified(true);
      // console.log('Telegram handle verified successfully');
    } else {
      setIsVerified(false);
      // console.log('Telegram verification failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log('Submitting form with data:', {
    //   title,
    //   telegramHandle,
    //   misuseRange,
    //   isVerified
    // });

    if (!title || !telegramHandle || !file || !misuseRange) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isVerified) {
      toast.error("Please verify your Telegram handle first");
      return;
    }

    setIsSubmitting(true);

    try {
      // console.log('Encrypting telegram handle...');
      const encryptedTelegram = await encrypt(telegramHandle, title);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("telegramHandle", encryptedTelegram);
      formData.append("submitterAddress", walletAddress);
      formData.append("misuseRange", misuseRange);
      if (file) {
        formData.append("file", file);
      }

      // console.log('Submitting to API...');
      const response = await fetch("/api/reports", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      // console.log('Report submitted successfully');
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
        style={{
          background: "#020C1099",
          border: "1px solid",
          backdropFilter: "blur(100px)",
          boxShadow: "0px 4px 50.5px 0px #96F1FF15 inset",
        }}
        className="bg-[#2C2D31] rounded-lg w-full max-w-md max-h-[90vh] relative overflow-y-auto scroll"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#4ECDC4]/5 to-transparent opacity-30 z-10" />

        <div className="p-6 z-30 relative">
          <div className="flex justify-between items-center mb-3">
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
              <label className="block text-gray-300 mb-2 text-xs">
                Report Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1A1B1E] text-white rounded-lg px-3 sm:px-4 py-2 text-xs focus:ring-2 focus:ring-[#4ECDC4] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-xs">
                Misuse Range (ARB)
              </label>
              <StyledDropdown
                value={misuseRange}
                onChange={(value) => setMisuseRange(value as MisuseRange)}
                options={misuseRangeOptions}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-xs">
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
                      setShowTelegramWidget(false);
                    }}
                    placeholder="@username"
                    className="flex-1 bg-[#1A1B1E] text-white rounded-lg px-3 sm:px-4 py-2 text-xs focus:ring-2 focus:ring-[#4ECDC4] outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleVerifyTelegram}
                    className={`px-4 py-2 rounded-lg transition-colors text-xs ${
                      isVerified
                        ? "bg-green-500/20 text-green-400"
                        : "bg-[#4ECDC4] text-black hover:bg-[#45b8b0]"
                    }`}
                  >
                    {isVerified ? "Verified ✓" : "Verify"}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-400">
                  It will be used for payments and communication.
                </p>

                {showTelegramWidget && !isVerified && (
                  <div className="mt-2 p-2 bg-[#1A1B1E] rounded-lg">
                    <p className="text-xs text-gray-300 mb-3">
                      Please verify your Telegram account:
                    </p>
                    <TelegramVerification
                      inputHandle={telegramHandle}
                      onVerificationComplete={handleVerificationComplete}
                    />
                  </div>
                )}

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
              <label className="block text-gray-300 mb-2 text-xs">
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
                className="px-4 sm:px-6 py-2 rounded-lg text-gray-300 hover:text-white transition-colors text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isVerified}
                className="bg-gradient-to-r from-[#C3FEF8] to-[#D8D8D8] text-black px-4 py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg disabled:opacity-50 text-xs"
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
