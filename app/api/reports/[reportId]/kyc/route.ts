import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb';
import { ReportModel } from '@/models/Report';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ reportId: string }> }
) {
    try {
        await connect();
        const reportId = (await params).reportId;
        const report = await ReportModel.findById(reportId);
        
        if (!report) {
            return NextResponse.json(
                { error: 'Report not found' },
                { status: 404 }
            );
        }

        report.kycStatus = 'completed';
        await report.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating KYC status:', error);
        return NextResponse.json(
            { error: 'Failed to update KYC status' },
            { status: 500 }
        );
    }
} 