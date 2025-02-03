import React, { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  placeholder = 'Search...',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        if (searchQuery === '') {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchQuery]);

  const handleSearchClick = () => {
    setIsExpanded(true);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className={`flex items-center transition-all duration-300 ${
        isExpanded ? 'w-[300px]' : 'w-10'
      }`}>
        <div className={`relative flex items-center w-full transition-all duration-300 ${
          isExpanded ? 'bg-[#1A1B1E] rounded-lg border border-gray-800' : ''
        }`}>
          <button
            onClick={handleSearchClick}
            className={`flex items-center justify-center ${
              isExpanded ? 'pl-3' : 'p-2 hover:text-[#4ECDC4]'
            }`}
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
          
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-transparent text-white px-3 py-2 focus:outline-none transition-all duration-300 ${
              isExpanded ? 'opacity-100 visible' : 'opacity-0 invisible w-0 p-0'
            }`}
          />
          
          {isExpanded && searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsExpanded(false);
              }}
              className="pr-3 text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 