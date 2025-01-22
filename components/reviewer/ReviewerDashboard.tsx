'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import toast from 'react-hot-toast';
import { decrypt } from '@/lib/encryption';
import { IReport } from '@/models/Report';
import TabView from '../common/TabView';
import ReportDetail from '../common/ReportDetail';
import VoteDetailsTab from '../common/VoteDetailsTab';
import QuestionAnswer from '../common/QuestionAnswer';

interface Question {
    _id: string;
    question: string;
    answer: string | null;
    askedBy: string;
    answeredBy: string | null;
    status: 'pending' | 'answered';
    createdAt: string;
    isRead?: boolean;
    isSubmitterQuestion?: boolean;
    notifiedReviewers?: string[];
}

interface IReportWithQuestions extends IReport {
    hasUnreadAnswers?: boolean;
    hasNewQuestions?: boolean;
    hasKycUpdate?: boolean;
}

const ReviewerDashboard = () => {
    const { user } = usePrivy();
    const [reports, setReports] = useState<IReportWithQuestions[]>([]);
    const [selectedReport, setSelectedReport] = useState<IReportWithQuestions | null>(null);
    const [comment, setComment] = useState('');
    const [titleInput, setTitleInput] = useState('');
    const [showTelegramPrompt, setShowTelegramPrompt] = useState(false);
    const [decryptedHandles, setDecryptedHandles] = useState<{ [key: string]: string }>({});
    const [showSeverity, setShowSeverity] = useState(false);

    const fetchReports = useCallback(async () => {
        try {
            const response = await fetch('/api/reports/all');
            if (!response.ok) throw new Error('Failed to fetch reports');
            const data = await response.json();

            // Check for unread answers and new questions for each report
            const reportsWithNotifications = await Promise.all(data.map(async (report: IReport) => {
                const questionsResponse = await fetch(
                    `/api/questions?reportId=${report._id}&userAddress=${user?.wallet?.address}&isReviewer=true`
                );
                const questions = await questionsResponse.json();
                
                return {
                    ...report,
                    hasUnreadAnswers: questions.some((q: Question) => q.answer && !q.isRead),
                    hasNewQuestions: questions.some((q: Question) => 
                        q.isSubmitterQuestion && 
                        !q.answer && 
                        !(q.notifiedReviewers || []).includes(user?.wallet?.address || '')
                    ),
                    hasKycUpdate: report.kycStatus === 'completed' && report.status === 'pending'
                };
            }));
            
            setReports(reportsWithNotifications);
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Failed to fetch reports');
        }
    },[user?.wallet?.address]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleStatusUpdate = async (vote: 'approved' | 'rejected', severity?: 'high' | 'medium' | 'low') => {
        if (!selectedReport || !user?.wallet?.address) return;

        if (vote === 'rejected' && !comment.trim()) {
            toast.error('Please provide a comment for rejection');
            return;
        }

        try {
            const response = await fetch(`/api/reports/${selectedReport._id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vote,
                    severity,
                    reviewerComment: comment,
                    reviewerAddress: user.wallet.address
                }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            toast.success('Vote submitted successfully');
            setComment('');
            fetchReports();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to submit vote');
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleFileView = async (fileId: string) => {
        try {
            const response = await fetch(`/api/reports/${selectedReport?._id}/file`);
            if (!response.ok) throw new Error('Failed to fetch file');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error viewing file:', error);
            toast.error('Failed to view file');
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hasVoted = (report: IReportWithQuestions | null) => {
        if (!report || !user?.wallet?.address) return false;
        return report.votes.some(vote => vote.reviewerAddress === user?.wallet?.address);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getUserVote = (report: IReportWithQuestions) => {
        return report.votes?.find(vote =>
            vote.reviewerAddress === user?.wallet?.address
        );
    };

    const handleTelegramReveal = async (reportId: string, encryptedTelegram: string, actualTitle: string) => {
        if (titleInput.trim() === actualTitle) {
            try {
                const decrypted = decrypt(encryptedTelegram, actualTitle);
                setDecryptedHandles(prev => ({
                    ...prev,
                    [reportId]: decrypted
                }));
                setShowTelegramPrompt(false);
                setTitleInput('');
                toast.success('Telegram handle revealed');
            } catch (error) {
                console.error('Failed to decrypt telegram handle:', error);
                toast.error('Failed to decrypt telegram handle');
            }
        } else {
            toast.error('Incorrect title');
        }
    };

    const handleTelegramHide = (reportId: string) => {
        setDecryptedHandles(prev => {
            const newHandles = { ...prev };
            delete newHandles[reportId];
            return newHandles;
        });
    };

    const handleBasePaymentConfirm = async () => {
        if (!selectedReport || !user?.wallet?.address) return;

        try {
            const response = await fetch(`/api/reports/${selectedReport._id}/payment/base`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reviewerAddress: user.wallet.address
                })
            });
            if (!response.ok) throw new Error('Failed to confirm payment');
            fetchReports();
            toast.success('Base payment confirmed');
        } catch (error) {
            console.error('Error confirming payment:', error);
            toast.error('Failed to confirm payment');
        }
    };

    const handleAdditionalPaymentConfirm = async () => {
        if (!selectedReport || !user?.wallet?.address) return;

        try {
            const response = await fetch(`/api/reports/${selectedReport._id}/payment/additional`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reviewerAddress: user.wallet.address
                })
            });
            if (!response.ok) throw new Error('Failed to confirm additional payment');
            fetchReports();
            toast.success('Additional payment confirmed');
        } catch (error) {
            console.error('Error confirming additional payment:', error);
            toast.error('Failed to confirm additional payment');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-8">Reviewer Dashboard</h2>

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
                {/* Reports List */}
                <div className={`${selectedReport ? 'lg:w-1/3' : 'w-full'} ${selectedReport ? 'hidden lg:block' : 'block'}`}>
                    <div className="space-y-3 sm:space-y-4">
                        {reports.map((report) => (
                            <button
                                key={report._id?.toString()}
                                onClick={() => setSelectedReport(report)}
                                className={`w-full p-3 sm:p-4 rounded-lg text-left ${
                                    selectedReport?._id?.toString() === report._id?.toString()
                                    ? 'bg-[#4ECDC4]/10 border-[#4ECDC4] border'
                                    : 'bg-[#2C2D31] border-gray-800 border hover:border-[#4ECDC4]'
                                }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                    <div className="flex items-start gap-2">
                                        <h3 className="text-base sm:text-lg font-semibold text-white">{report.title}</h3>
                                        <div className="flex gap-1">
                                            {report.hasUnreadAnswers && (
                                                <span className="animate-pulse w-2 h-2 bg-[#FF6B6B] rounded-full mt-2" title="New answers available"></span>
                                            )}
                                            {report.hasNewQuestions && (
                                                <span className="animate-pulse w-2 h-2 bg-[#4ECDC4] rounded-full mt-2" title="New questions from submitter"></span>
                                            )}
                                            {report.hasKycUpdate && (
                                                <span className="animate-pulse w-2 h-2 bg-yellow-500 rounded-full mt-2" title="KYC completed"></span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center sm:flex-col sm:items-end gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            report.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                            report.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {report.votes?.length || 0}/3 votes
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-400 font-mono">
                                    {report.submitterAddress.slice(0, 6)}...{report.submitterAddress.slice(-4)}
                                </p>
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
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
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
                                <h3 className="text-xl font-bold text-white">{selectedReport.title}</h3>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <TabView
                                tabs={[
                                    {
                                        id: 'details',
                                        label: 'Report Details',
                                        content: (
                                            <ReportDetail
                                                report={selectedReport}
                                                isReviewer={true}
                                                onBasePaymentConfirm={handleBasePaymentConfirm}
                                                onAdditionalPaymentConfirm={handleAdditionalPaymentConfirm}
                                                onTelegramReveal={(title) => handleTelegramReveal(
                                                    selectedReport._id as string,
                                                    selectedReport.telegramHandle,
                                                    title
                                                )}
                                                decryptedHandle={decryptedHandles[selectedReport._id as string]}
                                                onTelegramHide={() => handleTelegramHide(selectedReport._id as string)}
                                            />
                                        )
                                    },
                                    {
                                        id: 'qa',
                                        label: 'Questions & Answers',
                                        content: (
                                            <QuestionAnswer
                                                reportId={selectedReport._id?.toString() || ''}
                                                isReviewer={true}
                                            />
                                        )
                                    },
                                    {
                                        id: 'votes',
                                        label: 'Vote Details',
                                        content: (
                                            <VoteDetailsTab
                                                report={selectedReport}
                                                isReviewer={true}
                                                currentUserAddress={user?.wallet?.address}
                                                showVoteActions={false}
                                            />
                                        )
                                    },
                                    {
                                        id: 'cast-vote',
                                        label: 'Cast Your Vote',
                                        content: (
                                            <div className="space-y-6">
                                                {!hasVoted(selectedReport) ? (
                                                    <>
                                                        <div className="space-y-4">
                                                            <h3 className="text-white font-semibold">Review Decision</h3>
                                                            {!showSeverity ? (
                                                                <div className="flex gap-4">
                                                                    <button
                                                                        onClick={() => setShowSeverity(true)}
                                                                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                                                    >
                                                                        Accept
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate('rejected')}
                                                                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                                    >
                                                                        Deny
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-4">
                                                                    <h4 className="text-white">Select Severity</h4>
                                                                    <div className="flex flex-wrap gap-3">
                                                                        <button
                                                                            onClick={() => {
                                                                                handleStatusUpdate('approved', 'high');
                                                                                setShowSeverity(false);
                                                                            }}
                                                                            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                                                        >
                                                                            High
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                handleStatusUpdate('approved', 'medium');
                                                                                setShowSeverity(false);
                                                                            }}
                                                                            className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                                                                        >
                                                                            Medium
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                handleStatusUpdate('approved', 'low');
                                                                                setShowSeverity(false);
                                                                            }}
                                                                            className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                                                                        >
                                                                            Low
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setShowSeverity(false)}
                                                                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            
                                                            <div className="space-y-2">
                                                                <label className="block text-white">Review Comment</label>
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
                                                    <div className="text-center text-gray-400">
                                                        You have already cast your vote for this report.
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    }
                                ]}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Telegram Prompt Modal */}
            {showTelegramPrompt && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#2C2D31] rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-white font-semibold mb-4">Enter Report Title to Connect</h3>
                        <input
                            type="text"
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            placeholder="Enter the report title"
                            className="w-full bg-[#1A1B1E] text-white rounded-lg px-4 py-2 mb-4"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowTelegramPrompt(false);
                                    setTitleInput('');
                                }}
                                className="px-4 py-2 text-gray-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleTelegramReveal(
                                    selectedReport?._id?.toString() || "",
                                    selectedReport?.telegramHandle || "",
                                    selectedReport?.title || ""
                                )}
                                className="px-4 py-2 bg-[#4ECDC4] text-white rounded-lg hover:opacity-90"
                            >
                                Verify
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewerDashboard; 