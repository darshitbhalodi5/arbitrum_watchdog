"use client";

import { useCallback, useEffect, useState } from "react";
import { decrypt } from "@/lib/encryption";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import VoteDetails from "@/components/submitter/VoteDetails";
import ProgressBar from "@/components/common/ProgressBar";
import QuestionAnswer from "@/components/common/QuestionAnswer";
import NoReports from "@/components/NoReport";
import Loading from "@/components/Loader";
import TabView from "@/components/common/TabView";
import { Report, Question } from "@/types/report-history";

interface ReportHistoryProps {
  walletAddress: string;
  onRefresh?: () => Promise<void>;
}

const ReportHistory = ({ walletAddress, onRefresh }: ReportHistoryProps) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [decryptedHandles, setDecryptedHandles] = useState<{
    [key: string]: string;
  }>({});

  // Fetch reports
  const fetchReports = useCallback(async () => {
    try {
      const response = await fetch(`/api/reports?address=${walletAddress}`);
      if (!response.ok) throw new Error("Failed to fetch reports");
      const data = await response.json();

      // Check for unread questions for each report
      const reportsWithQuestions = await Promise.all(
        data.map(async (report: Report) => {
          const questionsResponse = await fetch(
            `/api/questions?reportId=${report._id}&userAddress=${walletAddress}&isReviewer=false`
          );
          const questions: Question[] = await questionsResponse.json();
          return {
            ...report,
            hasUnreadQuestions: questions.some((q) => !q.answer && !q.isRead),
          };
        })
      );

      setReports(reportsWithQuestions);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // To download files
  const handleFileView = async (reportId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent report card click
    try {
      const response = await fetch(`/api/reports/${reportId}/file`, {
        method: "GET",
        headers: {
          Accept: "application/octet-stream",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link and click it
      const link = document.createElement("a");
      link.href = url;
      link.download = "report-file";
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success("File download started");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  // Telegram toggle to show and hide telegram handle
  const handleTelegramToggle = (
    reportId: string,
    encryptedTelegram: string,
    title: string
  ) => {
    if (decryptedHandles[reportId]) {
      // If already revealed, hide it
      setDecryptedHandles((prev) => {
        const newHandles = { ...prev };
        delete newHandles[reportId];
        return newHandles;
      });
    } else {
      // If hidden, reveal it
      try {
        const decrypted = decrypt(encryptedTelegram, title);
        setDecryptedHandles((prev) => ({
          ...prev,
          [reportId]: decrypted,
        }));
      } catch (error) {
        console.error("Failed to decrypt telegram handle:", error);
        toast.error("Failed to decrypt telegram handle");
      }
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      await onRefresh();
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (reports.length === 0) {
    return <NoReports />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
      {/* Reports List */}
      <div
        className={`${selectedReport ? "lg:w-1/3" : "w-full"} ${selectedReport ? "hidden lg:block" : "block"
          }`}
      >
        <div className="space-y-3 sm:space-y-4">
          {reports.map((report) => (
            <button
              key={report._id}
              onClick={() => setSelectedReport(report)}
              className={`w-full p-3 sm:p-4 rounded-lg text-left ${selectedReport?._id === report._id
                  ? "bg-[#4ECDC4]/10 border-[#4ECDC4] border"
                  : "bg-[#2C2D31] border-gray-800 border hover:border-[#4ECDC4]"
                }`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                <div className="flex items-start gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    {report.title}
                  </h3>
                  {report.hasUnreadQuestions && (
                    <span className="animate-pulse w-2 h-2 bg-[#FF6B6B] rounded-full mt-2"></span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400">
                    {report.misuseRange} ARB
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${report.status === "approved"
                        ? "bg-green-500/20 text-green-400"
                        : report.status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                  >
                    {report.status.charAt(0).toUpperCase() +
                      report.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-400">
                <p>
                  Submitted: {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Back Button */}
      {selectedReport && (
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSelectedReport(null)}
            className="text-gray-400 hover:text-white flex items-center gap-2"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Reports
          </button>
        </div>
      )}

      {/* Report Detail with Tabs */}
      {selectedReport && (
        <div className="lg:w-2/3">
          <div className="bg-[#2C2D31] rounded-lg p-4 sm:p-6 border border-gray-800">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-white">
                {selectedReport.title}
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-white"
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

            <TabView
              tabs={[
                {
                  id: "details",
                  label: "Report Details",
                  content: (
                    <>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between flex-wrap">
                            <span className="text-gray-400 text-nowrap text-xs sm:text-base">
                              Wallet Address:
                            </span>
                            <span className="text-white text-[2.6vw] sm:text-base">
                              {selectedReport.submitterAddress}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-xs sm:text-base">Telegram:</span>
                            <div className="flex items-center gap-2 text-xs sm:text-base">
                              {decryptedHandles[selectedReport._id] ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-[#4ECDC4]">
                                    {decryptedHandles[selectedReport._id]}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleTelegramToggle(
                                        selectedReport._id,
                                        selectedReport.telegramHandle!,
                                        selectedReport.title
                                      )
                                    }
                                    className="p-1 hover:bg-gray-700 rounded-full"
                                    title="Hide telegram handle"
                                  >
                                    <EyeSlashIcon className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <span>••••••••</span>
                                  <button
                                    onClick={() =>
                                      handleTelegramToggle(
                                        selectedReport._id,
                                        selectedReport.telegramHandle!,
                                        selectedReport.title
                                      )
                                    }
                                    className="p-1 hover:bg-gray-700 rounded-full"
                                    title="Show telegram handle"
                                  >
                                    <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-xs sm:text-base">
                              Submitted Date:
                            </span>
                            <span className="text-white text-xs sm:text-base">
                              {new Date(
                                selectedReport.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-xs sm:text-base">Report File:</span>
                            <button
                              onClick={(e) =>
                                handleFileView(selectedReport._id, e)
                              }
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
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                              Download File
                            </button>
                          </div>
                        </div>
                        {selectedReport.status === "approved" && (
                          <div className="mt-4">
                            <ProgressBar
                              report={selectedReport}
                              onKycVerify={async () => {
                                try {
                                  fetchReports();
                                } catch (error) {
                                  console.error(
                                    "Error fetching reports after KYC:",
                                    error
                                  );
                                }
                              }}
                              isSubmitter={true}
                            />
                          </div>
                        )}
                      </div>
                    </>
                  ),
                },
                {
                  id: "qa",
                  label: "Chat",
                  content: (
                    <QuestionAnswer
                      reportId={selectedReport._id}
                      isReviewer={false}
                      onRefresh={handleRefresh}
                    />
                  ),
                },
                {
                  id: "votes",
                  label: "Vote Details",
                  content: (
                    <VoteDetails votes={selectedReport.votes} showAll={true} />
                  ),
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportHistory;
