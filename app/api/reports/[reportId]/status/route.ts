import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb';
import { Report } from '@/models/Report';

export async function PUT(
    request: Request,
    { params }: { params: { reportId: string } }
) {
    try {
        await connect();
        const { reportId } = params;
        const { status, severity, reviewerComment } = await request.json();

        const report = await Report.findByIdAndUpdate(
            reportId,
            { 
                status,
                ...(severity && { severity }),
                ...(reviewerComment && { reviewerComment })
            },
            { new: true }
        );

        if (!report) {
            return NextResponse.json(
                { error: 'Report not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(report);
    } catch (error) {
        console.error('Error updating report status:', error);
        return NextResponse.json(
            { error: 'Failed to update report status' },
            { status: 500 }
        );
    }
} 