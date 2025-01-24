import { IReport } from "@/models/Report";

export interface ReportDetailProps {
  report: IReport;
  isReviewer: boolean;
  onKycVerify?: () => Promise<void>;
  onBasePaymentConfirm?: () => Promise<void>;
  onAdditionalPaymentConfirm?: () => Promise<void>;
  onTelegramReveal?: (title: string) => void;
  decryptedHandle?: string;
  onTelegramHide?: () => void;
}
