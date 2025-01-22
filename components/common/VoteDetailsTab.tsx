import { IReport } from "@/models/Report";
import { Vote } from "@/types/vote";

interface VoteDetailsTabProps {
    report: IReport;
    isReviewer: boolean;
    currentUserAddress?: string;
    onVoteSubmit?: (vote: 'approved' | 'rejected', severity?: 'high' | 'medium' | 'low') => Promise<void>;
    showVoteActions?: boolean;
}

const VoteDetailsTab = ({ report, isReviewer, currentUserAddress, onVoteSubmit, showVoteActions = true }: VoteDetailsTabProps) => {
    const hasVoted = (report: IReport) => {
        if (!currentUserAddress) return false;
        return report.votes.some(vote => vote.reviewerAddress === currentUserAddress);
    };

    return (
        <div className="space-y-6">
            {/* Vote Summary */}
            <div className="bg-[#1A1B1E] rounded-lg p-4">
                <h3 className="text-white font-semibold mb-4">Vote Summary</h3>
                <div className="space-y-4">
                    {report.votes.map((vote: Vote, index: number) => (
                        <div
                            key={vote._id}
                            className={`p-4 rounded-lg ${
                                vote.reviewerAddress === currentUserAddress
                                    ? 'bg-[#4ECDC4]/10 border border-[#4ECDC4]/20'
                                    : 'bg-[#2C2D31]'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400">Reviewer {index + 1}:</span>
                                    <span className="text-white font-mono text-sm">
                                        {vote.reviewerAddress.slice(0, 6)}...{vote.reviewerAddress.slice(-4)}
                                    </span>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                        vote.vote === 'approved'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                    }`}
                                >
                                    {vote.vote.charAt(0).toUpperCase() + vote.vote.slice(1)}
                                </span>
                            </div>
                            {vote.severity && (
                                <div className="text-sm text-gray-400 mb-2">
                                    Severity: {vote.severity.charAt(0).toUpperCase() + vote.severity.slice(1)}
                                </div>
                            )}
                            {vote.reviewerComment && (
                                <div className="text-sm text-gray-300">
                                    Comment: {vote.reviewerComment}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Vote Actions - Only show for reviewers who haven't voted */}
            {showVoteActions && isReviewer && !hasVoted(report) && onVoteSubmit && (
                <div className="mt-6">
                    <h3 className="text-white font-semibold mb-4">Cast Your Vote</h3>
                    <div className="flex gap-4">
                        <button
                            onClick={() => onVoteSubmit('approved')}
                            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => onVoteSubmit('rejected')}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Deny
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoteDetailsTab; 