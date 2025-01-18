import { Vote } from "@/types/report";

interface VoteDetailsProps {
    votes: Vote[];
    showAll: boolean;
    currentUserAddress?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VoteDetails = ({ votes, showAll, currentUserAddress }: VoteDetailsProps) => {
    console.log('VoteDetails received votes:', votes); // Debug log

    if (!votes || votes.length === 0) {
        console.log('No votes to display'); // Debug log
        return null;
    }

    // Only show votes if showAll is true or if it's the current user's vote
    const votesToShow = showAll 
        ? votes 
        : votes.filter(vote => vote.reviewerAddress === currentUserAddress);

    if (votesToShow.length === 0) return null;

    return (
        <div className="mt-4 space-y-3">
            <h4 className="text-white font-semibold text-sm sm:text-base">
                {showAll ? 'All Votes' : 'Your Vote'}
            </h4>
            <div className="space-y-3 sm:space-y-4">
                {votesToShow.map((vote, index) => (
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