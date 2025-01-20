'use client';

import { useEffect, useState } from 'react';
import { decrypt } from '@/lib/encryption';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import VoteDetails from '@/components/common/VoteDetails';
import ProgressBar from '@/components/common/ProgressBar';

interface Report {
    _id: string;
    title: string;
    telegramHandle: string;
    submitterAddress: string;
    fileUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    kycStatus: 'pending' | 'completed';
    basePaymentStatus: 'pending' | 'completed' | 'rejected';
    additionalPaymentStatus: 'pending' | 'completed' | 'rejected';
    votes: Array<{
        reviewerAddress: string;
        vote: 'approved' | 'rejected';
        severity?: 'high' | 'medium' | 'low';
        reviewerComment?: string;
        createdAt: string;
        _id: string;
        basePaymentSent?: boolean;
        additionalPaymentSent?: boolean;
    }>;
}

interface ReportHistoryProps {
    walletAddress: string;
}

const ReportHistory = ({ walletAddress }: ReportHistoryProps) => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [revealedHandles, setRevealedHandles] = useState<{ [key: string]: boolean }>({});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [titleInput, setTitleInput] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showTitleInput, setShowTitleInput] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [decryptedHandles, setDecryptedHandles] = useState<{[key: string]: string}>({});
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const fetchReports = async () => {
        try {
            const response = await fetch(`/api/reports?address=${walletAddress}`);
            if (!response.ok) throw new Error('Failed to fetch reports');
            const data = await response.json();
            console.log('Fetched reports:', data);
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (walletAddress) {
            fetchReports();
        }
    }, [walletAddress]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const toggleReveal = (reportId: string) => {
        setRevealedHandles(prev => ({
            ...prev,
            [reportId]: !prev[reportId]
        }));
    };

    const handleFileView = async (reportId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent report card click
        try {
            const response = await fetch(`/api/reports/${reportId}/file`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/octet-stream',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link and click it
            const link = document.createElement('a');
            link.href = url;
            link.download = 'report-file';
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);

            toast.success('File download started');
        } catch (error) {
            console.error('Error downloading file:', error);
            toast.error('Failed to download file');
        }
    };

    const handleTelegramToggle = (reportId: string, encryptedTelegram: string, title: string) => {
        if (decryptedHandles[reportId]) {
            // If already revealed, hide it
            setDecryptedHandles(prev => {
                const newHandles = { ...prev };
                delete newHandles[reportId];
                return newHandles;
            });
        } else {
            // If hidden, reveal it
            try {
                const decrypted = decrypt(encryptedTelegram, title);
                setDecryptedHandles(prev => ({
                    ...prev,
                    [reportId]: decrypted
                }));
            } catch (error) {
                console.error('Failed to decrypt telegram handle:', error);
                toast.error('Failed to decrypt telegram handle');
            }
        }
    };

    const handleReportClick = (report: Report) => {
        setSelectedReport(report === selectedReport ? null : report);
    };

    if (loading) {
        return <div className="text-gray-400">Loading reports...</div>;
    }

    if (reports.length === 0) {
        return <div className="text-gray-400">No reports submitted yet.</div>;
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            {reports.map((report) => (
                <div
                    key={report._id}
                    className="bg-[#2C2D31] rounded-lg p-4 sm:p-6 shadow-lg border border-gray-800 cursor-pointer hover:border-[#4ECDC4] transition-colors"
                    onClick={() => handleReportClick(report)}
                >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-4">
                        <h4 className="text-base sm:text-lg font-semibold text-white">{report.title}</h4>
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                                report.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                report.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                'bg-yellow-500/20 text-yellow-400'
                            }`}>
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                            {report.votes.length > 0 && (
                                <span className="text-xs text-gray-400">
                                    ({report.votes.length}/3 votes)
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
                        <div className="flex flex-wrap items-center gap-2">
                            <span>Telegram:</span>
                            <div className="flex items-center gap-2">
                                {decryptedHandles[report._id] ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#4ECDC4]">{decryptedHandles[report._id]}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTelegramToggle(report._id, report.telegramHandle, report.title);
                                            }}
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTelegramToggle(report._id, report.telegramHandle, report.title);
                                            }}
                                            className="p-1 hover:bg-gray-700 rounded-full"
                                            title="Show telegram handle"
                                        >
                                            <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <p>Submitted: {new Date(report.createdAt).toLocaleDateString()}</p>
                        <button
                            onClick={(e) => handleFileView(report._id, e)}
                            className="text-[#4ECDC4] hover:underline focus:outline-none inline-flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Submitted File
                        </button>
                        {report.status === 'approved' && (
                            <div className="mt-4 sm:mt-6">
                                <ProgressBar
                                    report={report}
                                    onKycVerify={async () => {
                                        try {
                                            const response = await fetch(`/api/reports/${report._id}/kyc`, {
                                                method: 'POST'
                                            });
                                            if (!response.ok) throw new Error('Failed to verify KYC');
                                            
                                            // Refresh reports after KYC verification
                                            fetchReports();
                                            toast.success('KYC verification completed');
                                        } catch (error) {
                                            console.error('Error verifying KYC:', error);
                                            toast.error('Failed to verify KYC');
                                        }
                                    }}
                                    isSubmitter={true}
                                />
                            </div>
                        )}
                    </div>

                    {/* Vote Details Section */}
                    {selectedReport?._id === report._id && report.votes?.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <VoteDetails 
                                votes={report.votes
                                    .filter(vote => vote && vote.reviewerAddress)
                                    .map(vote => ({
                                        _id: vote._id,
                                        reviewerAddress: vote.reviewerAddress,
                                        vote: vote.vote === 'approved' ? 'approved' : 'rejected',
                                        severity: vote.severity as 'high' | 'medium' | 'low' | undefined,
                                        reviewerComment: vote.reviewerComment,
                                        createdAt: vote.createdAt
                                    }))}
                                showAll={true}
                            />
                        </div>
                    )}

                    {/* Show expand button if there are any votes */}
                    {report.votes?.length > 0 && (
                        <div className="mt-4 text-center">
                            <button 
                                className="text-gray-400 hover:text-white transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleReportClick(report);
                                }}
                            >
                                {selectedReport?._id === report._id ? (
                                    <span className="text-sm">Show less ▲</span>
                                ) : (
                                    <span className="text-sm">Show details ▼</span>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReportHistory; 