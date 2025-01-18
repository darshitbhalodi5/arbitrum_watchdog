'use client';

import { useEffect, useState } from 'react';
import { decrypt } from '@/lib/encryption';
import { EyeIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import VoteDetails from '@/components/common/VoteDetails';

interface Report {
    _id: string;
    title: string;
    telegramHandle: string;
    submitterAddress: string;
    fileUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    votes: Array<{
        reviewerAddress: string;
        vote: 'approved' | 'rejected';
        severity?: 'high' | 'medium' | 'low';
        reviewerComment?: string;
        createdAt: string;
        _id: string;
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
    const [titleInput, setTitleInput] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showTitleInput, setShowTitleInput] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [decryptedHandles, setDecryptedHandles] = useState<{[key: string]: string}>({});
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch(`/api/reports?address=${walletAddress}`);
                if (!response.ok) throw new Error('Failed to fetch reports');
                const data = await response.json();
                console.log('Fetched reports:', data); // Debug log
                setReports(data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        };

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

    const handleFileView = async (fileId: string) => {
        try {
            const response = await fetch(`/api/reports/${fileId}`, {
                method: 'GET',
                headers: {
                    'Accept': '*/*',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const contentDisposition = response.headers.get('Content-Disposition');
            const filename = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || 'download';
            
            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link and click it
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('Error downloading file:', error);
            alert('Failed to download file. Please try again.');
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleTelegramReveal = async (reportId: string, encryptedTelegram: string, actualTitle: string) => {
        if (titleInput.trim() === actualTitle) {
            try {
                // Decrypt using the title as the key
                const decrypted = decrypt(encryptedTelegram, actualTitle);
                
                // Update the decrypted handles state
                setDecryptedHandles(prev => ({
                    ...prev,
                    [reportId]: decrypted
                }));
                setShowTitleInput(false);
                setTitleInput('');
            } catch (error) {
                console.error('Failed to decrypt telegram handle:', error);
                toast.error('Failed to decrypt telegram handle');
            }
        } else {
            toast.error('Incorrect title');
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
        <div className="space-y-4 sm:space-y-6">
            {reports.map((report) => (
                <div
                    key={report._id}
                    className="bg-[#2C2D31] rounded-lg p-4 sm:p-6 shadow-lg border border-gray-800 cursor-pointer hover:border-[#4ECDC4] transition-colors"
                    onClick={() => handleReportClick(report)}
                >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-4">
                        <h4 className="text-lg sm:text-xl font-semibold text-white">{report.title}</h4>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
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

                    {/* Basic Info */}
                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
                        <div className="flex flex-wrap items-center gap-2">
                            <span>Telegram:</span>
                            <div className="flex items-center gap-2">
                                {decryptedHandles[report._id] ? (
                                    <span className="text-[#4ECDC4]">{decryptedHandles[report._id]}</span>
                                ) : showTitleInput ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={titleInput}
                                            onChange={(e) => setTitleInput(e.target.value)}
                                            placeholder="Enter report title to reveal"
                                            className="bg-[#1A1B1E] text-white rounded px-2 py-1"
                                        />
                                        <button
                                            onClick={() => handleTelegramReveal(
                                                report._id,
                                                report.telegramHandle,
                                                report.title
                                            )}
                                            className="text-[#4ECDC4] hover:text-[#45b8b0]"
                                        >
                                            Verify
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowTitleInput(false);
                                                setTitleInput('');
                                            }}
                                            className="text-gray-400 hover:text-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span>••••••••</span>
                                        <button
                                            onClick={() => setShowTitleInput(true)}
                                            className="p-1 hover:bg-gray-700 rounded-full"
                                        >
                                            <EyeIcon className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <p>Submitted: {new Date(report.createdAt).toLocaleDateString()}</p>
                        <button
                            onClick={() => handleFileView(report.fileUrl)}
                            className="text-[#4ECDC4] hover:underline focus:outline-none inline-flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Submitted File
                        </button>
                    </div>

                    {/* Vote Details Section - Show when report is selected and has votes */}
                    {selectedReport?._id === report._id && report.votes?.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <VoteDetails 
                                votes={report.votes
                                    .filter(vote => vote && vote.reviewerAddress)
                                    .map(vote => ({
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