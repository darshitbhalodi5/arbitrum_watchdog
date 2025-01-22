import React from 'react';
import { FileText, Gift, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section className="min-h-screen flex items-center py-20 bg-[#020617]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title with gradient */}
        <h2 
          className="text-4xl md:text-5xl font-bold mb-20"
          style={{
            background: "linear-gradient(180deg, #F0FF85 0%, #FFFFEA 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          How It Works
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#F0FF85]/20 to-transparent" />

          {/* Steps Container */}
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Step 1 */}
            <div className="relative group">
              {/* Step number and icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F0FF85]/10 text-[#F0FF85] text-sm">
                  1
                </div>
                <FileText className="w-5 h-5 text-[#F0FF85]" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white/90">
                  Submit a Report
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Confidentially report evidence-based misuse of DAO funds.
                </p>
              </div>

              {/* Hover line effect */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#F0FF85]/0 via-[#F0FF85]/50 to-[#F0FF85]/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>

            {/* Step 2 */}
            <div className="relative group">
              {/* Step number and icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F0FF85]/10 text-[#F0FF85] text-sm">
                  2
                </div>
                <Gift className="w-5 h-5 text-[#F0FF85]" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white/90">
                  Rewards
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Earn ARB-based rewards for valid misuse reports, including a base payout and a share of recovered funds.
                </p>
              </div>

              {/* Hover line effect */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#F0FF85]/0 via-[#F0FF85]/50 to-[#F0FF85]/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>

            {/* Step 3 */}
            <div className="relative group">
              {/* Step number and icon */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F0FF85]/10 text-[#F0FF85] text-sm">
                  3
                </div>
                <CheckCircle className="w-5 h-5 text-[#F0FF85]" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white/90">
                  Review Process
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  A trusted panel evaluates the report, determines severity (Low, Medium, High), and takes action.
                </p>
              </div>

              {/* Hover line effect */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#F0FF85]/0 via-[#F0FF85]/50 to-[#F0FF85]/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;