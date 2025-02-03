import React, { useState } from 'react';
import Image from 'next/image';
import ArbiturmLogo from '@/public/assets/arb.png'

const FundStats: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Function to format currency
  const formatCurrency = (amount: number): React.ReactNode => {
    return (
      <div className="flex items-center">
        <span className="text-[#4ECDC4] text-2xl">$</span>
        <span className="text-[#4ECDC4] text-2xl">{amount}</span>
        <span className="text-[#4ECDC4] text-2xl">k</span>
      </div>
    );
  };

  // Calculate all stats internally
  const stats = {
    allocatedAmount: 400,
    basePaymentPaid: 0,
    additionalPaymentPaid: 0,
    recoveredAmount: 0,
  };

  return (
    <div className={`w-full bg-[#020C1099] backdrop-blur-[80px] border border-gray-800 rounded-lg transition-all duration-300 ${
      isExpanded ? 'p-6 mb-8' : 'p-4 mb-4'
    }`}>
      <div className={`flex items-center justify-between gap-4 ${isExpanded ? 'mb-8' : 'mb-0'}`}>
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12">
            <Image
              src={ArbiturmLogo}
              alt="Arbitrum Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-4xl font-primary font-medium tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] from-[17.3%] to-[168.94%] to-[#000000]">
            Arbitrum Watchdog
          </h1>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#4ECDC4] hover:text-[#4ECDC4]/80 transition-colors p-2"
        >
          <svg
            className={`w-6 h-6 transform transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      <div
        className={`grid grid-cols-2 md:grid-cols-4 gap-4 overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-96 opacity-100 mt-0' : 'max-h-0 opacity-0 mt-0'
        }`}
      >
        <div className="p-4 bg-[#1A1B1E] rounded-lg border border-gray-800">
          <div className="flex items-center h-12">
            {formatCurrency(stats.allocatedAmount)}
          </div>
          <div className="text-xs sm:text-sm text-gray-400 mt-1">
            ALLOCATED AMOUNT
          </div>
        </div>

        <div className="p-4 bg-[#1A1B1E] rounded-lg border border-gray-800">
          <div className="flex items-center h-12">
            {formatCurrency(stats.basePaymentPaid)}
          </div>
          <div className="text-xs sm:text-sm text-gray-400 mt-1">
            BASE AMOUNT PAID
          </div>
        </div>

        <div className="p-4 bg-[#1A1B1E] rounded-lg border border-gray-800">
          <div className="flex items-center h-12">
            {formatCurrency(stats.additionalPaymentPaid)}
          </div>
          <div className="text-xs sm:text-sm text-gray-400 mt-1">
            ADDITIONAL AMOUNT PAID
          </div>
        </div>

        <div className="p-4 bg-[#1A1B1E] rounded-lg border border-gray-800">
          <div className="flex items-center h-12">
            {formatCurrency(stats.recoveredAmount)}
          </div>
          <div className="text-xs sm:text-sm text-gray-400 mt-1">
            RECOVERED AMOUNT
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundStats; 