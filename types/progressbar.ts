import { Report } from "@/types/report"

export interface ProgressBarProps {
    report: Report;
    onKycVerify?: () => void | Promise<void>;
    isSubmitter: boolean;
}