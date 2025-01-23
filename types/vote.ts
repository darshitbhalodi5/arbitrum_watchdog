import { IReport } from "@/models/Report";

export interface Vote {
    timestamp: string | number | Date;
    reviewerAddress: string;
    vote: 'approved' | 'rejected';
    severity?: 'high' | 'medium' | 'low';
    reviewerComment?: string;
    basePaymentSent?: boolean;
    additionalPaymentSent?: boolean;
    createdAt: string;
    _id: string;
}

export interface VoteDetailsProps {
    votes?: Vote[];
    report?: IReport;
    showAll?: boolean;
    currentUserAddress?: string;
}