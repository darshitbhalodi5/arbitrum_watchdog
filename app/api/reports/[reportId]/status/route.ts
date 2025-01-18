import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb';
import { ReportModel } from '@/models/Report';
import { Vote } from '@/types/report';

// Helper function to calculate final status
function calculateFinalStatus(votes:Vote[]) {
    const requiredVotes = 3;

    if (votes.length < requiredVotes) {
        return 'pending';
    }

    const approvedVotes = votes.filter(v => v.vote === 'approved').length;
    const rejectedVotes = votes.filter(v => v.vote === 'rejected').length;

    return approvedVotes > rejectedVotes ? 'approved' : 'rejected';
}

export async function PUT(
    request: Request,
    { params }: {
        params: Promise<{ reportId: string }>
    }
) {
    try {
        await connect();
        const reportId = (await params).reportId;
        const { vote, severity, reviewerComment, reviewerAddress } = await request.json();

        const report = await ReportModel.findById(reportId);
        if (!report) {
            return NextResponse.json(
                { error: 'Report not found' },
                { status: 404 }
            );
        }

        if (!Array.isArray(report.votes)) {
            report.votes = [];
        }

        const existingVoteIndex = report.votes.findIndex(
            v => v.reviewerAddress === reviewerAddress
        );

        const newVote = {
            reviewerAddress,
            vote,
            ...(severity && { severity }),
            ...(reviewerComment && { reviewerComment })
        };

        if (existingVoteIndex !== -1) {
            report.votes[existingVoteIndex] = newVote;
        } else {
            report.votes.push(newVote);
        }

        // Calculate and update final status
        report.status = calculateFinalStatus(report.votes);

        // If approved, calculate majority severity
        if (report.status === 'approved') {
            const severityCounts = report.votes
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
                report.severity = sortedSeverities[0][0] as 'high' | 'medium' | 'low';
            }
        }

        const updatedReport = await report.save();
        return NextResponse.json(updatedReport);
    } catch (error) {
        console.error('Error updating report status:', error);
        return NextResponse.json(
            { error: 'Failed to update report status' },
            { status: 500 }
        );
    }
} 