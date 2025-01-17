import { connect } from '@/lib/mongodb';
import { GridFSBucket, ObjectId } from 'mongodb';
import mongoose from 'mongoose';

export async function uploadFile(file: File): Promise<string> {
    try {
        await connect();
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection not established');
        }
        const bucket = new GridFSBucket(db, {
            bucketName: 'reports'
        });

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create a unique filename
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.name}`;

        return new Promise((resolve, reject) => {
            // Create upload stream
            const uploadStream = bucket.openUploadStream(filename, {
                contentType: file.type,
            });

            // Handle upload events
            uploadStream.on('error', (error) => {
                console.error('Error uploading to GridFS:', error);
                reject(error);
            });

            uploadStream.on('finish', () => {
                resolve(uploadStream.id.toString());
            });

            // Write buffer to stream
            uploadStream.write(buffer);
            uploadStream.end();
        });
    } catch (error) {
        console.error('Error in uploadFile:', error);
        throw new Error('Failed to upload file');
    }
}

export async function getFileStream(fileId: string) {
    try {
        await connect();
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Database connection not established');
        }

        const bucket = new GridFSBucket(db, {
            bucketName: 'reports'
        });

        // First, get the file info
        const files = await db.collection('reports.files').findOne({
            _id: new ObjectId(fileId)
        });

        if (!files) {
            throw new Error('File not found');
        }

        // Return both the stream and the file info
        return {
            stream: bucket.openDownloadStream(new ObjectId(fileId)),
            fileInfo: files
        };
    } catch (error) {
        console.error('Error getting file stream:', error);
        throw error;
    }
} 