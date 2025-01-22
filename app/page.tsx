"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Loading from "@/components/Loader";
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
    localStorage.setItem("attemptedRole", role);

    try {
      if (!authenticated) {
        await login();
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please try again.");
    }
  };

  // Handle role checking and redirection after wallet connection
  useEffect(() => {
    const checkRoleAccess = async () => {
      if (authenticated && user?.wallet?.address) {
        const address = user.wallet.address.toLowerCase();
        const isReviewerAddress = REVIEWER_ADDRESSES.includes(address);
        const attemptedRole = localStorage.getItem("attemptedRole");

        if (!attemptedRole) return;

        try {
          if (attemptedRole === "reviewer" && !isReviewerAddress) {
            localStorage.removeItem("attemptedRole");
            await logout();
            toast.error("You are not a reviewer. Please login as submitter.");
          } else if (attemptedRole === "submitter" && isReviewerAddress) {
            localStorage.removeItem("attemptedRole");
            await logout();
            toast.error("You are not a submitter. Please login as reviewer.");
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
          toast.error("Error checking role access. Please try again.");
        }
      }
    };

    checkRoleAccess();
  }, [authenticated, user?.wallet?.address, logout, router]);

  if (authenticated) {
    return (
      <div className="min-h-screen flex flex-col relative bg-[#020617]">
        <div className="flex items-center justify-center h-screen">
          <Loading message="Preparing your dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-[#020617]">
      <div className="relative z-10">
        <LandingPage onRoleSelect={handleRoleLogin} />
      </div>
    </div>
  );
}