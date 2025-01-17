import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb';
import { Report } from '@/models/Report';

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

        // Get the report and ensure votes array exists
        const report = await Report.findById(reportId);
        if (!report) {
            return NextResponse.json(
                { error: 'Report not found' },
                { status: 404 }
            );
        }

        // Initialize votes array if it doesn't exist
        if (!Array.isArray(report.votes)) {
            report.votes = [];
        }

        // Check if reviewer has already voted
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
            // Update existing vote
            report.votes[existingVoteIndex] = newVote;
        } else {
            // Add new vote
            report.votes.push(newVote);
        }

        // Calculate and update final status
        const newStatus = report.calculateFinalStatus();
        if (newStatus !== report.status) {
            report.status = newStatus;
        }

        // Save the updated report
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