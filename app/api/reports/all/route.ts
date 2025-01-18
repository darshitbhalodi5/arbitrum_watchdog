import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb';
import { ReportModel } from '@/models/Report';

export async function GET() {
    try {
        await connect();
        const reports = await ReportModel.find().sort({ createdAt: -1 });
        return NextResponse.json(reports);
    } catch (error) {
        console.error('Error fetching all reports:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reports' },
            { status: 500 }
        );
    }
} 