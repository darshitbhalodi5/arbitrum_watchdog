import { Vote } from "@/types/vote"

export type MisuseRange = '<5k' | '5-20k' | '20-50k' | '50-100k' | '100-500k' | '500k+';

export interface Report {
    _id: string;
    title: string;
    telegramHandle?: string;
    submitterAddress: string;
    fileUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    severity?: 'high' | 'medium' | 'low';
    misuseRange: MisuseRange;
    votes: Vote[];
    kycStatus: 'pending' | 'completed';
    basePaymentStatus: 'pending' | 'completed' | 'rejected';
    additionalPaymentStatus: 'pending' | 'completed' | 'rejected';
    createdAt: string;
} 