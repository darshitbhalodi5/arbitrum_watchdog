import React from 'react';
import Image from 'next/image';
import MatterSection from "@/public/assets/matter-section.png";

const WhyTruenceMatters = () => {
  return (
    <section className="min-h-screen flex items-center py-20 bg-[#020617] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Background gradient effect */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(133,240,255,0.1) 0%, rgba(0,0,0,0) 70%)',
          }}
        />

        <div className="relative">
          {/* Title with gradient */}
          <h2 
            className="text-4xl md:text-5xl font-bold mb-16 md:mb-24"
            style={{
              background: 'linear-gradient(180deg, #85F0FF 0%, #FFFFFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Why Truence Matters
          </h2>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image Column */}
            <div className="relative flex justify-center items-center order-2 lg:order-1">
              <div className="relative w-full max-w-[400px]">
                {/* Glow effect behind image */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-2xl opacity-20"
                  style={{
                    background: 'radial-gradient(circle, rgba(133,240,255,0.3) 0%, rgba(0,0,0,0) 70%)',
                  }}
                />
                <Image
                  src={MatterSection}
                  alt="Truence Matters Diagram"
                  className="w-full h-auto relative z-10 hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </div>

            {/* Content Column */}
            <div className="space-y-12 md:space-y-16 order-1 lg:order-2">
              <div className="space-y-3 hover:translate-x-2 transition-transform duration-300">
                <h3 className="text-2xl font-semibold text-[#85f0ff]">
                  Recover Misused Funds
                </h3>
                <p className="text-gray-300/90 text-lg leading-relaxed">
                  Strengthen DAO finances by identifying and recovering
                  misallocated resources.
                </p>
              </div>

              <div className="space-y-3 hover:translate-x-2 transition-transform duration-300">
                <h3 className="text-2xl font-semibold text-[#85f0ff]">
                  Prevent Misconduct
                </h3>
                <p className="text-gray-300/90 text-lg leading-relaxed">
                  Transparent reporting and public accountability deter bad
                  actors.
                </p>
              </div>

              <div className="space-y-3 hover:translate-x-2 transition-transform duration-300">
                <h3 className="text-2xl font-semibold text-[#85f0ff]">
                  Empower the Community
                </h3>
                <p className="text-gray-300/90 text-lg leading-relaxed">
                  Give contributors the tools and incentives to uphold the
                  integrity of the Arbitrum ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyTruenceMatters;