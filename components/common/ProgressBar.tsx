import { Vote } from "@/types/vote";
import { ProgressBarProps } from "@/types/progressbar";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

const ProgressBar = ({
  report,
  onKycVerify,
  onBasePaymentVerify,
  onAdditionalPaymentVerify,
  isSubmitter,
}: ProgressBarProps) => {
  const [localReport, setLocalReport] = useState(report);
  const { user } = usePrivy();

  // Check if current reviewer has already verified payments
  const currentReviewerVote = localReport.votes.find(
    (v) => v.reviewerAddress === user?.wallet?.address
  );

  const hasVerifiedBasePayment = currentReviewerVote?.basePaymentSent || false;
  const hasVerifiedAdditionalPayment = currentReviewerVote?.additionalPaymentSent || false;

  // To handle KYC verification
  const handleKycVerify = async () => {
    try {
      const response = await fetch(`/api/reports/${report._id}/kyc`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to verify KYC");

      // Update the report status locally
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setLocalReport((prev: any) => ({
        ...prev,
        kycStatus: "completed"
      }));
      
      // Update the report status locally
      // if (report && typeof report === "object") {
      //   report.kycStatus = "completed";
      // }

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

   // Handle base payment verification
   const handleBasePaymentVerify = async () => {
    try {
      await onBasePaymentVerify?.();

      // Update local state to reflect the new payment confirmation
      setLocalReport(prev => {
        const updatedVotes = prev.votes.map(vote => {
          if (vote.reviewerAddress === user?.wallet?.address) {
            return { ...vote, basePaymentSent: true };
          }
          return vote;
        });

        const completedCount = updatedVotes.filter(v => v.basePaymentSent).length;
        
        return {
          ...prev,
          votes: updatedVotes,
          basePaymentStatus: completedCount === 3 ? "completed" : prev.basePaymentStatus
        };
      });

      toast.success("Base payment verified");
    } catch (error) {
      console.error("Error verifying base payment:", error);
      toast.error("Failed to verify base payment");
    }
  };

  // Handle additional payment verification
  const handleAdditionalPaymentVerify = async () => {
    try {
      await onAdditionalPaymentVerify?.();

      // Update local state to reflect the new payment confirmation
      setLocalReport(prev => {
        const updatedVotes = prev.votes.map(vote => {
          if (vote.reviewerAddress === user?.wallet?.address) {
            return { ...vote, additionalPaymentSent: true };
          }
          return vote;
        });

        const completedCount = updatedVotes.filter(v => v.additionalPaymentSent).length;
        
        return {
          ...prev,
          votes: updatedVotes,
          additionalPaymentStatus: completedCount === 3 ? "completed" : prev.additionalPaymentStatus
        };
      });

      toast.success("Additional payment verified");
    } catch (error) {
      console.error("Error verifying additional payment:", error);
      toast.error("Failed to verify additional payment");
    }
  };

   // Get status text for base payment
   const getBasePaymentStatusForReviewer = () => {
    if (localReport.basePaymentStatus === "completed") return "Payment Completed";
    if (hasVerifiedBasePayment) return "Payment Verified";
    return "Verify Payment";
  };

  // Get status text for additional payment
  const getAdditionalPaymentStatusForReviewer = () => {
    if (localReport.additionalPaymentStatus === "completed") return "Payment Completed";
    if (hasVerifiedAdditionalPayment) return "Payment Verified";
    return "Verify Payment";
  };

  // Defined step for progress bar
  const steps = [
    {
      title: "KYC Verification",
      status: localReport.kycStatus,
      action: isSubmitter ? (
        <button
          onClick={handleKycVerify}
          disabled={localReport.kycStatus === "completed"}
          className={`px-3 py-1 rounded-lg text-sm ${
            localReport.kycStatus === "completed"
              ? "bg-green-500/20 text-green-400"
              : "bg-[#4ECDC4] text-white hover:opacity-90"
          }`}
        >
          {localReport.kycStatus === "completed" ? "Verified" : "Verify KYC"}
        </button>
      ) : null,
    },
    {
      title: "Base Payment",
      status: localReport.basePaymentStatus,
      statusText: getBasePaymentStatusText(localReport.basePaymentStatus, localReport.votes),
      action: !isSubmitter && localReport.kycStatus === "completed" && localReport.votes.length === 3 && !hasVerifiedBasePayment ? (
        <button
          onClick={handleBasePaymentVerify}
          disabled={localReport.basePaymentStatus === "completed"}
          className={`px-3 py-1 rounded-lg text-sm ${
            localReport.basePaymentStatus === "completed" || hasVerifiedBasePayment
              ? "bg-green-500/20 text-green-400"
              : "bg-[#4ECDC4] text-white hover:opacity-90"
          }`}
        >
          {getBasePaymentStatusForReviewer()}
        </button>
      ) : null,
    },
    {
      title: "Additional Payment",
      status: localReport.additionalPaymentStatus,
      statusText: getAdditionalPaymentStatusText(
        localReport.additionalPaymentStatus,
        localReport.votes
      ),
      action: !isSubmitter && localReport.basePaymentStatus === "completed" && localReport.votes.length === 3 && !hasVerifiedAdditionalPayment ? (
        <button
          onClick={handleAdditionalPaymentVerify}
          disabled={localReport.additionalPaymentStatus === "completed"}
          className={`px-3 py-1 rounded-lg text-sm ${
            localReport.additionalPaymentStatus === "completed" || hasVerifiedAdditionalPayment
              ? "bg-green-500/20 text-green-400"
              : "bg-[#4ECDC4] text-white hover:opacity-90"
          }`}
        >
          {getAdditionalPaymentStatusForReviewer()}
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
