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

export interface QnAProps {
  reportId: string;
  isReviewer: boolean;
}
