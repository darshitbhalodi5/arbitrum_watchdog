import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb';
import { ReportModel } from '@/models/Report';

// Export the POST method handler with correct naming
export const POST = async (
    request: Request,
    { params }: { params: Promise<{ reportId: string }> }
) => {
    try {
        await connect();
        const reportId = (await params).reportId;
        const { reviewerAddress } = await request.json();
        const report = await ReportModel.findById(reportId);
        
        if (!report) {
            return NextResponse.json(
                { error: 'Report not found' },
                { status: 404 }
            );
        }

        // Find the reviewer's vote and update basePaymentSent
        const voteIndex = report.votes.findIndex(
            vote => vote.reviewerAddress === reviewerAddress
        );

        if (voteIndex === -1) {
            return NextResponse.json(
                { error: 'Reviewer vote not found' },
                { status: 404 }
            );
        }

        // Update the basePaymentSent status
        report.votes[voteIndex].basePaymentSent = true;

        // Check if all reviewers have confirmed base payment
        const allBasePaymentsConfirmed = report.votes.every(vote => vote.basePaymentSent);
        if (allBasePaymentsConfirmed) {
            report.basePaymentStatus = 'completed';
        }

        await report.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating base payment status:', error);
        return NextResponse.json(
            { error: 'Failed to update base payment status' },
            { status: 500 }
        );
    }
} 