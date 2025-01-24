"use client";

import { useState } from "react";
import SubmitReportModal from "@/components/submitter/SubmitReportModal";
import ReportHistory from "@/components/submitter//ReportHistory";
import { usePrivy } from "@privy-io/react-auth";

const SubmitterDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = usePrivy();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReportSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-secondary">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 
            className="text-3xl sm:text-4xl font-light font-primary text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(179.21deg, #FFFFFF 17.3%, #000000 168.94%)",
            }}
          >
            Submitter Dashboard
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 rounded-lg relative overflow-hidden group"
            style={{
              background: "#020C1099",
              border: "1px solid",
              backdropFilter: "blur(80px)",
              boxShadow: "0px 4px 50.5px 0px #96F1FF21 inset",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#4ECDC4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-[#B0E9FF] font-medium">Submit New Report</span>
          </button>
        </div>
      </div>

      <SubmitReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReportSubmitted}
        walletAddress={user?.wallet?.address || ""}
      />

      <div className="mt-8">
        <h3 
          className="text-2xl sm:text-3xl font-light font-primary mb-6 text-transparent bg-clip-text"
          style={{
            backgroundImage:
              "linear-gradient(179.48deg, #FBFCA4 17.14%, #FFFFFF 135.08%)",
          }}
        >
          Your Report History
        </h3>
        <ReportHistory
          walletAddress={user?.wallet?.address || ""}
          key={refreshTrigger}
        />
      </div>
    </div>
  );
};

export default SubmitterDashboard;
