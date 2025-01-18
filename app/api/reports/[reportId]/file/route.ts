import { NextResponse } from 'next/server';
import { getFileStream } from '@/lib/upload';
import { Readable } from 'stream';
import { ReportModel } from '@/models/Report';
import { connect } from '@/lib/mongodb';

export async function GET(
    request: Request,
    { params }: {
        params: Promise<{ reportId : string}>
      }
) {
    try {
        console.log("Request",request);
        await connect();
        const reportId  = (await params).reportId;
        const report = await ReportModel.findById(reportId);
        if (!report) {
            return NextResponse.json(
                { error: 'Report not found' },
                { status: 404 }
            );
        }
        
        const { stream, fileInfo } = await getFileStream(report.fileUrl);
        
        // Convert the GridFS stream to a Web Response
        const readable = Readable.from(stream);
        const chunks = [];

        for await (const chunk of readable) {
            chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);

        // Set appropriate headers for file download
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': fileInfo.contentType || 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${fileInfo.filename}"`,
                'Content-Length': fileInfo.length.toString(),
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
            },
        });
    } catch (error) {
        console.error('Error streaming file:', error);
        return NextResponse.json(
            { error: 'Failed to get file' },
            { status: 500 }
        );
    }
} 