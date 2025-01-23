import { VoteDetailsProps } from "@/types/vote"
import { useEffect, useState } from "react";

interface VoteCount {
    approved: number;
    rejected: number;
    total: number;
}

const VoteDetails = ({ votes, report, showAll, currentUserAddress }: VoteDetailsProps) => {
    const votesToDisplay = report?.votes || votes || [];
    const [voteCount, setVoteCount] = useState<VoteCount>({
        approved: 0,
        rejected: 0,
        total: 0
    });

    useEffect(() => {
        // Calculate vote counts
        const counts = votesToDisplay.reduce((acc, vote) => {
            if (vote.vote === 'approved') {
                acc.approved += 1;
            } else if (vote.vote === 'rejected') {
                acc.rejected += 1;
            }
            acc.total += 1;
            return acc;
        }, { approved: 0, rejected: 0, total: 0 });

        setVoteCount(counts);
    }, [votesToDisplay]);

    // Filter votes if not showing all and currentUserAddress is provided
    const filteredVotes = showAll 
        ? votesToDisplay 
        : currentUserAddress 
            ? votesToDisplay.filter(vote => vote.reviewerAddress === currentUserAddress)
            : votesToDisplay;

    if (votesToDisplay.length === 0) {
        return (
            <div className="mt-4 p-4 rounded-lg bg-[#1A1B1E] border border-gray-800">
                <p className="text-gray-400 text-center">No votes have been submitted yet.</p>
            </div>
        );
    }

    if (filteredVotes.length === 0) return null;

    return (
        <div className="mt-4 space-y-3">
            {/* Vote Summary */}
            <div className="bg-[#1A1B1E] rounded-lg p-4 border border-gray-800">
                <h4 className="text-white font-semibold text-sm sm:text-base mb-3">Vote Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-400">Total Votes</p>
                        <p className="text-xl font-semibold text-white">{voteCount.total}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-400">Approved</p>
                        <p className="text-xl font-semibold text-green-400">{voteCount.approved}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-400">Rejected</p>
                        <p className="text-xl font-semibold text-red-400">{voteCount.rejected}</p>
                    </div>
                </div>
            </div>

            {/* Vote List */}
            <h4 className="text-white font-semibold text-sm sm:text-base">
                {showAll ? 'All Votes' : 'Your Vote'}
            </h4>
            <div className="space-y-3 sm:space-y-4">
                {filteredVotes.map((vote, index) => (
                    <div 
                        key={index} 
                        className="bg-[#1A1B1E] rounded-lg p-3 sm:p-4 border border-gray-800"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0">
                            <span className="text-gray-400 font-mono text-xs sm:text-sm">
                                {vote.reviewerAddress?.slice(0, 6)}...{vote.reviewerAddress?.slice(-4)}
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    vote.vote === 'approved' 
                                        ? 'bg-green-500/20 text-green-400' 
                                        : 'bg-red-500/20 text-red-400'
                                }`}>
                                    {vote.vote?.charAt(0).toUpperCase() + vote.vote?.slice(1)}
                                </span>
                                {vote.severity && (
                                    <span className="text-gray-400 text-xs">
                                        Severity: {vote.severity}
                                    </span>
                                )}
                            </div>
                        </div>
                        {vote.reviewerComment && (
                            <p className="text-gray-300 text-xs sm:text-sm mt-2 break-words">
                                {vote.reviewerComment}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VoteDetails; 