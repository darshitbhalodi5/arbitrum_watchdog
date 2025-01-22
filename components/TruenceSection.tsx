import React from 'react';
import { Eye, Target } from 'lucide-react';

const TruenceSection = () => {
  return (
    <section className="min-h-screen bg-[#020817] flex items-center py-20">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-5xl font-normal text-[#85f0ff] mb-4">
          What is Truence ?
        </h2>
        <p className="text-gray-400 text-lg mb-16">
          Truence is a grant misuse bounty program designed to:
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#0c1222] p-6 rounded-lg">
            <div className="bg-[#152238] w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <Eye className="w-6 h-6 text-[#85f0ff]" />
            </div>
            <p className="text-gray-400 text-base leading-relaxed">
              Incentivize community members to report misuse of DAO-allocated funds.
              Strengthen accountability within the DAO ecosystem.
            </p>
          </div>
          <div className="bg-[#0c1222] p-6 rounded-lg">
            <div className="bg-[#152238] w-12 h-12 rounded-full flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-[#85f0ff]" />
            </div>
            <p className="text-gray-400 text-base leading-relaxed">
              Deter malicious actors by introducing transparent consequences for fund mismanagement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TruenceSection;