import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    telegramHandle: {
        type: String,
        required: true,
    },
    submitterAddress: {
        type: String,
        required: true,
    },
    fileUrl: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    severity: {
        type: String,
        enum: ['high', 'medium', 'low'],
    },
    reviewerComment: {
        type: String,
    }
}, {
    timestamps: true,
});

export const Report = mongoose.models.Report || mongoose.model('Report', reportSchema); 