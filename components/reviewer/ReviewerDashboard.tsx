'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { decrypt } from '@/lib/encryption';
import { usePrivy } from '@privy-io/react-auth';
import VoteDetails from '@/components/common/VoteDetails';
import QuestionAnswer from '@/components/common/QuestionAnswer';
import { IReport } from '@/models/Report';

const ReviewerDashboard = () => {
    const { user } = usePrivy();
    const [reports, setReports] = useState<IReport[]>([]);
    const [selectedReport, setSelectedReport] = useState<IReport | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showTelegram, setShowTelegram] = useState(false);
    const [comment, setComment] = useState('');
    const [showSeverity, setShowSeverity] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [titleInput, setTitleInput] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showTitleInput, setShowTitleInput] = useState(false);
    const [decryptedHandles, setDecryptedHandles] = useState<{ [key: string]: string }>({});
    const [showTelegramPrompt, setShowTelegramPrompt] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await fetch('/api/reports/all');
            if (!response.ok) throw new Error('Failed to fetch reports');
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Failed to fetch reports');
        }
    };

    const handleStatusUpdate = async (vote: 'approved' | 'rejected', severity?: 'high' | 'medium' | 'low') => {
        if (!selectedReport || !user?.wallet?.address) return;

        if (vote === 'rejected' && !comment.trim()) {
            toast.error('Please provide a comment for rejection');
            return;
        }

        if (vote === 'approved' && !severity) {
            setShowSeverity(true);
            return;
        }

        setIsSubmitting(true);
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
            setSelectedReport(null);
            setComment('');
            setShowSeverity(false);
            fetchReports();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to submit vote');
        } finally {
            setIsSubmitting(false);
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

    const hasVoted = (report: IReport | null) => {
        if (!report || !user?.wallet?.address) return false;
        return report.votes.some(vote => vote.reviewerAddress === user?.wallet?.address);
    };

    const getUserVote = (report: IReport) => {
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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-8">Reviewer Dashboard</h2>

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
                {/* Reports List */}
                <div className={`${selectedReport ? 'lg:w-1/3' : 'w-full'} ${selectedReport ? 'hidden lg:block' : 'block'
                    }`}>
                    <div className="space-y-3 sm:space-y-4">
                        {reports.map((report) => (
                            <button
                                key={report._id?.toString()}
                                onClick={() => setSelectedReport(report)}
                                className={`w-full p-3 sm:p-4 rounded-lg text-left ${selectedReport?._id?.toString() === report._id?.toString()
                                        ? 'bg-[#4ECDC4]/10 border-[#4ECDC4] border'
                                        : 'bg-[#2C2D31] border-gray-800 border hover:border-[#4ECDC4]'
                                    }`}
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                    <h3 className="text-base sm:text-lg font-semibold text-white">{report.title}</h3>
                                    <div className="flex items-center sm:flex-col sm:items-end gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${report.status === 'approved' ? 'bg-green-500/20 text-green-400' :
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

                {/* Report Detail */}
                {selectedReport && (
                    <div className="lg:w-2/3">
                        <div className="bg-[#2C2D31] rounded-lg p-4 sm:p-6 border border-gray-800">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-xl font-bold text-white">{selectedReport.title}</h3>
                                <button
                                    onClick={() => {
                                        setSelectedReport(null);
                                        setShowTelegram(false);
                                        setComment('');
                                        setShowSeverity(false);
                                    }}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <span className="text-gray-400">Submitter:</span>
                                    <span className="ml-2 text-white font-mono">
                                        {selectedReport.submitterAddress}
                                    </span>
                                </div>

                                <div>
                                    <button
                                        onClick={() => handleFileView(selectedReport.fileUrl)}
                                        className="text-[#4ECDC4] hover:underline focus:outline-none inline-flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View Submitted File
                                    </button>
                                </div>

                                {/* Only show comment box if user hasn't voted */}
                                {!hasVoted(selectedReport) && (
                                    <div className="mt-6">
                                        <label className="block text-gray-400 mb-2">Review Comment</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full bg-[#1A1B1E] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#4ECDC4] outline-none"
                                            rows={4}
                                            placeholder="Enter your review comments here..."
                                        />
                                    </div>
                                )}

                                {/* Show vote status if user has voted */}
                                {hasVoted(selectedReport) && (
                                    <div className="text-gray-400">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span>Your vote:</span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${getUserVote(selectedReport)?.vote === 'approved'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {getUserVote(selectedReport)?.vote}
                                                </span>
                                                {getUserVote(selectedReport)?.severity && (
                                                    <span className="text-xs">
                                                        (Severity: {getUserVote(selectedReport)?.severity})
                                                    </span>
                                                )}
                                            </div>
                                            {getUserVote(selectedReport)?.reviewerComment && (
                                                <div className="bg-[#1A1B1E] p-3 rounded-lg mt-2">
                                                    <p className="text-sm text-gray-400 mb-1">Your Review:</p>
                                                    <p className="text-white text-sm">
                                                        {getUserVote(selectedReport)?.reviewerComment}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {selectedReport.votes.length < 3 && (
                                            <p className="mt-3 text-sm text-yellow-400">
                                                Waiting for other reviewers ({selectedReport.votes.length}/3 votes)
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Add KYC and Payment Status section */}
                                {selectedReport.votes.length === 3 && (
                                    <div className="mt-4 space-y-3 bg-[#1A1B1E] p-4 rounded-lg">
                                        <h4 className="text-white font-semibold mb-2">Payment Status</h4>

                                        {/* KYC Status */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">KYC Status:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${selectedReport.kycStatus === 'completed'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {selectedReport.kycStatus.charAt(0).toUpperCase() + selectedReport.kycStatus.slice(1)}
                                            </span>
                                        </div>

                                        {/* Base Payment Status */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">Base Payment:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${selectedReport.basePaymentStatus === 'completed'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : selectedReport.basePaymentStatus === 'rejected'
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {selectedReport.basePaymentStatus.charAt(0).toUpperCase() + selectedReport.basePaymentStatus.slice(1)}
                                            </span>
                                            {/* Show confirmed reviewers count for base payment */}
                                            <span className="text-xs text-gray-400">
                                                ({selectedReport.votes.filter(v => v.basePaymentSent).length}/3 confirmed)
                                            </span>
                                        </div>

                                        {/* Additional Payment Status - Only show if report is approved */}
                                        {selectedReport.status === 'approved' && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">Additional Payment:</span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${selectedReport.additionalPaymentStatus === 'completed'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : selectedReport.additionalPaymentStatus === 'rejected'
                                                            ? 'bg-red-500/20 text-red-400'
                                                            : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {selectedReport.additionalPaymentStatus.charAt(0).toUpperCase() +
                                                        selectedReport.additionalPaymentStatus.slice(1)}
                                                </span>
                                                {/* Show confirmed reviewers count for additional payment */}
                                                <span className="text-xs text-gray-400">
                                                    ({selectedReport.votes.filter(v => v.additionalPaymentSent).length}/3 confirmed)
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-4">
                                    {decryptedHandles[selectedReport._id as string] ? (
                                        <div className="bg-[#1A1B1E] p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-gray-400">Submitter&apos;s Telegram:</p>
                                                <button
                                                    onClick={() => handleTelegramHide(selectedReport._id as string)}
                                                    className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                                                    title="Hide telegram handle"
                                                >
                                                    <EyeSlashIcon className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                                                </button>
                                            </div>
                                            <p className="text-[#4ECDC4] font-mono">{decryptedHandles[selectedReport._id as string]}</p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setShowTelegramPrompt(true)}
                                            className="text-[#4ECDC4] hover:text-[#45b8b0] flex items-center gap-2 transition-colors"
                                        >
                                            Any Doubt? Click to connect
                                        </button>
                                    )}
                                    <div className="mt-6">
                                        <QuestionAnswer reportId={selectedReport._id?.toString() || ''} isReviewer={true} />
                                    </div>
                                </div>

                                <div className="mt-6 border-t border-gray-800 pt-6">
                                    {/* Only show votes if all reviewers have voted */}
                                    {selectedReport.votes.length === 3 && (
                                        <VoteDetails
                                            votes={selectedReport.votes}
                                            showAll={true}
                                            currentUserAddress={user?.wallet?.address}
                                        />
                                    )}

                                    {/* Show base payment button only after KYC is completed and user hasn't confirmed payment */}
                                    {selectedReport.kycStatus === 'completed' &&
                                        selectedReport.votes.length === 3 && // Only show after all votes are in
                                        !selectedReport.votes.find(v =>
                                            v.reviewerAddress === user?.wallet?.address && v.basePaymentSent
                                        ) && (
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const response = await fetch(`/api/reports/${selectedReport._id}/payment/base`, {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json'
                                                            },
                                                            body: JSON.stringify({
                                                                reviewerAddress: user?.wallet?.address
                                                            })
                                                        });
                                                        if (!response.ok) throw new Error('Failed to confirm payment');
                                                        fetchReports();
                                                        toast.success('Base payment confirmed');
                                                    } catch (error) {
                                                        console.error('Error confirming payment:', error);
                                                        toast.error('Failed to confirm payment');
                                                    }
                                                }}
                                                className="px-3 py-1 bg-[#4ECDC4] text-white rounded-lg hover:opacity-90 mt-4"
                                            >
                                                Confirm Base Payment
                                            </button>
                                        )}

                                    {!hasVoted(selectedReport) ? (
                                        <div className="flex flex-wrap gap-4">
                                            {!showSeverity ? (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate('approved')}
                                                        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                                        disabled={isSubmitting}
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate('rejected')}
                                                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                        disabled={isSubmitting}
                                                    >
                                                        Deny
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-full">
                                                        <p className="text-gray-400 mb-3">Select severity level:</p>
                                                        <div className="space-x-4">
                                                            <button
                                                                onClick={() => handleStatusUpdate('approved', 'high')}
                                                                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                                disabled={isSubmitting}
                                                            >
                                                                High
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate('approved', 'medium')}
                                                                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                                                disabled={isSubmitting}
                                                            >
                                                                Medium
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate('approved', 'low')}
                                                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                                                disabled={isSubmitting}
                                                            >
                                                                Low
                                                            </button>
                                                            <button
                                                                onClick={() => setShowSeverity(false)}
                                                                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                                                disabled={isSubmitting}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                            </div>
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

            {/* {selectedReport && (
                <div className="mt-6">
                    <VoteDetails
                        votes={selectedReport.votes}
                        showAll={true}
                        currentUserAddress={user?.wallet?.address}
                    />
                    <div className="mt-6">
                        <QuestionAnswer reportId={selectedReport._id?.toString() || ''} isReviewer={true} />
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default ReviewerDashboard; 