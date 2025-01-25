import { Vote } from "@/types/vote";
import { ProgressBarProps } from "@/types/progressbar";
import { toast } from "react-hot-toast";

const ProgressBar = ({
  report,
  onKycVerify,
  onBasePaymentVerify,
  onAdditionalPaymentVerify,
  isSubmitter,
}: ProgressBarProps) => {
  // To handle KYC verification
  const handleKycVerify = async () => {
    try {
      const response = await fetch(`/api/reports/${report._id}/kyc`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to verify KYC");

      // Update the report status locally
      if (report && typeof report === "object") {
        report.kycStatus = "completed";
      }

      // Call the onKycVerify callback if provided
      if (onKycVerify) {
        await onKycVerify();
      }

      toast.success("KYC verification completed");
    } catch (error) {
      console.error("Error verifying KYC:", error);
      toast.error("Failed to verify KYC");
    }
  };

  // Defined step for progress bar
  const steps = [
    {
      title: "KYC Verification",
      status: report.kycStatus,
      action: isSubmitter ? (
        <button
          onClick={handleKycVerify}
          disabled={report.kycStatus === "completed"}
          className={`px-3 py-1 rounded-lg text-sm ${
            report.kycStatus === "completed"
              ? "bg-green-500/20 text-green-400"
              : "bg-[#4ECDC4] text-white hover:opacity-90"
          }`}
        >
          {report.kycStatus === "completed" ? "Verified" : "Verify KYC"}
        </button>
      ) : null,
    },
    {
      title: "Base Payment",
      status: report.basePaymentStatus,
      statusText: getBasePaymentStatusText(report.basePaymentStatus, report.votes),
      action: !isSubmitter && report.kycStatus === "completed" && report.votes.length === 3 ? (
        <button
          onClick={onBasePaymentVerify}
          disabled={
            report.basePaymentStatus === "completed" || 
            !!report.votes.find(
              (v) => v.reviewerAddress === window.ethereum?.selectedAddress && v.basePaymentSent
            )
          }
          className={`px-3 py-1 rounded-lg text-sm ${
            report.basePaymentStatus === "completed"
              ? "bg-green-500/20 text-green-400"
              : "bg-[#4ECDC4] text-white hover:opacity-90"
          }`}
        >
          {report.basePaymentStatus === "completed" ? "Payment Completed" : "Verify Payment"}
        </button>
      ) : null,
    },
    {
      title: "Additional Payment",
      status: report.additionalPaymentStatus,
      statusText: getAdditionalPaymentStatusText(
        report.additionalPaymentStatus,
        report.votes
      ),
      action: !isSubmitter && report.basePaymentStatus === "completed" && report.votes.length === 3 ? (
        <button
          onClick={onAdditionalPaymentVerify}
          disabled={
            report.additionalPaymentStatus === "completed" || 
            !!report.votes.find(
              (v) => v.reviewerAddress === window.ethereum?.selectedAddress && v.additionalPaymentSent
            )
          }
          className={`px-3 py-1 rounded-lg text-sm ${
            report.additionalPaymentStatus === "completed"
              ? "bg-green-500/20 text-green-400"
              : "bg-[#4ECDC4] text-white hover:opacity-90"
          }`}
        >
          {report.additionalPaymentStatus === "completed" ? "Verified" : "Verify Payment"}
        </button>
      ) : null,
    },
  ];

  return (
    <div className="mt-6 pt-6 border-t border-gray-800">
      <h3 className="text-white font-semibold mb-4">
        Verification and Payment Status
      </h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  step.status === "completed"
                    ? "bg-green-400"
                    : step.status === "rejected"
                    ? "bg-red-400"
                    : "bg-yellow-400"
                }`}
              />
              <span className="text-gray-300">{step.title}</span>
            </div>
            <div className="flex items-center gap-2">
              {step.statusText && (
                <span className="text-sm text-gray-400">{step.statusText}</span>
              )}
              {step.action}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Text for base payment status
function getBasePaymentStatusText(status: string, votes: Vote[]) {
  if (status === "completed") return "Payment Completed";
  if (status === "rejected") return "Payment Rejected";

  const completedCount = votes.filter((v) => v.basePaymentSent).length;
  return `${completedCount}/3 Confirmed`;
}

// text for additional payment status
function getAdditionalPaymentStatusText(status: string, votes: Vote[]) {
  if (status === "completed") return "Payment Completed";
  if (status === "rejected") return "Payment Rejected";

  const completedCount = votes.filter((v) => v.additionalPaymentSent).length;
  return `${completedCount}/3 Confirmed`;
}

export default ProgressBar;
