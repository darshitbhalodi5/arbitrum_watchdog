import { ReactNode, useState } from 'react';

interface Tab {
    id: string;
    label: string;
    content: ReactNode;
}

interface TabViewProps {
    tabs: Tab[];
}

const TabView = ({ tabs }: TabViewProps) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <div className="w-full">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-800 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                            activeTab === tab.id
                                ? 'text-[#4ECDC4]'
                                : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4ECDC4]"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {tabs.find(tab => tab.id === activeTab)?.content}
            </div>
        </div>
    );
};

export default TabView; 