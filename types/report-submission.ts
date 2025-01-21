export interface SubmitReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    walletAddress: string;
}