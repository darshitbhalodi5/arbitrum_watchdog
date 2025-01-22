"use client";

import { usePrivy } from "@privy-io/react-auth";
import toast from "react-hot-toast";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import LandingPage from "@/components/landing/LandingPage";

// Whitelist addresses
const REVIEWER_ADDRESSES = [
  process.env.NEXT_PUBLIC_REVIEWER_ADDRESS_1,
  process.env.NEXT_PUBLIC_REVIEWER_ADDRESS_2,
  process.env.NEXT_PUBLIC_REVIEWER_ADDRESS_3,
].map((addr) => addr?.toLowerCase());

export default function Home() {
  const { authenticated, user, login, logout } = usePrivy();
  const router = useRouter();

  const handleRoleLogin = async (role: "reviewer" | "submitter") => {
    console.log("Starting handleRoleLogin with role:", role);

    try {
      if (!authenticated) {
        await login();
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Handle role checking and redirection after wallet connection
  useEffect(() => {
    const checkRoleAccess = async () => {
      if (authenticated && user?.wallet?.address) {
        const address = user.wallet.address.toLowerCase();
        const isReviewerAddress = REVIEWER_ADDRESSES.includes(address);

        // Get the last attempted role from localStorage
        const attemptedRole = localStorage.getItem("attemptedRole");

        if (!attemptedRole) return; // Exit if no attempted role

        try {
          if (attemptedRole === "reviewer" && !isReviewerAddress) {
            localStorage.removeItem("attemptedRole");
            await logout();
            toast.error("You are not reviewer. Please login as submitter.");
          } else if (attemptedRole === "submitter" && isReviewerAddress) {
            localStorage.removeItem("attemptedRole");
            await logout();
            toast.error("You are not submitter. Please login as reviewer.");
          } else {
            localStorage.removeItem("attemptedRole");
            // Redirect to appropriate dashboard
            if (isReviewerAddress) {
              router.push("/reviewer");
            } else {
              router.push("/submitter");
            }
          }
        } catch (error) {
          localStorage.removeItem("attemptedRole");
          console.error("Error during role check:", error);
        }
      }
    };

    checkRoleAccess();
  }, [authenticated, user?.wallet?.address, logout, router]);

  // Store the attempted role before initiating login
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRoleCardClick = (role: "reviewer" | "submitter") => {
    console.log(`RoleCard clicked for ${role}`);
    localStorage.setItem("attemptedRole", role);
    handleRoleLogin(role);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#020617]">
      <div className="relative z-10">
        <LandingPage />
      </div>
    </div>
  );
}

interface RoleCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RoleCard = ({ title, description, onClick }: RoleCardProps) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden rounded-lg border border-blue-500/20 bg-black/20 backdrop-blur-sm p-6 
                   transition-all duration-300 hover:border-blue-500/40 hover:bg-black/30"
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl"></div>
    </div>
    <div className="relative z-10">
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
    <div
      className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-blue-500 to-purple-500 
                      transition-all duration-300 group-hover:w-full"
    ></div>
  </button>
);

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: ReactNode;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StepCard = ({ number, title, description, icon }: StepCardProps) => (
  <div className="relative p-6 bg-black/30 backdrop-blur-sm rounded-lg border border-[#f0ff85]/20">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#f0ff85]/10 text-[#f0ff85]">
        {number}
      </div>
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);
