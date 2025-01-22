"use client";

import Navbar from "@/components/Navbar";
import { usePrivy } from "@privy-io/react-auth";
// import { ArrowRightIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
// import Loading from "@/components/Loader";
// import Image from "next/image";
// import MatterSection from "@/public//assets/matter-section.png";
// import Rewards from "@/public/assets/rewards.png";
import HeroSection from "@/components/HeroSection";
import RewardStructure from "@/components/RewardStructure";
import WhyTruenceMatters from "@/components/WhyTruenceMatters";
import HowItWorks from "@/components/HowItWorks";
import TruenceSection from "@/components/TruenceSection";

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
  const handleRoleCardClick = (role: "reviewer" | "submitter") => {
    console.log(`RoleCard clicked for ${role}`);
    localStorage.setItem("attemptedRole", role);
    handleRoleLogin(role);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-[#020617]">
      {/* Background with overlay */}
      {/* <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/assets/background.png')" }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div> */}

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection
          authenticated={authenticated}
          handleRoleCardClick={handleRoleCardClick}
        />
        {/* Hero Section */}
        {/* <section className="min-h-screen flex items-center">
                    <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {authenticated ? (
                            <div className="flex items-center justify-center h-[60vh]">
                                <Loading message="Preparing your dashboard..." />
                            </div>
                        ) : (
                            <div className="max-w-4xl mx-auto">

                                <div className="text-center space-y-6 mb-12">
                                    <h1 className="text-6xl font-bold text-white tracking-wider">
                                        Welcome to Truence
                                    </h1>
                                    <p className="text-lg text-blue-200/80 font-light">
                                        Protecting the Integrity of DAO Funds
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto px-4">
                                    <RoleCard
                                        title="Login as Reviewer"
                                        description="Review and validate submitted content. Only authorized reviewer wallets can access this role."
                                        onClick={() => handleRoleCardClick("reviewer")}
                                    />
                                    <RoleCard
                                        title="Login as Submitter"
                                        description="Submit content for review. Reviewer wallets cannot access this role."
                                        onClick={() => handleRoleCardClick("submitter")}
                                    />
                                </div>

                                <p className="mt-8 text-sm text-gray-400 text-center">
                                    Note: Each wallet can only be used for one role. Reviewer wallets cannot submit reports.
                                </p>
                            </div>
                        )}
                    </div>
                </section> */}

        {/* Hero Section */}
        {/* <section
          className="h-screen flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/background.png')" }}
        >
          <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-8">
            {authenticated ? (
              <div className="flex items-center justify-center h-full">
                <Loading message="Preparing your dashboard..." />
              </div>
            ) : (
              <div className="text-center max-w-4xl mx-auto space-y-12">

                <h1 className="text-6xl font-bold text-white tracking-wider">
                  Welcome to Truence
                </h1>
                <p className="text-lg text-blue-200/80 font-light">
                  Protecting the Integrity of DAO Funds
                </p>

                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  <RoleCard
                    title="Login as Reviewer"
                    description="Review and validate submitted content. Only authorized reviewer wallets can access this role."
                    onClick={() => handleRoleCardClick("reviewer")}
                  />
                  <RoleCard
                    title="Login as Submitter"
                    description="Submit content for review. Reviewer wallets cannot access this role."
                    onClick={() => handleRoleCardClick("submitter")}
                  />
                </div>

                <p className="text-sm text-gray-400">
                  Note: Each wallet can only be used for one role. Reviewer
                  wallets cannot submit reports.
                </p>
              </div>
            )}
          </div>
        </section> */}

        {/* Mission Section */}
        <section className="min-h-screen flex items-center py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-5xl font-bold text-[#f0ff85] mb-8">
                  The Mission
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  The Arbitrum DAO has distributed over 422 million ARB tokens
                  to fund innovation and growth across the ecosystem. However,
                  ensuring these funds are used responsibly and transparently is
                  critical for the long-term success of the DAO. The Truence
                  Program empowers the community to protect DAO resources by
                  identifying and reporting misuse of funds.
                </p>
              </div>
              <div className="relative">
                <div className="text-[20rem] font-bold text-blue-500/20">
                  000
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is Truence Section */}
        <TruenceSection />
        {/* <section className="min-h-screen flex items-center py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold text-[#85f0ff] mb-16">
              What is Truence?
            </h2>
            <p className="text-gray-300 text-xl mb-12">
              Truence is a grant misuse bounty program designed to:
            </p>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-blue-500/20">
                <Eye className="w-12 h-12 text-[#85f0ff] mb-6" />
                <p className="text-gray-300 text-lg">
                  Incentivize community members to report misuse of
                  DAO-allocated funds. Strengthen accountability within the DAO
                  ecosystem.
                </p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-blue-500/20">
                <Target className="w-12 h-12 text-[#85f0ff] mb-6" />
                <p className="text-gray-300 text-lg">
                  Deter malicious actors by introducing transparent consequences
                  for fund mismanagement.
                </p>
              </div>
            </div>
          </div>
        </section> */}

        {/* How It Works Section */}
        < HowItWorks />
        
        {/* Why Truence Matters Section */}
        <WhyTruenceMatters />
        
        {/* Reward Structure Section */}
        <RewardStructure />

        {/* Call to Action Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-r from-[#1a2e44] to-[#0f172a] rounded-2xl p-12 overflow-hidden backdrop-blur-lg border border-blue-500/10">
              {/* Glass effect overlay */}
              <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-sm"></div>

              {/* Light effect */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>

              {/* Content */}
              <div className="relative z-10">
                <h2 className="text-4xl font-bold text-[#85f0ff] mb-4">
                  Ready to take action?
                </h2>
                <p className="text-gray-300 text-lg max-w-3xl">
                  Submit a report, help us recover misused funds, and earn your
                  rewards! Together, we can ensure Arbitrum DAO funds are used
                  for the betterment of the ecosystem.
                </p>
              </div>
            </div>
          </div>
        </section>
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
