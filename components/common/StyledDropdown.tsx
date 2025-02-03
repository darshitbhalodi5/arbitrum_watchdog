import React from 'react';

interface StyledDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

const StyledDropdown: React.FC<StyledDropdownProps> = ({
  value,
  onChange,
  options,
  className = '',
}) => {
  return (
    <div className="relative min-w-[180px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          appearance-none
          w-full
          bg-[#020C1099]
          text-[#B0E9FF]
          rounded-lg
          px-4
          py-2.5
          pr-10
          text-sm
          border
          border-gray-800
          hover:border-[#4ECDC4]
          focus:border-[#4ECDC4]
          focus:ring-2
          focus:ring-[#4ECDC4]
          focus:ring-opacity-20
          focus:outline-none
          transition-all
          duration-200
          backdrop-blur-[80px]
          ${className}
        `}
        style={{
          background: "#020C1099",
          backdropFilter: "blur(80px)",
        }}
      >
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value} 
            className="bg-[#1A1B1E] text-white py-3 hover:bg-[#2C2D31]"
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-[#B0E9FF]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default StyledDropdown; 