"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import toast from "react-hot-toast";
import SubmitReportModal from "@/components/submitter/SubmitReportModal";
import ReportHistory from "@/components/submitter/ReportHistory";
import FundStats from '../common/FundStats';

const SubmitterDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const { user } = usePrivy();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      setRefreshTrigger((prev) => prev + 1);
      setLastRefreshed(new Date());
      // toast.success("Reports refreshed successfully");
    } catch (error) {
      console.error("Error refreshing reports:", error);
      toast.error("Failed to refresh reports");
    } finally {
      setIsRefreshing(false);
    }
  };

  // To handle the post report submission
  const handleReportSubmitted = () => {
    setRefreshTrigger((prev) => prev + 1);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 sm:pb-1 pb-0 font-secondary">

      <div className="flex justify-between items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-5xl font-primary font-medium tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] from-[17.3%] to-[168.94%] to-[#000000]">
          Submitter Dashboard
        </h1>
        <div className="flex flex-col-reverse lg:flex-row items-end lg:items-center gap-2 lg:gap-4">
          <span className="text-[8px] sm:text-sm text-gray-400 text-nowrap">
            Last refreshed - {lastRefreshed.toLocaleTimeString()}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-2 py-2 text-[8px] sm:text-base sm:px-4 sm:py-2 rounded-lg bg-[#1A1B1E] text-[#4ECDC4] hover:bg-[#2C2D31] transition-colors disabled:opacity-50"
          >
            {isRefreshing ? (
              <>
                <svg
                  className="animate-spin w-2 h-2 sm:w-4 sm:h-4 rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Refreshing...</span>
              </>
            ) : (
              <>
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Refresh</span>
              </>
            )}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-auto px-2 py-2 text-[8px] sm:text-base sm:px-4 sm:py-2 rounded-lg relative overflow-hidden group text-nowrap"
            style={{
              background: "#020C1099",
              border: "1px solid",
              backdropFilter: "blur(80px)",
              boxShadow: "0px 4px 50.5px 0px #96F1FF21 inset",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#4ECDC4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-[#B0E9FF] font-medium">
              Submit New Report
            </span>
          </button>
        </div>
      </div>

      <FundStats />
      
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
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
};

export default SubmitterDashboard;
