export interface Vote {
    reviewerAddress: string;
    vote: 'approved' | 'rejected';
    severity?: 'high' | 'medium' | 'low';
    reviewerComment?: string;
    basePaymentSent?: boolean;
    additionalPaymentSent?: boolean;
    createdAt: string;
    _id: string;
}

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