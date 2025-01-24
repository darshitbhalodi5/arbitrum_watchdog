import React from 'react';
import { motion } from 'framer-motion';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  className?: string;
  size?: 'sm' | 'md';
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  isBookmarked,
  onToggle,
  className = '',
  size = 'md'
}) => {
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <motion.div
      onClick={(e) => {
        e.stopPropagation(); // Prevent triggering parent button click
        onToggle();
      }}
      whileTap={{ scale: 0.9 }}
      className={`group focus:outline-none cursor-pointer ${className}`}
      title={isBookmarked ? "Remove from favorites" : "Add to favorites"}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
    >
      {isBookmarked ? (
        <motion.svg
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className={`${iconSize} text-[#4ECDC4] transition-colors`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </motion.svg>
      ) : (
        <motion.svg
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className={`${iconSize} text-gray-400 hover:text-[#4ECDC4] transition-colors`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </motion.svg>
      )}
    </motion.div>
  );
};

export default BookmarkButton; 