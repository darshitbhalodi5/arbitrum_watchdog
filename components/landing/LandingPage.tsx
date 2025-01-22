import Image from 'next/image';
import Navbar from '@/components/common/Navbar';
import EyeIcon from '@/public/assets/solar-eye-broken.png'
import CubeShape from '@/public/assets/heroicons-cube-transparent.png'
import MissionGraphic from "@/public/assets/mission-section.png"
import RecoverSection from "@/public/assets/recover.png"
import EmpowerSection from "@/public/assets/empower.png"
import PreventSection from "@/public/assets/prevent.png"
import UpArrow from "@/public/assets/high.png"
import EqualSign from "@/public/assets/medium.png"
import DownArrow from "@/public/assets/low.png"
import SpiralImage from "@/public/assets/spiral.png"
import ActionSection from "@/public/assets/action.png"
import HeroBg from "@/public/assets/background.png"

interface LandingPageProps {
    onRoleSelect: (role: "reviewer" | "submitter") => void;
}

export default function LandingPage({ onRoleSelect }: LandingPageProps) {
    return (
        <div className="min-h-screen bg-[#0A0B0C] text-white font-secondary">
            {/* Hero Section with Navbar - Full Height */}
            <div className="h-screen relative flex flex-col">
                {/* Background Image for Hero */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={HeroBg}
                        alt="Hero Background"
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                </div>

                {/* Navbar */}
                <div className="relative z-10">
                    <Navbar />
                </div>

                {/* Hero Content - Centered */}
                <div className="flex-1 flex items-center">
                    <section className="w-full text-center relative z-10">
                        <div className="w-[90%] mx-auto">
                            <h1 className="text-6xl md:text-7xl font-light mb-4 font-primary tracking-wide">Welcome to Truence</h1>
                            <div className="bg-[#1A1B1E]/50 rounded-full px-6 py-2 inline-block mb-16">
                                <p className="text-gray-400 text-sm">Protecting the Integrity of DAO Funds</p>
                            </div>

                            {/* Login Options */}
                            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                <div
                                    onClick={() => onRoleSelect("reviewer")}
                                    className="rounded-lg overflow-hidden relative"
                                    style={{
                                        background: 'linear-gradient(180deg, rgba(6, 26, 34, 0.2) 0%, rgba(12, 75, 100, 0.1) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        WebkitBackdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(130, 255, 244, 0.1)',
                                    }}
                                >
                                    <div
                                        className="p-8 text-left"
                                        style={{
                                            background: 'linear-gradient(180deg, rgba(6, 26, 34, 0.05) 0%, rgba(12, 75, 100, 0.025) 100%)',
                                        }}
                                    >
                                        <h3 className="text-xl mb-3 font-light">Login as Reviewer</h3>
                                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">Review and validate submitted content. Only authorized reviewer wallets can access this role.</p>
                                    </div>
                                </div>

                                <div
                                    onClick={() => onRoleSelect("submitter")}
                                    className="rounded-lg overflow-hidden relative"
                                    style={{
                                        background: 'linear-gradient(180deg, rgba(6, 26, 34, 0.2) 0%, rgba(12, 75, 100, 0.1) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        WebkitBackdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(130, 255, 244, 0.1)',
                                    }}
                                >
                                    <div
                                        className="p-8 text-left"
                                        style={{
                                            background: 'linear-gradient(180deg, rgba(6, 26, 34, 0.05) 0%, rgba(12, 75, 100, 0.025) 100%)',
                                        }}
                                    >
                                        <h3 className="text-xl mb-3 font-light">Login as Submitter</h3>
                                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">Submit content for review. Reviewer wallets cannot access this role.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Note text */}
                            <p className="text-gray-400 text-sm mt-6">Note: Each wallet can only be used for one role. Reviewer wallets cannot submit reports.</p>
                        </div>
                    </section>
                </div>
            </div>

            {/* Mission Section */}
            <section className="py-8 sm:py-12 px-4 relative">
                <div className="w-[90%] mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="md:w-[45%]">
                            <h2 className="text-3xl sm:text-4xl mb-4 sm:mb-6 font-primary font-light text-[#FFFAE0]">The Mission</h2>
                            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                                The Arbitrum DAO has distributed over $50 million ARB tokens to fund ecosystem initiatives. However, there have been instances of misused tokens and we need accountability to ensure the long-term success of the DAO. The Truence Program incentivizes the community to protect DAO funds and to identify grant spending misuse or fraud.
                            </p>
                        </div>
                        <div className="md:w-[45%] flex justify-center">
                            <div className="relative w-[280px] sm:w-[320px] md:w-[360px] aspect-square">
                                <Image
                                    src={MissionGraphic}
                                    alt="Mission Section Graphic"
                                    fill
                                    className="object-contain transform hover:scale-105 transition-transform duration-500"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What is Truence Section */}
            <section className="py-8 sm:py-12 px-4 bg-[#0A0B0C]">
                <div className="w-[90%] mx-auto">
                    <h2 className="text-3xl sm:text-4xl mb-4 font-primary font-light text-[#4ECDC4]">What is Truence ?</h2>
                    <p className="text-gray-400 mb-16 text-base">Truence is a grant misuse bounty program designed to:</p>
                    <div className="grid md:grid-cols-2 gap-16 md:gap-24">
                        <div className="flex flex-col items-start">
                            <div
                                className="w-24 h-24 rounded-full relative flex items-center justify-center mb-8 group"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(6, 26, 34, 0.08) 0%, rgba(12, 75, 100, 0.2) 100%)',
                                    backdropFilter: 'blur(80px)',
                                    border: '1px solid transparent',
                                    borderImage: 'linear-gradient(180deg, rgba(130, 255, 244, 0.4) 0%, rgba(49, 133, 126, 0.4) 100%) 1',
                                    boxShadow: 'inset 0px 4px 12px 0px rgba(78, 205, 196, 0.1)',
                                }}
                            >
                                <div className="w-8 h-8 opacity-90">
                                    <Image
                                        src={EyeIcon}
                                        alt="Eye Icon"
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                            <p className="text-gray-400 text-base leading-relaxed">
                                Incentivize community members to report misuse of DAO-allocated funds.Strengthen accountability within the DAO ecosystem.
                            </p>
                        </div>
                        <div className="flex flex-col items-start">
                            <div
                                className="w-24 h-24 rounded-full relative flex items-center justify-center mb-8 group"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(6, 26, 34, 0.08) 0%, rgba(12, 75, 100, 0.2) 100%)',
                                    backdropFilter: 'blur(80px)',
                                    border: '1px solid transparent',
                                    borderImage: 'linear-gradient(180deg, rgba(130, 255, 244, 0.4) 0%, rgba(49, 133, 126, 0.4) 100%) 1',
                                    boxShadow: 'inset 0px 4px 12px 0px rgba(78, 205, 196, 0.1)',
                                }}
                            >
                                <div className="w-8 h-8 opacity-90">
                                    <Image
                                        src={CubeShape}
                                        alt="Cube Shape"
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                            <p className="text-gray-400 text-base leading-relaxed">
                                Deter malicious actors by introducing transparent consequences for fund mismanagement.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-8 sm:py-12 px-4">
                <div className="w-[90%] mx-auto">
                    <h2 className="text-3xl sm:text-4xl mb-16 text-[#FFFAE0] font-light font-primary">How It Works</h2>
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting Lines */}
                        <div className="hidden md:block absolute top-[22px] w-full">
                            {/* Line between Step 1 and 2 */}
                            <div className="absolute left-[calc(33%+60px)] right-[calc(50%+10px)] h-[2px]"
                                style={{
                                    background: 'linear-gradient(90deg, rgba(78, 205, 196, 0) 0%, #4ECDC4 100%)',
                                    boxShadow: '0 0 8px rgba(78, 205, 196, 0.6)',
                                }}
                            ></div>
                            {/* Line between Step 2 and 3 */}
                            <div className="absolute left-[calc(66%-60px)] right-[calc(33%-10px)] h-[2px]"
                                style={{
                                    background: 'linear-gradient(90deg, #4ECDC4 0%, rgba(78, 205, 196, 0) 100%)',
                                    boxShadow: '0 0 8px rgba(78, 205, 196, 0.6)',
                                }}
                            ></div>
                        </div>

                        {/* Step 1 */}
                        <div className="text-left relative">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[#4ECDC4] text-sm font-light">Step 1</span>
                            </div>
                            <h4 className="text-xl mb-3 font-light">Submit a Report</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Confidentially report evidence-based misuse of DAO funds.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-left relative">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[#4ECDC4] text-sm font-light">Step 2</span>
                            </div>
                            <h4 className="text-xl mb-3 font-light">Rewards</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Earn ARB-based rewards for valid misuse reports, including a base payout and a share of recovered funds.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-left relative">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[#4ECDC4] text-sm font-light">Step 3</span>
                            </div>
                            <h4 className="text-xl mb-3 font-light">Review Process</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                A trusted panel evaluates the report, determines severity (Low, Medium, High), and takes action.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Truence Matters Section */}
            <section className="py-8 sm:py-12 px-4 bg-[#0A0B0C]">
                <div className="w-[90%] mx-auto">
                    <h2 className="text-3xl sm:text-4xl mb-12 text-[#FFFAE0] font-light font-primary">Why Truence Matters</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Recover Card */}
                        <div className="relative">
                            <div
                                className="rounded-lg p-6"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(6, 26, 34, 0.08) 47.74%, rgba(12, 75, 100, 0.2) 100%)',
                                    backdropFilter: 'blur(80px)',
                                    border: '1px solid transparent',
                                    borderImage: 'linear-gradient(180deg, rgba(130, 255, 244, 0.4) 0%, rgba(49, 133, 126, 0.4) 100%) 1',
                                }}
                            >
                                <div className="mb-8 relative h-48 flex items-center justify-center">
                                    <Image
                                        src={RecoverSection}
                                        alt="Recover Misused Funds"
                                        width={200}
                                        height={200}
                                        className="object-contain"
                                    />
                                </div>
                                <h3 className="text-[#4ECDC4] text-xl font-light mb-3">Recover Misused Funds</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Strengthen DAO finances by identifying and recovering misallocated resources.
                                </p>
                            </div>
                        </div>

                        {/* Prevent Card */}
                        <div className="relative">
                            <div
                                className="rounded-lg p-6"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(6, 26, 34, 0.08) 47.74%, rgba(12, 75, 100, 0.2) 100%)',
                                    backdropFilter: 'blur(80px)',
                                    border: '1px solid transparent',
                                    borderImage: 'linear-gradient(180deg, rgba(130, 255, 244, 0.4) 0%, rgba(49, 133, 126, 0.4) 100%) 1',
                                }}
                            >
                                <div className="mb-8 relative h-48 flex items-center justify-center">
                                    <Image
                                        src={PreventSection}
                                        alt="Prevent Misconduct"
                                        width={200}
                                        height={200}
                                        className="object-contain"
                                    />
                                </div>
                                <h3 className="text-[#4ECDC4] text-xl font-light mb-3">Prevent Misconduct</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Transparent reporting and public accountability deter bad actors.
                                </p>
                            </div>
                        </div>

                        {/* Empower Card */}
                        <div className="relative">
                            <div
                                className="rounded-lg p-6"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(6, 26, 34, 0.08) 47.74%, rgba(12, 75, 100, 0.2) 100%)',
                                    backdropFilter: 'blur(80px)',
                                    border: '1px solid transparent',
                                    borderImage: 'linear-gradient(180deg, rgba(130, 255, 244, 0.4) 0%, rgba(49, 133, 126, 0.4) 100%) 1',
                                }}
                            >
                                <div className="mb-8 relative h-48 flex items-center justify-center">
                                    <Image
                                        src={EmpowerSection}
                                        alt="Empower the Community"
                                        width={200}
                                        height={200}
                                        className="object-contain"
                                    />
                                </div>
                                <h3 className="text-[#4ECDC4] text-xl font-light mb-3">Empower the Community</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Give contributors the tools and incentives to uphold the integrity of the Arbitrum ecosystem.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reward Structure Section */}
            <section className="py-8 sm:py-12 px-4">
                <div className="w-[90%] mx-auto">
                    <h2 className="text-4xl mb-4 text-[#FFFAE0] font-light font-primary">Reward Structure</h2>
                    <div className="bg-[#1A1B1E]/50 rounded-full px-6 py-2 inline-block mb-16">
                        <p className="text-gray-400 text-sm">Community members are rewarded based on the severity of the misuse</p>
                    </div>

                    <div className="relative flex justify-center items-center min-h-[600px]">
                        {/* Spiral Image in the center */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Image
                                src={SpiralImage}
                                alt="Reward Structure Spiral"
                                width={400}
                                height={600}
                                className="object-contain"
                            />
                        </div>

                        {/* High Severity - Top */}
                        <div className="absolute top-12 left-0 flex items-start gap-2">
                            <Image
                                src={UpArrow}
                                alt="Up Arrow"
                                width={20}
                                height={20}
                                className="mt-1"
                            />
                            <div className="text-left">
                                <h3 className="text-lg font-light mb-1">High Severity</h3>
                                <p className="text-[#4ECDC4] text-xl font-light mb-1">30,000 ARB + 5%</p>
                                <p className="text-xs text-gray-400">of recovered funds (capped at $100k)</p>
                            </div>
                        </div>

                        {/* Medium Severity - Middle Right */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-start gap-2">
                            <Image
                                src={EqualSign}
                                alt="Equal Sign"
                                width={20}
                                height={20}
                                className="mt-1"
                            />
                            <div className="text-left">
                                <h3 className="text-lg font-light mb-1">Medium Severity</h3>
                                <p className="text-[#4ECDC4] text-xl font-light mb-1">10,000 ARB + 5%</p>
                                <p className="text-xs text-gray-400">of recovered funds (capped at $50k)</p>
                            </div>
                        </div>

                        {/* Low Severity - Bottom */}
                        <div className="absolute bottom-12 left-0 flex items-start gap-2">
                            <Image
                                src={DownArrow}
                                alt="Down Arrow"
                                width={20}
                                height={20}
                                className="mt-1"
                            />
                            <div className="text-left">
                                <h3 className="text-lg font-light mb-1">Low Severity</h3>
                                <p className="text-[#4ECDC4] text-xl font-light mb-1">1,000 ARB + 5%</p>
                                <p className="text-xs text-gray-400">of recovered funds (capped at $10k)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 sm:py-24 px-4">
                <div className="w-[90%] max-w-4xl mx-auto relative">
                    {/* Image positioned to overlap the card */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] opacity-80 pointer-events-none">
                        <Image
                            src={ActionSection}
                            alt="Action Section"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    <div
                        className="rounded-2xl overflow-hidden relative"
                        style={{
                            background: 'linear-gradient(180deg, rgba(6, 26, 34, 0.2) 0%, rgba(12, 75, 100, 0.1) 100%)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(130, 255, 244, 0.1)',
                        }}
                    >
                        <div
                            className="px-8 py-12 text-center relative"
                            style={{
                                background: 'linear-gradient(180deg, rgba(6, 26, 34, 0.05) 0%, rgba(12, 75, 100, 0.025) 100%)',
                            }}
                        >
                            <h2 className="text-3xl sm:text-4xl mb-4 font-light text-white">Ready to take action?</h2>
                            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
                                Submit a report, help us recover misused funds, and earn your rewards! Together, we can ensure Arbitrum DAO funds are used for the betterment of the ecosystem.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 text-center text-gray-400 text-sm">
                <p>Copyright © 2024 Truence. All rights reserved.</p>
            </footer>
        </div>
    );
} 