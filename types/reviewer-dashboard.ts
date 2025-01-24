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
  isSubmitterQuestion?: boolean;
  notifiedReviewers?: string[];
}

export interface VoteCount {
  approved: number;
  rejected: number;
  total: number;
}

export interface IReportWithQuestions extends IReport {
  hasUnreadAnswers?: boolean;
  hasNewQuestions?: boolean;
  hasKycUpdate?: boolean;
  voteCount?: VoteCount;
}
