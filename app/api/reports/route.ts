import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb';
import { ReportModel, IReport } from '@/models/Report';
import { uploadFile } from '@/lib/upload';
import { MisuseRange } from '@/types/report';

export async function POST(req: Request) {
    try {
        await connect();

        const formData = await req.formData();
        console.log("Form Data inspection",formData)
        const title = formData.get('title') as string;
        const telegramHandle = formData.get('telegramHandle')?.toString() || undefined;
        const submitterAddress = formData.get('submitterAddress') as string;
        const misuseRange = formData.get('misuseRange') as MisuseRange;
        const file = formData.get('file') as File;

        // Upload file to S3
        const fileUrl = await uploadFile(file);

        // Create report data object with required fields
        const reportData: Partial<IReport> = {
            title,
            submitterAddress,
            misuseRange,
            fileUrl,
            status: 'pending' as const,
        };

        // Only add telegramHandle if it exists and is not empty
        if (telegramHandle && telegramHandle.trim() !== '') {
            reportData.telegramHandle = telegramHandle;
        }

        const report = await ReportModel.create(reportData);

        return NextResponse.json(report);
    } catch (error) {
        console.error('Error creating report:', error);
        return NextResponse.json(
            { error: 'Failed to create report' },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        await connect();

        const { searchParams } = new URL(req.url);
        const address = searchParams.get('address');

        const reports = await ReportModel.find({ submitterAddress: address })
            .sort({ createdAt: -1 });

        return NextResponse.json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reports' },
            { status: 500 }
        );
    }
} 