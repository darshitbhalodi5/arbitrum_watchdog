export interface Question {
  _id: string;
  reportId: string;
  question: string;
  answer: string | null;
  askedBy: string;
  answeredBy: string | null;
  status: "pending" | "answered";
  isRead: boolean;
  isSubmitterQuestion: boolean;
  notifiedReviewers: string[];
  createdAt: string;
  parentId: string | null;
  threadMessages: {
    message: string;
    sender: string;
    timestamp: Date;
    isRead: boolean;
  }[];
}

export interface QnAProps {
  reportId: string;
  isReviewer: boolean;
}
