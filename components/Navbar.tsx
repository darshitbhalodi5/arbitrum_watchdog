'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { login, logout, authenticated, user } = usePrivy();

  const whitelistedAddresses = [
    "0xaaF296aC355B938D6263ac1CcbB4ac61c964D176",
  ];

  const isReviewer = user?.wallet?.address 
    ? whitelistedAddresses.includes(user.wallet.address)
    : false;

  return (
    <nav className="bg-[#2C2D31] shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-white group">
              <span className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] bg-clip-text text-transparent">
                WATCHDOG
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {!authenticated ? (
              <button
                onClick={() => login()}
                className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white px-6 py-2 rounded-md hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-[#FF6B6B]/20"
              >
                Connect Wallet
              </button>
            ) : (
              <>
                <button
                  className={`px-6 py-2 rounded-md transition-all duration-200 shadow-lg ${
                    isReviewer
                      ? "bg-[#4ECDC4] text-white hover:bg-[#45b8b0] hover:shadow-[#4ECDC4]/20"
                      : "bg-[#FF6B6B] text-white hover:bg-[#ff5252] hover:shadow-[#FF6B6B]/20"
                  }`}
                >
                    {user?.wallet?.address}
                  {/* Sign in as {isReviewer ? "Reviewer" : "Submitter"} */}
                </button>
                <button
                  onClick={() => logout()}
                  className="text-gray-400 hover:text-[#FFE66D] transition-colors"
                >
                  Disconnect
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-[#FFE66D] hover:bg-gray-800/50 transition-all"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-[#2C2D31] border-t border-gray-800">
          <div className="pt-2 pb-3 space-y-1">
            {!authenticated ? (
              <button
                onClick={() => login()}
                className="w-full text-left block px-4 py-2 text-base font-medium text-gray-400 hover:text-[#FFE66D] hover:bg-gray-800/50"
              >
                Connect Wallet
              </button>
            ) : (
              <>
                <button
                  className={`w-full text-left block px-4 py-2 text-base font-medium ${
                    isReviewer
                      ? "text-[#4ECDC4] hover:text-[#45b8b0]"
                      : "text-[#FF6B6B] hover:text-[#ff5252]"
                  } hover:bg-gray-800/50`}
                >
                  Sign in as {isReviewer ? "Reviewer" : "Submitter"}
                </button>
                <button
                  onClick={() => logout()}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-400 hover:text-[#FFE66D] hover:bg-gray-800/50"
                >
                  Disconnect
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 