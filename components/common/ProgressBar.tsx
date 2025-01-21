import { Vote } from "@/types/vote";
import { ProgressBarProps } from "@/types/progressbar"

const ProgressBar = ({ report, onKycVerify, isSubmitter }: ProgressBarProps) => {
    const steps = [
        {
            title: 'KYC Verification',
            status: report.kycStatus,
            action: isSubmitter ? (
                <button
                    onClick={onKycVerify}
                    disabled={report.kycStatus === 'completed'}
                    className={`px-3 py-1 rounded-lg text-sm ${
                        report.kycStatus === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-[#4ECDC4] text-white hover:opacity-90'
                    }`}
                >
                    {report.kycStatus === 'completed' ? 'Verified' : 'Verify KYC'}
                </button>
            ) : null
        },
        {
            title: 'Base Payment',
            status: report.basePaymentStatus,
            statusText: getPaymentStatusText(report.basePaymentStatus, report.votes)
        },
        {
            title: 'Additional Payment',
            status: report.additionalPaymentStatus,
            statusText: getPaymentStatusText(report.additionalPaymentStatus, report.votes)
        }
    ];

    return (
        <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-white font-semibold mb-4">Verification and Payment Status</h3>
            <div className="space-y-4">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                                step.status === 'completed' ? 'bg-green-400' :
                                step.status === 'rejected' ? 'bg-red-400' :
                                'bg-yellow-400'
                            }`} />
                            <span className="text-gray-300">{step.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {step.statusText && (
                                <span className="text-sm text-gray-400">
                                    {step.statusText}
                                </span>
                            )}
                            {step.action}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

function getPaymentStatusText(status: string, votes: Vote[]) {
    if (status === 'completed') return 'Payment Completed';
    if (status === 'rejected') return 'Payment Rejected';
    
    const completedCount = votes.filter(v => v.basePaymentSent || v.additionalPaymentSent).length;
    return `${completedCount}/3 Confirmed`;
}

export default ProgressBar; 