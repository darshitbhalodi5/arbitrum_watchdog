import { IReport } from "@/models/Report";

export interface VoteCount {
  approved: number;
  rejected: number;
  total: number;
}

export interface VoteDetailsTabProps {
  report: IReport;
  isReviewer: boolean;
  currentUserAddress?: string;
  onVoteSubmit?: (
    vote: "approved" | "rejected",
    severity?: "high" | "medium" | "low"
  ) => Promise<void>;
  showVoteActions?: boolean;
}
