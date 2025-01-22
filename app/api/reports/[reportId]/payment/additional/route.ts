import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb';
import { ReportModel } from '@/models/Report';

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

        // Only allow additional payment confirmation if base payment is completed
        if (report.basePaymentStatus !== 'completed') {
            return NextResponse.json(
                { error: 'Base payment must be completed first' },
                { status: 400 }
            );
        }

        // Find the reviewer's vote and update additionalPaymentSent
        const voteIndex = report.votes.findIndex(
            vote => vote.reviewerAddress === reviewerAddress
        );

        if (voteIndex === -1) {
            return NextResponse.json(
                { error: 'Reviewer vote not found' },
                { status: 404 }
            );
        }

        // Update the additionalPaymentSent status
        report.votes[voteIndex].additionalPaymentSent = true;

        // Check if all reviewers have confirmed additional payment
        const allAdditionalPaymentsConfirmed = report.votes.every(vote => vote.additionalPaymentSent);
        if (allAdditionalPaymentsConfirmed) {
            report.additionalPaymentStatus = 'completed';
        }

        await report.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating additional payment status:', error);
        return NextResponse.json(
            { error: 'Failed to update additional payment status' },
            { status: 500 }
        );
    }
} 