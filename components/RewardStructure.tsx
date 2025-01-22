import React from 'react';
import Rewards from "@/public/assets/rewards.png"
import Image from 'next/image';

const RewardStructure = () => {
  return (
    <section className="min-h-screen flex items-center py-20 bg-[#020617]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-5xl font-bold mb-8 text-center lg:text-left"
          style={{
            background: "linear-gradient(179.48deg, #FBFCA4 17.14%, #FFFFFF 135.08%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Reward Structure
        </h2>

        <div
          className="text-[#FFFAD1] text-lg rounded-full px-8 py-3 inline-block mb-12 mx-auto lg:mx-0"
          style={{
            background: "#00000052",
            border: "0.5px solid rgba(250, 255, 200, 0.65)",
            boxShadow: "0px 4px 29.8px 0px #FFFFFF33 inset",
            backdropFilter: "blur(5px)",
          }}
        >
          Community members are rewarded based on the severity of the misuse
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center relative">
          {/* Content Column */}
          <div className="space-y-16 relative z-10">
            <div className="space-y-2 relative">
              <h3 className="text-2xl font-regular text-[#B0E9FF]">
                High Severity
              </h3>
              <div className="text-white text-xl font-bold">
                30,000 ARB + 5%
              </div>
              <p className="text-white opacity-80">
                of recovered funds (capped at $100k).
              </p>
              {/* Arrow for high severity */}
              <div className="hidden lg:block absolute right-0 top-1/2 w-24 h-px bg-gradient-to-r from-[#B0E9FF] to-transparent transform translate-x-full -translate-y-1/2"></div>
            </div>

            <div className="space-y-2 relative">
              <h3 className="text-2xl font-regular text-[#B0E9FF]">
                Medium Severity
              </h3>
              <div className="text-white text-xl font-bold">
                10,000 ARB + 5%
              </div>
              <p className="text-white opacity-80">
                of recovered funds (capped at $50k).
              </p>
              {/* Arrow for medium severity */}
              <div className="hidden lg:block absolute right-0 top-1/2 w-24 h-px bg-gradient-to-r from-[#B0E9FF] to-transparent transform translate-x-full -translate-y-1/2"></div>
            </div>

            <div className="space-y-2 relative">
              <h3 className="text-2xl font-regular text-[#B0E9FF]">
                Low Severity
              </h3>
              <div className="text-white text-xl font-bold">
                1,000 ARB + 5%
              </div>
              <p className="text-white opacity-80">
                of recovered funds (capped at $10k).
              </p>
              {/* Arrow for low severity */}
              <div className="hidden lg:block absolute right-0 top-1/2 w-24 h-px bg-gradient-to-r from-[#B0E9FF] to-transparent transform translate-x-full -translate-y-1/2"></div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative flex justify-center items-center lg:justify-start">
              <Image 
                src={Rewards} 
                alt="Reward-image"
                className="w-full max-w-[300px] lg:max-w-[400px] xl:max-w-[500px] transition-all duration-300"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RewardStructure;