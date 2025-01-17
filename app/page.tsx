'use client';

import Navbar from '@/components/Navbar';
import SubmitterDashboard from '@/components/submitter/SubmitterDashboard';
import { usePrivy } from '@privy-io/react-auth';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

// Whitelist addresses
const REVIEWER_ADDRESSES = [
    "0xaaF296aC355B938D6263ac1CcbB4ac61c964D176".toLowerCase(),
];

export default function Home() {
    const { authenticated, user, login, logout } = usePrivy();

    const handleRoleLogin = async (role: 'reviewer' | 'submitter') => {
        console.log("Starting handleRoleLogin with role:", role);

        try {
            if (!authenticated) {
                console.log("Not authenticated, initiating login...");
                await login();
                return;
            }

            // Let the useEffect handle the role check after authentication
            console.log("Login completed, useEffect will handle role check");
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Failed to connect wallet. Please try again.');
        }
    };

    // Handle role checking after wallet connection
    useEffect(() => {
        const checkRoleAccess = async () => {
            console.log("Checking role access...");
            console.log("Auth state:", { authenticated, userAddress: user?.wallet?.address });

            if (authenticated && user?.wallet?.address) {
                const address = user.wallet.address.toLowerCase();
                const isReviewerAddress = REVIEWER_ADDRESSES.includes(address);
                
                // Get the last attempted role from localStorage
                const attemptedRole = localStorage.getItem('attemptedRole');
                console.log("Attempted role:", attemptedRole);
                console.log("Is reviewer address:", isReviewerAddress);

                if (attemptedRole === 'reviewer' && !isReviewerAddress) {
                    console.log("Non-reviewer wallet trying to access reviewer role");
                    await logout();
                    toast.error('This wallet is not authorized as a reviewer. Please connect a reviewer wallet.');
                    localStorage.removeItem('attemptedRole');
                } else if (attemptedRole === 'submitter' && isReviewerAddress) {
                    console.log("Reviewer wallet trying to access submitter role");
                    await logout();
                    toast.error('This is a reviewer wallet. Please connect a different wallet for submitting reports.');
                    localStorage.removeItem('attemptedRole');
                } else if (attemptedRole) {
                    console.log("Role access granted");
                    toast.success(`Successfully logged in as ${attemptedRole}`);
                    localStorage.removeItem('attemptedRole');
                }
            }
        };

        checkRoleAccess();
    }, [authenticated, user?.wallet?.address, logout]);

    // Store the attempted role before initiating login
    const handleRoleCardClick = (role: 'reviewer' | 'submitter') => {
        console.log(`RoleCard clicked for ${role}`);
        localStorage.setItem('attemptedRole', role);
        handleRoleLogin(role);
    };

    const isReviewer = authenticated && user?.wallet?.address && 
        REVIEWER_ADDRESSES.includes(user.wallet.address.toLowerCase());

    const isSubmitter = authenticated && user?.wallet?.address && 
        !REVIEWER_ADDRESSES.includes(user.wallet.address.toLowerCase());

    return (
        <div className="min-h-screen flex flex-col bg-[#1A1B1E]">
            <Navbar />
            <div className="flex-1 container mx-auto px-4 py-12">
                {authenticated ? (
                    isReviewer ? (
                        <div className="text-center text-white">
                            <h2 className="text-3xl font-bold mb-4">Reviewer Dashboard</h2>
                            <p className="text-gray-400">Coming Soon</p>
                        </div>
                    ) : isSubmitter ? (
                        <SubmitterDashboard />
                    ) : (
                        <div className="text-center text-white">
                            <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
                            <p className="text-gray-400">
                                Please disconnect and connect with an appropriate wallet for your role.
                            </p>
                        </div>
                    )
                ) : (
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] bg-clip-text text-transparent">
                            Welcome to Watchdog
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-400 mb-12">
                            Your trusted platform for decentralized content review
                        </p>
                        
                        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                            <RoleCard
                                title="Login as Reviewer"
                                description="Review and validate submitted content. Only authorized reviewer wallets can access this role."
                                onClick={() => handleRoleCardClick('reviewer')}
                            />
                            <RoleCard
                                title="Login as Submitter"
                                description="Submit content for review. Reviewer wallets cannot access this role."
                                onClick={() => handleRoleCardClick('submitter')}
                            />
                        </div>
                        
                        <p className="mt-8 text-sm text-gray-500">
                            Note: Each wallet can only be used for one role. Reviewer wallets cannot submit reports.
                        </p>
                    </div>
                )}
            </div>
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
        className="group bg-[#2C2D31] p-6 rounded-lg border border-gray-800 hover:border-[#4ECDC4] transition-all duration-200 text-left"
    >
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <ArrowRightIcon className="w-5 h-5 text-[#4ECDC4] transform group-hover:translate-x-1 transition-transform" />
        </div>
        <p className="text-gray-400 text-sm">{description}</p>
    </button>
);
