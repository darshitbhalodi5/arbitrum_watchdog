import { IReport } from "@/models/Report";
// import { Vote } from "@/types/vote";

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
            {report.votes.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-[#ffffff] font-light">No votes have been cast yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {report.votes.map((vote, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-lg relative overflow-hidden"
                            style={{
                                background: "#020C1099",
                                border: "1px solid",
                                backdropFilter: "blur(80px)",
                                boxShadow: "0px 4px 50.5px 0px #96F1FF21 inset",
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-[#4ECDC4]/5 to-transparent opacity-30" />
                            <div className="relative space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-400 font-mono mb-1">
                                            {vote.reviewerAddress.slice(0, 6)}...{vote.reviewerAddress.slice(-4)}
                                            {currentUserAddress === vote.reviewerAddress && " (Your Vote)"}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs ${
                                                vote.vote === 'approved' ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' :
                                                'bg-[#FF6B6B]/20 text-[#FF6B6B]'
                                            }`}>
                                                {vote.vote.charAt(0).toUpperCase() + vote.vote.slice(1)}
                                            </span>
                                            {vote.severity && (
                                                <span className={`px-3 py-1 rounded-full text-xs ${
                                                    vote.severity === 'high' ? 'bg-[#FF6B6B]/20 text-[#FF6B6B]' :
                                                    vote.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-[#4ECDC4]/20 text-[#4ECDC4]'
                                                }`}>
                                                    {vote.severity.charAt(0).toUpperCase() + vote.severity.slice(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {vote.reviewerComment && (
                                    <p className="text-[#B0E9FF] font-light text-sm">{vote.reviewerComment}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

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