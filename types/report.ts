import { Vote } from "@/types/vote"
export interface Report {
    _id: string;
    title: string;
    telegramHandle: string;
    submitterAddress: string;
    fileUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    severity?: 'high' | 'medium' | 'low';
    votes: Vote[];
    kycStatus: 'pending' | 'completed';
    basePaymentStatus: 'pending' | 'completed' | 'rejected';
    additionalPaymentStatus: 'pending' | 'completed' | 'rejected';
    createdAt: string;
} 