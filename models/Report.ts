import mongoose, { Document } from 'mongoose';

interface Vote {
    reviewerAddress: string;
    vote: 'approved' | 'rejected';
    severity?: 'high' | 'medium' | 'low';
    reviewerComment?: string;
}

interface IReport extends Document {
    title: string;
    telegramHandle: string;
    submitterAddress: string;
    fileUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    severity?: 'high' | 'medium' | 'low';
    votes: Vote[];
    calculateFinalStatus(): 'pending' | 'approved' | 'rejected';
}

export const voteSchema = new mongoose.Schema({
    reviewerAddress: {
        type: String,
        required: true,
    },
    vote: {
        type: String,
        enum: ['approved', 'rejected'],
        required: true,
    },
    severity: {
        type: String,
        enum: ['high', 'medium', 'low'],
    },
    reviewerComment: {
        type: String,
    }
}, { timestamps: true });

const reportSchema = new mongoose.Schema<IReport>({
    title: {
        type: String,
        required: true,
    },
    telegramHandle: {
        type: String,
        required: true,
    },
    submitterAddress: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    severity: {
        type: String,
        enum: ['high', 'medium', 'low'],
    },
    votes: {
        type: [voteSchema],
        default: [],
    }
}, {
    timestamps: true,
});

// Method to calculate final status based on votes
reportSchema.methods.calculateFinalStatus = function(this: IReport) {
    const requiredVotes = process.env.NEXT_PUBLIC_REVIEWER_ADDRESS_1 && 
        process.env.NEXT_PUBLIC_REVIEWER_ADDRESS_2 && 
        process.env.NEXT_PUBLIC_REVIEWER_ADDRESS_3 ? 3 : 0;

    if (this.votes.length < requiredVotes) {
        return 'pending';
    }

    const approvedVotes = this.votes.filter(v => v.vote === 'approved').length;
    const rejectedVotes = this.votes.filter(v => v.vote === 'rejected').length;

    if (approvedVotes > rejectedVotes) {
        // Calculate severity based on majority
        const severityCounts = this.votes
            .filter(v => v.vote === 'approved' && v.severity)
            .reduce((acc: { [key: string]: number }, vote) => {
                if (vote.severity) {
                    acc[vote.severity] = (acc[vote.severity] || 0) + 1;
                }
                return acc;
            }, {});

        const sortedSeverities = Object.entries(severityCounts)
            .sort((a, b) => b[1] - a[1]);

        if (sortedSeverities.length > 0) {
            this.severity = sortedSeverities[0][0] as 'high' | 'medium' | 'low';
        }
        return 'approved';
    }
    return 'rejected';
};

export const Report = mongoose.models.Report as mongoose.Model<IReport> || 
    mongoose.model<IReport>('Report', reportSchema);