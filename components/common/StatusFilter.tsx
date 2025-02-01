import React from 'react';

type Status = 'all' | 'approved' | 'rejected' | 'pending';

interface StatusFilterProps {
  selectedStatus: Status;
  onStatusChange: (status: Status) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <div className="flex gap-2 mx-auto">
      <button
        onClick={() => onStatusChange('all')}
        className={`text-[9px] sm:text-base px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-sm transition-colors ${
          selectedStatus === 'all'
            ? 'bg-[#4ECDC4]/20 text-[#4ECDC4] border border-[#4ECDC4]/50'
            : 'bg-[#1A1B1E] text-gray-400 border border-gray-800 hover:border-[#4ECDC4]/30'
        }`}
      >
        All
      </button>
      <button
        onClick={() => onStatusChange('approved')}
        className={`text-[9px] sm:text-base px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-sm transition-colors ${
          selectedStatus === 'approved'
            ? 'bg-[#4ECDC4]/20 text-[#4ECDC4] border border-[#4ECDC4]/50'
            : 'bg-[#1A1B1E] text-gray-400 border border-gray-800 hover:border-[#4ECDC4]/30'
        }`}
      >
        Approved
      </button>
      <button
        onClick={() => onStatusChange('rejected')}
        className={`text-[9px] sm:text-base px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-sm transition-colors ${
          selectedStatus === 'rejected'
            ? 'bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/50'
            : 'bg-[#1A1B1E] text-gray-400 border border-gray-800 hover:border-[#FF6B6B]/30'
        }`}
      >
        Rejected
      </button>
      <button
        onClick={() => onStatusChange('pending')}
        className={`text-[9px] sm:text-base px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-sm transition-colors ${
          selectedStatus === 'pending'
            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
            : 'bg-[#1A1B1E] text-gray-400 border border-gray-800 hover:border-yellow-500/30'
        }`}
      >
        Pending
      </button>
    </div>
  );
};

export default StatusFilter; 