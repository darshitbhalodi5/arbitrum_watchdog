'use client';

import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { decrypt } from '@/lib/encryption';

interface Report {
    _id: string;
    title: string;
    telegramHandle: string;
    submitterAddress: string;
    fileUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    severity?: 'high' | 'medium' | 'low';
    reviewerComment?: string;
    createdAt: string;
}

const ReviewerDashboard = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [showTelegram, setShowTelegram] = useState(false);
    const [comment, setComment] = useState('');
    const [showSeverity, setShowSeverity] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await fetch('/api/reports/all');
            if (!response.ok) throw new Error('Failed to fetch reports');
            const data = await response.json();

            // Decrypt telegram handles
            const decryptedReports = await Promise.all(
                data.map(async (report: Report) => ({
                    ...report,
                    telegramHandle: await decrypt(report.telegramHandle)
                }))
            );

            setReports(decryptedReports);
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Failed to fetch reports');
        }
    };

    const handleStatusUpdate = async (status: 'approved' | 'rejected', severity?: 'high' | 'medium' | 'low') => {
        if (!selectedReport) return;

        if (status === 'rejected' && !comment.trim()) {
            toast.error('Please provide a comment for rejection');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`/api/reports/${selectedReport._id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, severity, reviewerComment: comment }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            toast.success(`Report ${status} successfully`);
            setSelectedReport(null);
            setComment('');
            setShowSeverity(false);
            fetchReports();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-bold text-white mb-8">Reviewer Dashboard</h2>
            
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Reports List */}
                <div className={`${selectedReport ? 'lg:w-1/3' : 'w-full'}`}>
                    <div className="space-y-4">
                        {reports.map((report) => (
                            <button
                                key={report._id}
                                onClick={() => setSelectedReport(report)}
                                className={`w-full p-4 rounded-lg text-left ${
                                    selectedReport?._id === report._id
                                        ? 'bg-[#4ECDC4]/10 border-[#4ECDC4] border'
                                        : 'bg-[#2C2D31] border-gray-800 border hover:border-[#4ECDC4]'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        report.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                        report.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 font-mono">
                                    {report.submitterAddress.slice(0, 6)}...{report.submitterAddress.slice(-4)}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Report Detail */}
                {selectedReport && (
                    <div className="lg:w-2/3">
                        <div className="bg-[#2C2D31] rounded-lg p-6 border border-gray-800">
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
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">Telegram:</span>
                                    <div className="flex items-center gap-2">
                                        {showTelegram ? (
                                            <span className="text-[#4ECDC4]">{selectedReport.telegramHandle}</span>
                                        ) : (
                                            <span>••••••••</span>
                                        )}
                                        <button
                                            onClick={() => setShowTelegram(!showTelegram)}
                                            className="p-1 hover:bg-gray-700 rounded-full"
                                        >
                                            {showTelegram ? (
                                                <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <EyeIcon className="w-5 h-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>

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

                                <div className="flex flex-wrap gap-4 mt-6">
                                    {!showSeverity ? (
                                        <>
                                            <button
                                                onClick={() => setShowSeverity(true)}
                                                disabled={isSubmitting}
                                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate('rejected')}
                                                disabled={isSubmitting}
                                                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                                            >
                                                Deny
                                            </button>
                                        </>
                                    ) : (
                                        <div className="space-x-4">
                                            <button
                                                onClick={() => handleStatusUpdate('approved', 'high')}
                                                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            >
                                                High
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate('approved', 'medium')}
                                                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                            >
                                                Medium
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate('approved', 'low')}
                                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            >
                                                Low
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewerDashboard; 