"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import {
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import TruenceLogo from "@/public/assets/logo.png";
import TruenceSymbol from "@/public/assets/symbol.png";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { logout, authenticated, user } = usePrivy();
  const pathname = usePathname();

  const reviewerAddresses = [
    process.env.NEXT_PUBLIC_REVIEWER_ADDRESS_1,
    process.env.NEXT_PUBLIC_REVIEWER_ADDRESS_2,
    process.env.NEXT_PUBLIC_REVIEWER_ADDRESS_3,
  ];

  const isReviewer = user?.wallet?.address
    ? reviewerAddresses.includes(user.wallet.address)
    : false;

  // Function to slice address
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to copy address
  const copyAddress = async () => {
    if (user?.wallet?.address) {
      try {
        await navigator.clipboard.writeText(user.wallet.address);
        setIsCopied(true);
        toast.success("Address copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy address", err);
        toast.error("Failed to copy address");
      }
    }
  };

  return (
    <nav className="p-[1px] bg-gradient-to-t from-[#77CFC7] to-[#868686] w-[99%] mx-auto rounded-xl my-2">
      <div className="bg-[#000000] w-full rounded-xl">
        <div className="bg-[#0B313C30] w-full rounded-xl">
          <div className="mx-auto px-4 py-2 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex-shrink-0 flex items-center gap-3">
                <Image
                  src={TruenceSymbol}
                  alt="Truence Symbol"
                  className="object-contain w-auto h-[30px] sm:h-[40px]"
                  priority
                />
                <Image
                  src={TruenceLogo}
                  alt="Truence Logo"
                  className="object-contain w-auto h-[15px] sm:h-[20px]"
                  priority
                />
              </Link>

              {/* Desktop Menu */}
              <div className="hidden sm:flex items-center space-x-4">
                {!authenticated || pathname === "/" ? null : (
                  <div className="flex items-center space-x-4">
                    <div
                      className="px-4 py-2 rounded-md bg-[#1A1B1E] border border-[#4ECDC4]/20 
                            text-[#4ECDC4] hover:bg-[#1A1B1E]/80 transition-all duration-200"
                    >
                      <span className="font-mono">
                        {user?.wallet?.address &&
                          truncateAddress(user.wallet.address)}
                      </span>
                      <button onClick={copyAddress} className="ml-2">
                        {isCopied ? (
                          <ClipboardDocumentCheckIcon className="w-5 h-5" />
                        ) : (
                          <ClipboardDocumentIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => logout()}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="sm:hidden flex items-center">
                {!authenticated || pathname === "/" ? null : (
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-[#4ECDC4] hover:bg-[#1A1B1E] transition-all"
                  >
                    <span className="sr-only">Open main menu</span>
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
                        d={
                          isMobileMenuOpen
                            ? "M6 18L18 6M6 6l12 12"
                            : "M4 6h16M4 12h16M4 18h16"
                        }
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden bg-[#1A1B1E] border-t border-[#4ECDC4]/20 rounded-b-xl">
              <div className="pt-2 pb-3 space-y-1">
                <div
                  className={`flex items-center justify-between px-4 py-2 text-base font-medium ${
                    isReviewer ? "text-[#4ECDC4]" : "text-[#FF6B6B]"
                  }`}
                >
                  <span className="font-mono">
                    {user?.wallet?.address &&
                      truncateAddress(user.wallet.address)}
                  </span>
                  <button
                    onClick={copyAddress}
                    className="hover:opacity-80 transition-opacity p-1"
                    title="Copy address"
                  >
                    {isCopied ? (
                      <ClipboardDocumentCheckIcon className="w-5 h-5" />
                    ) : (
                      <ClipboardDocumentIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <button
                  onClick={() => logout()}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-400 hover:text-[#4ECDC4] hover:bg-[#1A1B1E]/80"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
