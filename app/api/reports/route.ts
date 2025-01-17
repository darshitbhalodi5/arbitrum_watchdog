import { NextResponse } from 'next/server';
import { connect } from '@/lib/mongodb';
import { Report } from '@/models/Report';
import { uploadFile } from '@/lib/upload';

export async function POST(req: Request) {
    try {
        await connect();

        const formData = await req.formData();
        const title = formData.get('title') as string;
        const telegramHandle = formData.get('telegramHandle') as string;
        const submitterAddress = formData.get('submitterAddress') as string;
        const file = formData.get('file') as File;

        // Upload file to S3
        const fileUrl = await uploadFile(file);

        const report = await Report.create({
            title,
            telegramHandle,
            submitterAddress,
            fileUrl,
            status: 'pending',
        });

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

        const reports = await Report.find({ submitterAddress: address })
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