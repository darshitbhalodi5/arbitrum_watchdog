"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";
import toast from "react-hot-toast";
import { decrypt } from "@/lib/encryption";
import { IReport } from "@/models/Report";
import TabView from "@/components/common/TabView";
import ReportDetail from "@/components/reviewer/ReportDetail";
import VoteDetailsTab from "@/components/reviewer/VoteDetailsTab";
import QuestionAnswer from "@/components/common/QuestionAnswer";
import SearchBar from "@/components/common/SearchBar";
import StatusFilter from "@/components/common/StatusFilter";
import {
  IReportWithQuestions,
  VoteCount,
  Question,
} from "@/types/reviewer-dashboard";
import BookmarkButton from "@/components/common/BookmarkButton";
import { useBookmarks } from "@/hooks/useBookmarks"; // Adjust the import path as needed
import { MisuseRange } from "@/types/report";
import Loading from "../Loader";
import StyledDropdown from '../common/StyledDropdown';

const ReviewerDashboard = () => {
  const { user } = usePrivy();
  const [reports, setReports] = useState<IReportWithQuestions[]>([]);
  const [selectedReport, setSelectedReport] =
    useState<IReportWithQuestions | null>(null);
  const [comment, setComment] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [showTelegramPrompt, setShowTelegramPrompt] = useState(false);
  const [decryptedHandles, setDecryptedHandles] = useState<{
    [key: string]: string;
  }>({});
  const [showSeverity, setShowSeverity] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);
  const [telegramError, setTelegramError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "approved" | "rejected" | "pending"
  >("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortBy, setSortBy] = useState<"date" | "misuseRange">("date");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [allReport, setAllReport] = useState(false);

  const {
    bookmarks: bookmarkedReports,
    toggleBookmark: handleToggleBookmark,
    isBookmarked,
  } = useBookmarks("reviewerReportBookmarks");

  // Memoize expensive computations
  const reportsCache = useMemo(() => {
    return reports.reduce((acc, report) => {
      acc[report._id as string] = report;
      return acc;
    }, {} as Record<string, IReportWithQuestions>);
  }, [reports]);

  // Helper function to convert misuse range to numeric value for sorting
  const getMisuseRangeValue = (range: MisuseRange): number => {
    const values: { [key in MisuseRange]: number } = {
      "<5k": 1,
      "5-20k": 2,
      "20-50k": 3,
      "50-100k": 4,
      "100-500k": 5,
      "500k+": 6,
    };
    return values[range];
  };

  // Filter reports based on search query and status
  const filteredReports = useMemo(() => {
    let filtered = reports;

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((report) => report.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((report) =>
        report.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [reports, searchQuery, selectedStatus]);

  // Sort reports with bookmarked ones first and then by selected criteria
  const sortedReports = useMemo(() => {
    return [...filteredReports].sort((a, b) => {
      // First sort by bookmark status
      const aBookmarked = isBookmarked(a._id as string) ? 1 : 0;
      const bBookmarked = isBookmarked(b._id as string) ? 1 : 0;
      if (aBookmarked !== bBookmarked) {
        return bBookmarked - aBookmarked;
      }

      // Then sort by selected criteria
      if (sortBy === "date") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else {
        const aValue = getMisuseRangeValue(a.misuseRange);
        const bValue = getMisuseRangeValue(b.misuseRange);
        return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
      }
    });
  }, [filteredReports, isBookmarked, sortOrder, sortBy]);

  // To calculate the vote count
  const calculateVoteCounts = (report: IReport): VoteCount => {
    return report.votes.reduce(
      (acc, vote) => {
        if (vote.vote === "approved") {
          acc.approved += 1;
        } else if (vote.vote === "rejected") {
          acc.rejected += 1;
        }
        acc.total += 1;
        return acc;
      },
      { approved: 0, rejected: 0, total: 0 }
    );
  };

  const fetchReportDetail = useCallback(async (): Promise<
    IReportWithQuestions[]
  > => {
    const response = await fetch("/api/reports/all");
    if (!response.ok) throw new Error("Failed to fetch reports");
    const data = await response.json();

    // Check for unread answers and new questions for each report
    const reportsWithDetails = await Promise.all(
      data.map(async (report: IReport) => {
        const questionsResponse = await fetch(
          `/api/questions?reportId=${report._id}&userAddress=${user?.wallet?.address}&isReviewer=true`
        );
        const questions = await questionsResponse.json();

        return {
          ...report,
          hasUnreadAnswers: questions.some(
            (q: Question) => q.answer && !q.isRead
          ),
          hasNewQuestions: questions.some(
            (q: Question) =>
              q.isSubmitterQuestion &&
              !q.answer &&
              !(q.notifiedReviewers || []).includes(user?.wallet?.address || "")
          ),
          hasKycUpdate:
            report.kycStatus === "completed" && report.status === "pending",
          voteCount: calculateVoteCounts(report),
        };
      })
    );
    return reportsWithDetails;
  }, [user?.wallet?.address]);

  // Function for fetch all reports
  const fetchReports = useCallback(async () => {
    if (reports.length > 0) return; // Prevent repeated fetching
    setAllReport(true);
    try {
      const reportsWithDetails = await fetchReportDetail();

      setReports(reportsWithDetails);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to fetch reports");
    } finally {
      setAllReport(false);
    }
  }, [reports.length, fetchReportDetail]);

  // Use effect to fetch reports only once
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Optimize report selection
  const handleReportSelection = (reportId: string) => {
    const cachedReport = reportsCache[reportId];
    if (cachedReport) {
      setSelectedReport(cachedReport);
    }
  };

  if (allReport) {
    return <Loading message="Fetching all reports for review ..." />;
  }

  // Handle vote status
  const handleStatusUpdate = async (
    vote: "approved" | "rejected",
    severity?: "high" | "medium" | "low"
  ) => {
    if (!selectedReport || !user?.wallet?.address) return;

    if (vote === "rejected" && !comment.trim()) {
      toast.error("Please provide a comment for rejection");
      return;
    }

    setIsVoting(true);
    setVoteError(null);

    try {
      const response = await fetch(
        `/api/reports/${selectedReport._id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vote,
            severity,
            reviewerComment: comment,
            reviewerAddress: user.wallet.address,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      // Fetch fresh data first
      const reportsWithDetails = await fetchReportDetail();

      // Update reports which will trigger reportsCache memo
      setReports(reportsWithDetails);

      // Update selected report
      const updatedSelectedReport = reportsWithDetails.find(
        (r) => r._id === selectedReport._id
      );
      if (updatedSelectedReport) {
        setSelectedReport(updatedSelectedReport);
      }

      // Clear form states after successful update
      setComment("");
      setShowSeverity(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to submit vote");
      setVoteError("Failed to submit vote. Please try again.");
      setShowSeverity(false);
    } finally {
      setIsVoting(false);
    }
  };

  // To check reviewer voted or not
  const hasVoted = (report: IReportWithQuestions | null) => {
    if (!report || !user?.wallet?.address) return false;
    return report.votes.some(
      (vote) => vote.reviewerAddress === user?.wallet?.address
    );
  };

  // Reveal telegram handle
  const handleTelegramReveal = async (
    reportId: string,
    encryptedTelegram: string,
    actualTitle: string
  ) => {
    // If the modal isn't shown yet, show it first and return
    if (!showTelegramPrompt) {
      setShowTelegramPrompt(true);
      setTitleInput("");
      setTelegramError(null);
      return;
    }

    setIsDecrypting(true);
    setTelegramError(null);

    try {
      if (titleInput.trim().toLowerCase() !== actualTitle.toLowerCase()) {
        throw new Error(
          "Incorrect report title. Please enter the exact title as shown in the report."
        );
      }

      const decrypted = decrypt(encryptedTelegram, actualTitle);

      if (!decrypted) {
        throw new Error("Failed to decrypt telegram handle. Please try again.");
      }

      setDecryptedHandles((prev) => ({
        ...prev,
        [reportId]: decrypted,
      }));
      setShowTelegramPrompt(false);
      setTitleInput("");
      toast.success("Telegram handle revealed successfully");
    } catch (error) {
      console.error("Failed to decrypt telegram handle:", error);
      setTelegramError(
        error instanceof Error
          ? error.message
          : "Failed to decrypt telegram handle"
      );
    } finally {
      setIsDecrypting(false);
    }
  };

  // Hide telegram handle
  const handleTelegramHide = (reportId: string) => {
    setDecryptedHandles((prev) => {
      const newHandles = { ...prev };
      delete newHandles[reportId];
      return newHandles;
    });
    toast.success("Telegram handle hidden");
  };

  // To confirm base payment
  const handleBasePaymentConfirm = async () => {
    if (!selectedReport || !user?.wallet?.address) return;

    try {
      const response = await fetch(
        `/api/reports/${selectedReport._id}/payment/base`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewerAddress: user.wallet.address,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to confirm payment");
      fetchReports();
      toast.success("Base payment confirmed");
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Failed to confirm payment");
    }
  };

  // To confirm additional payment
  const handleAdditionalPaymentConfirm = async () => {
    if (!selectedReport || !user?.wallet?.address) return;

    try {
      const response = await fetch(
        `/api/reports/${selectedReport._id}/payment/additional`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewerAddress: user.wallet.address,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to confirm additional payment");
      fetchReports();
      toast.success("Additional payment confirmed");
    } catch (error) {
      console.error("Error confirming additional payment:", error);
      toast.error("Failed to confirm additional payment");
    }
  };

  // Function to handle manual refresh
  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      const reportsWithDetails = await fetchReportDetail();
      setReports(reportsWithDetails);
      setLastRefreshed(new Date());
      // toast.success("Reports refreshed successfully");
    } catch (error) {
      console.error("Error refreshing reports:", error);
      toast.error("Failed to refresh reports");
    } finally {
      setIsRefreshing(false);
    }
  };

  const sortOptions = [
    { value: 'date', label: 'Sort by Date' },
    { value: 'misuseRange', label: 'Sort by Misuse Amount' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 sm:pb-1 pb-0 font-secondary">
      <div className="flex justify-between items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-5xl font-primary font-medium tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] from-[17.3%] to-[168.94%] to-[#000000]">
          Reviewer Dashboard
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
                <span>Refreshing</span>
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
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Reports List */}
        <div
          className={`${selectedReport ? "lg:w-[40%]" : "w-full"} ${
            selectedReport ? "hidden lg:block" : "block"
          }`}
        >
          {/* Search and Filter Section */}
          <div className="space-y-4 mb-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Search reports by title..."
                />
              </div>
            </div>
            <div
              className={`flex gap-4 items-center ${
                selectedReport ? "flex-col" : "justify-between flex-col md:flex-row"
              }`}
            >
              <StatusFilter
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
              />
              <div className="flex gap-2 relative">
                <StyledDropdown
                  value={sortBy}
                  onChange={(value) => setSortBy(value as "date" | "misuseRange")}
                  options={sortOptions}
                />
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="bg-[#1A1B1E] text-white rounded-lg px-3 py-2 hover:border-[#4ECDC4] border border-gray-800 focus:outline-none transition-all duration-200"
                >
                  {sortOrder === "asc" ? (
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
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  ) : (
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-h-[54vh] overflow-y-auto scroll">
            {sortedReports.map((report) => (
              <button
                key={report._id?.toString()}
                onClick={() => handleReportSelection(report._id as string)}
                className={`w-[99%] p-4 rounded-lg text-left relative overflow-hidden group transition-all duration-300 ${
                  selectedReport?._id?.toString() === report._id?.toString()
                    ? "bg-[#4ECDC4]/10 border-[#4ECDC4] border"
                    : "border border-gray-800 hover:border-[#4ECDC4]"
                }`}
                style={{
                  background: "#020C1099",
                  backdropFilter: "blur(80px)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#4ECDC4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-2">
                        <h3
                          className={`text-lg font-light text-[#B0E9FF] ${
                            selectedReport
                              ? "overflow-hidden text-ellipsis whitespace-nowrap w-[160px]"
                              : ""
                          } `}
                        >
                          {report.title}
                        </h3>
                        <p className="text-sm text-gray-400 font-mono">
                          {report.submitterAddress.slice(0, 6)}...
                          {report.submitterAddress.slice(-4)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {report.hasUnreadAnswers && (
                          <span
                            className="animate-pulse w-3 h-3 bg-[#FF6B6B] rounded-full mt-[8px]"
                            title="New answers available"
                          ></span>
                        )}
                        {report.hasNewQuestions && (
                          <span
                            className="animate-pulse w-3 h-3 bg-[#4ECDC4] rounded-full mt-[8px]"
                            title="New questions from submitter"
                          ></span>
                        )}
                        {report.hasKycUpdate && (
                          <span
                            className="animate-pulse w-3 h-3 bg-yellow-500 rounded-full mt-[8px]"
                            title="KYC completed"
                          ></span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col sm:items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-md text-xs bg-purple-500/20 text-purple-400">
                          {report.misuseRange} ARB
                        </span>
                        <span
                          className={`px-2 py-1 rounded-md text-xs ${
                            report.status === "approved"
                              ? "bg-[#4ECDC4]/20 text-[#4ECDC4]"
                              : report.status === "rejected"
                              ? "bg-[#FF6B6B]/20 text-[#FF6B6B]"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {report.status.charAt(0).toUpperCase() +
                            report.status.slice(1)}
                        </span>
                        <BookmarkButton
                          isBookmarked={bookmarkedReports.has(
                            report._id as string
                          )}
                          onToggle={() =>
                            handleToggleBookmark(report._id as string)
                          }
                          size="sm"
                        />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-[#FFFAD1]">
                          {report.voteCount?.total || 0}/3 votes
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* <p className="text-sm text-gray-400 font-mono">
                    {report.submitterAddress.slice(0, 6)}...
                    {report.submitterAddress.slice(-4)}
                  </p> */}
                </div>
              </button>
            ))}
            {sortedReports.length === 0 && searchQuery && (
              <div className="text-center py-14">
                <p className="text-gray-400">
                  No reports found matching &quot;{searchQuery}&quot;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Back Button */}
        {selectedReport && (
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSelectedReport(null)}
              className="text-[#B0E9FF] hover:text-[#4ECDC4] flex items-center gap-2 transition-colors"
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
          <div className="flex-1">
            <div className="bg-[#1A1B1E] rounded-lg p-6">
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-[#B0E9FF] mb-2 tracking-wider">
                  {selectedReport.title}
                </h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="bg-[#1A1B1E] text-white rounded-lg p-2 text-sm hover:bg-[#2C2D31]"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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

              <div className="space-y-6">
                <TabView
                  tabs={[
                    {
                      id: "details",
                      label: "Report Details",
                      content: (
                        <ReportDetail
                          report={selectedReport}
                          isReviewer={true}
                          onBasePaymentConfirm={handleBasePaymentConfirm}
                          onAdditionalPaymentConfirm={
                            handleAdditionalPaymentConfirm
                          }
                          onTelegramReveal={(title) =>
                            handleTelegramReveal(
                              selectedReport._id as string,
                              selectedReport.telegramHandle,
                              title
                            )
                          }
                          decryptedHandle={
                            decryptedHandles[selectedReport._id as string]
                          }
                          onTelegramHide={() =>
                            handleTelegramHide(selectedReport._id as string)
                          }
                        />
                      ),
                    },
                    {
                      id: "qa",
                      label: "Chat",
                      content: (
                        <QuestionAnswer
                          reportId={selectedReport._id?.toString() || ""}
                          isReviewer={true}
                          onRefresh={handleRefresh}
                        />
                      ),
                    },
                    {
                      id: "votes",
                      label: "Vote Details",
                      content:
                        selectedReport.votes.length === 3 ? (
                          <VoteDetailsTab
                            report={selectedReport}
                            isReviewer={true}
                            currentUserAddress={user?.wallet?.address}
                            showVoteActions={false}
                          />
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-400 font-light">
                              Vote details will be available once all reviewers
                              have cast their votes.
                            </p>
                          </div>
                        ),
                    },
                    {
                      id: "cast-vote",
                      label: "Cast Your Vote",
                      content: (
                        <div className="space-y-6">
                          {isVoting ? (
                            <div className="flex flex-col items-center justify-center py-8">
                              <div className="w-12 h-12 border-4 border-t-[#4ECDC4] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
                              <p className="text-[#B0E9FF] text-lg">
                                Submitting your vote...
                              </p>
                            </div>
                          ) : !hasVoted(selectedReport) ? (
                            <>
                              <div className="space-y-4">
                                <h3 className="text-white font-semibold">
                                  Review Decision
                                </h3>
                                {voteError && (
                                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                                    <p className="text-red-400">{voteError}</p>
                                  </div>
                                )}
                                {!showSeverity ? (
                                  <div className="flex gap-4">
                                    <button
                                      onClick={() => {
                                        setVoteError(null);
                                        setShowSeverity(true);
                                      }}
                                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => {
                                        setVoteError(null);
                                        handleStatusUpdate("rejected");
                                      }}
                                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                      Deny
                                    </button>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    <h4 className="text-white">
                                      Select Severity
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                      <button
                                        onClick={() =>
                                          handleStatusUpdate("approved", "high")
                                        }
                                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                      >
                                        High
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleStatusUpdate(
                                            "approved",
                                            "medium"
                                          )
                                        }
                                        className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                                      >
                                        Medium
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleStatusUpdate("approved", "low")
                                        }
                                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                                      >
                                        Low
                                      </button>
                                      <button
                                        onClick={() => {
                                          setShowSeverity(false);
                                          setVoteError(null);
                                        }}
                                        className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <label className="block text-white">
                                    Review Comment
                                  </label>
                                  <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Enter your review comment..."
                                    className="w-full bg-[#1A1B1E] text-white rounded-lg px-4 py-2 border border-gray-800 focus:border-[#4ECDC4] focus:outline-none"
                                    rows={4}
                                  />
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-8">
                              <div className="mb-4">
                                <svg
                                  className="w-16 h-16 mx-auto text-[#4ECDC4]"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                              <p className="text-[#B0E9FF] text-lg font-light">
                                Your vote has been successfully cast for this
                                report.
                              </p>
                            </div>
                          )}
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Telegram Prompt Modal verify report title */}
      {showTelegramPrompt && selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div
            className="rounded-lg px-12 py-8 max-w-lg w-full relative overflow-hidden"
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
                  Verify Report Title
                </h3>
                <button
                  onClick={() => {
                    setShowTelegramPrompt(false);
                    setTitleInput("");
                    setTelegramError(null);
                  }}
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

              <div className="mb-6">
                <p className="text-gray-400 text-sm mb-4">
                  To reveal the submitter&apos;s Telegram handle, please enter
                  the exact report title for verification.
                </p>
                <div className="mb-4">
                  <p className="text-sm text-white mb-1 tracking-wide">
                    Current Report Title:
                  </p>
                  <p className="text-[#ffffff41] font-mono text-sm bg-[#1A1B1E] rounded-lg p-3 ">
                    {selectedReport.title}
                  </p>
                </div>
                {telegramError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                    <p className="text-red-400 text-sm">{telegramError}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#4ECDC4] tracking-wide mb-2 text-sm">
                    Enter Report Title:
                  </label>
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    placeholder="Enter the exact report title"
                    className="w-full bg-[#1A1B1E] text-white rounded-lg px-4 py-3 border border-gray-800 focus:border-[#4ECDC4] focus:outline-none text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-8">
                  <button
                    onClick={() => {
                      setShowTelegramPrompt(false);
                      setTitleInput("");
                      setTelegramError(null);
                    }}
                    className="px-4 py-2 text-white hover:text-[#4ECDC4] transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      handleTelegramReveal(
                        selectedReport._id?.toString() || "",
                        selectedReport.telegramHandle || "",
                        selectedReport.title || ""
                      )
                    }
                    disabled={isDecrypting || !titleInput.trim()}
                    className="px-4 py-2 rounded-lg relative overflow-hidden group border border-[#4ECDC4] disabled:cursor-not-allowed"
                    style={{
                      background: "#020C1099",
                      boxShadow: "0px 4px 50.5px 0px #96F1FF21 inset",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#4ECDC4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative text-[#B0E9FF] text-sm flex items-center gap-2">
                      {isDecrypting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-t-[#4ECDC4] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                          Verifying...
                        </>
                      ) : (
                        "Reveal Handle"
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewerDashboard;
