"use client";

import Navbar from "@/components/Navbar";
import { usePrivy } from "@privy-io/react-auth";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loader";

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
        <div className="min-h-screen flex flex-col bg-[#1A1B1E]">
            <Navbar />
            <main className="flex-1 w-full">
                <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                    {authenticated ? (
                        <div className="flex items-center justify-center h-[60vh]">
                            <Loading message="Preparing your dashboard..." />
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center space-y-6 mb-12 sm:mb-16">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] bg-clip-text text-transparent leading-tight">
                                    Welcome to Watchdog
                                </h1>
                                <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
                                    Your trusted platform for decentralized content review
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto px-4 sm:px-6">
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

                            <p className="mt-8 sm:mt-12 text-sm text-gray-500 text-center max-w-2xl mx-auto px-4">
                                Note: Each wallet can only be used for one role. Reviewer wallets
                                cannot submit reports.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

interface RoleCardProps {
    title: string;
    description: string;
    onClick: () => void;
}

const RoleCard = ({ title, description, onClick }: RoleCardProps) => (
    <button
        onClick={() => {
            console.log(`RoleCard clicked: ${title}`);
            onClick();
        }}
        className="group bg-[#2C2D31] p-6 sm:p-8 rounded-lg border border-gray-800 hover:border-[#4ECDC4] transition-all duration-200 text-left w-full"
    >
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-white">{title}</h3>
            <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#4ECDC4] transform group-hover:translate-x-1 transition-transform" />
        </div>
        <p className="text-sm sm:text-base text-gray-400">{description}</p>
    </button>
);
