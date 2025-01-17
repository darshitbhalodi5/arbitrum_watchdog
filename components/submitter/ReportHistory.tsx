'use client';

import { useEffect, useState } from 'react';
import { decrypt } from '@/lib/encryption';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface Report {
    _id: string;
    title: string;
    telegramHandle: string;
    submitterAddress: string;
    fileUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

interface ReportHistoryProps {
    walletAddress: string;
}

const ReportHistory = ({ walletAddress }: ReportHistoryProps) => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [revealedHandles, setRevealedHandles] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch(`/api/reports?address=${walletAddress}`);
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
            } finally {
                setLoading(false);
            }
        };

        if (walletAddress) {
            fetchReports();
        }
    }, [walletAddress]);

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
                    className="bg-[#2C2D31] rounded-lg p-4 sm:p-6 shadow-lg border border-gray-800"
                >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-4">
                        <h4 className="text-lg sm:text-xl font-semibold text-white">{report.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs sm:text-sm w-fit ${
                            report.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            report.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                        }`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                    </div>
                    <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
                        <div className="flex flex-wrap items-center gap-2">
                            <span>Telegram:</span>
                            <div className="flex items-center gap-2">
                                {revealedHandles[report._id] ? (
                                    <span className="text-[#4ECDC4]">{report.telegramHandle}</span>
                                ) : (
                                    <span>••••••••</span>
                                )}
                                <button
                                    onClick={() => toggleReveal(report._id)}
                                    className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    {revealedHandles[report._id] ? (
                                        <EyeSlashIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                    )}
                                </button>
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
                </div>
            ))}
        </div>
    );
};

export default ReportHistory; 