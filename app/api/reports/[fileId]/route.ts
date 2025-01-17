import { NextResponse } from 'next/server';
import { getFileStream } from '@/lib/upload';
import { Readable } from 'stream';

export async function GET(
    request: Request,
    context: { params: { fileId: string } }
) {
    try {
        const { fileId } = context.params;
        
        const { stream, fileInfo } = await getFileStream(fileId);
        
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

export async function OPTIONS() {
    return new NextResponse(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
} 