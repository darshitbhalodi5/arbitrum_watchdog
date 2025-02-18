import { usePrivy } from "@privy-io/react-auth";
import toast from "react-hot-toast";
import ProgressBar from "@/components/common/ProgressBar";
import { ReportDetailProps } from "@/types/report-details";

const ReportDetail = ({
  report,
  isReviewer,
  onKycVerify,
  onTelegramReveal,
  decryptedHandle,
  onTelegramHide,
}: ReportDetailProps) => {
  const { user } = usePrivy();

  // File viewer function
  const handleFileView = async () => {
    try {
      const response = await fetch(`/api/reports/${report._id}/file`);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error viewing file:", error);
      toast.error("Failed to view file");
    }
  };

  // Base payment confirmation
  const handleBasePaymentConfirm = async () => {
    try {
      const response = await fetch(`/api/reports/${report._id}/payment/base`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerAddress: user?.wallet?.address,
        }),
      });
      if (!response.ok) throw new Error("Failed to confirm payment");

      // Update the report status locally
      if (report && typeof report === "object") {
        report.basePaymentConfirmations =
          (report.basePaymentConfirmations || 0) + 1;
      }

      // toast.success("Base payment confirmed");
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Failed to confirm payment");
    }
  };

  // Additional payment confirmation
  const handleAdditionalPaymentConfirm = async () => {
    try {
      const response = await fetch(
        `/api/reports/${report._id}/payment/additional`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewerAddress: user?.wallet?.address,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to confirm additional payment");

      // Update the report status locally
      if (report && typeof report === "object") {
        report.additionalPaymentConfirmations =
          (report.additionalPaymentConfirmations || 0) + 1;
      }

      // toast.success("Additional payment confirmed");
    } catch (error) {
      console.error("Error confirming additional payment:", error);
      toast.error("Failed to confirm additional payment");
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Info of report */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center">
          <span className="text-gray-400 text-xs sm:text-base">Submitter:</span>
          <span className="ml-2 text-white font-mono text-wrap text-[3vw] sm:text-base">
            {report.submitterAddress}
          </span>
        </div>

        <div>
          <span className="text-gray-400 text-xs sm:text-base">Misuse Amount:</span>
          <span className="ml-2 text-[#4ECDC4] font-mono text-xs sm:text-base">
            {report.misuseRange} ARB
          </span>
        </div>

        <button
          onClick={handleFileView}
          className="text-[#4ECDC4] text-xs sm:text-base hover:underline focus:outline-none inline-flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View Submitted File
        </button>
      </div>

      {/* Telegram Handle Section */}
      {isReviewer && (
        <div className="mt-4 text-xs sm:text-base">
          {report.telegramHandle ? (
            decryptedHandle ? (
              <div className="bg-[#1A1B1E] p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-400">Submitter&apos;s Telegram:</p>
                  <button
                    onClick={onTelegramHide}
                    className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                    title="Hide telegram handle"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400 hover:text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-[#4ECDC4] font-mono">{decryptedHandle}</p>
              </div>
            ) : (
              <button
                onClick={() => onTelegramReveal?.(report.title)}
                className="text-[#4ECDC4] hover:text-[#45b8b0] flex items-center gap-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Click to reveal Telegram handle
              </button>
            )
          ) : (
            <div className="bg-[#1A1B1E] p-4 rounded-lg opacity-50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400">Submitter&apos;s Telegram:</p>
                <span className="text-gray-500 text-xs">Not provided</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
                <span>No Telegram handle available</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {report.status === "approved" && (
        <ProgressBar
          report={report}
          onKycVerify={onKycVerify}
          onBasePaymentVerify={handleBasePaymentConfirm}
          onAdditionalPaymentVerify={handleAdditionalPaymentConfirm}
          isSubmitter={!isReviewer}
        />
      )}
    </div>
  );
};

export default ReportDetail;
