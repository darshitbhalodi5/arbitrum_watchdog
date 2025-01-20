'use client';

import { useState } from 'react';
import SubmitReportModal from './SubmitReportModal';
import ReportHistory from './ReportHistory';
import { usePrivy } from '@privy-io/react-auth';

const SubmitterDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = usePrivy();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleReportSubmitted = () => {
        setRefreshTrigger(prev => prev + 1);
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="mb-8 sm:mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                        Submitter Dashboard
                    </h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-[#FF6B6B]/20"
                    >
                        Submit New Report
                    </button>
                </div>
            </div>

            <SubmitReportModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleReportSubmitted}
                walletAddress={user?.wallet?.address || ''}
            />

            <div className="mt-8 sm:mt-12">
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6">
                    Your Report History
                </h3>
                <ReportHistory 
                    walletAddress={user?.wallet?.address || ''} 
                    key={refreshTrigger}
                />
            </div>
        </div>
    );
};

export default SubmitterDashboard; 