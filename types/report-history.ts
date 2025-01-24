import { IReport } from "@/models/Report";

export interface Question {
  _id: string;
  question: string;
  answer: string | null;
  askedBy: string;
  answeredBy: string | null;
  status: "pending" | "answered";
  createdAt: string;
  isRead?: boolean;
}

export interface Report extends IReport {
  hasUnreadQuestions?: boolean;
}

export interface ReportHistoryProps {
  walletAddress: string;
}
