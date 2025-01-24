import { useState } from "react";
import { TabViewProps } from "@/types/tabview";

const TabView = ({ tabs }: TabViewProps) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="w-full font-secondary">
      {/* Tab Headers */}
      <div className="flex border-b border-[#4ECDC4]/20 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-light transition-colors relative ${
              activeTab === tab.id
                ? "text-[#B0E9FF]"
                : "text-gray-400 hover:text-[#B0E9FF]/70"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#4ECDC4]/20 via-[#4ECDC4] to-[#4ECDC4]/20"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default TabView;
