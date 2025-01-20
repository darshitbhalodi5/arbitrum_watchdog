// import { Vote } from "@/types/report";
import { IReport } from "@/models/Report";

interface Vote {
    _id: string;
    reviewerAddress: string;
    vote: 'approved' | 'rejected';
    severity?: 'high' | 'medium' | 'low';
    reviewerComment?: string;
    createdAt: string;
}

interface VoteDetailsProps {
    votes?: Vote[];
    report?: IReport;
    showAll?: boolean;
    currentUserAddress?: string;
}

const VoteDetails = ({ votes, report, showAll, currentUserAddress }: VoteDetailsProps) => {
    const votesToDisplay = report?.votes || votes || [];

    if (votesToDisplay.length === 0) {
        return null;
    }

    // Filter votes if not showing all and currentUserAddress is provided
    const filteredVotes = showAll 
        ? votesToDisplay 
        : currentUserAddress 
            ? votesToDisplay.filter(vote => vote.reviewerAddress === currentUserAddress)
            : votesToDisplay;

    if (filteredVotes.length === 0) return null;

    return (
        <div className="mt-4 space-y-3">
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