import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/common/Navbar';
import EyeIcon from '@/public/assets/solar-eye-broken.png'
import CubeShape from '@/public/assets/heroicons-cube-transparent.png'
import ProgressDot from "@/public/assets/progress-dot.png"
import MissionGraphic from "@/public/assets/mission-section.png"
import RecoverSection from "@/public/assets/recover.png"
import EmpowerSection from "@/public/assets/empower.png"
import PreventSection from "@/public/assets/prevent.png"
import UpArrow from "@/public/assets/high.png"
import EqualSign from "@/public/assets/medium.png"
import DownArrow from "@/public/assets/low.png"
import ActionSection from "@/public/assets/action.png"
import SpiralImage from "@/public/assets/spiral.png"

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0A0B0C] text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="text-center py-16 px-4 relative">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-light mb-4">Welcome to Truence</h1>
                    <p className="text-gray-400">Introducing the Integrity of DAO Funds</p>
                </div>

                {/* Login Options */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
                    <div className="bg-[#1A1B1E]/50 p-6 rounded-lg backdrop-blur">
                        <h3 className="text-xl mb-2">Login as Reviewer</h3>
                        <p className="text-sm text-gray-400 mb-4">Review and validate submitted content. Only authorized reviewer wallets can access this role.</p>
                        <Link href="/reviewer-login" className="inline-block px-6 py-2 bg-[#4ECDC4] text-black rounded-lg hover:bg-[#4ECDC4]/90">
                            Login as Reviewer
                        </Link>
                    </div>
                    <div className="bg-[#1A1B1E]/50 p-6 rounded-lg backdrop-blur">
                        <h3 className="text-xl mb-2">Login as Submitter</h3>
                        <p className="text-sm text-gray-400 mb-4">Submit content for review. Reviewer wallets cannot access this role.</p>
                        <Link href="/submitter-login" className="inline-block px-6 py-2 bg-[#4ECDC4] text-black rounded-lg hover:bg-[#4ECDC4]/90">
                            Login as Submitter
                        </Link>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl mb-6">The Mission</h2>
                    <p className="text-gray-400 mb-8">The Arbitrum DAO has distributed over $50 million ARB tokens to fund ecosystem initiatives. However, there have been instances of misused tokens and we need accountability to ensure the long-term success of the DAO. The Truence Program incentivizes the community to protect DAO funds and to identify grant spending misuse or fraud.</p>
                    <Image
                        src={MissionGraphic}
                        alt="Mission Section Graphic"
                        width={400}
                        height={300}
                        className="mx-auto"
                    />
                </div>
            </section>

            {/* What is Truence Section */}
            <section className="py-16 px-4 bg-[#1A1B1E]/30">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl mb-12">What is Truence?</h2>
                    <p className="text-gray-400 mb-12 text-lg">Truence is a grant review bounty program designed to:</p>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="text-center flex flex-col items-center">
                            <div
                                className="w-32 h-32 rounded-full relative flex items-center justify-center mb-8 group hover:scale-105 transition-transform duration-300"
                                style={{
                                    background: '#09181B',
                                    boxShadow: 'inset 0px 4px 12px 0px rgba(255, 255, 255, 0.2)',
                                    border: '0.5px solid transparent',
                                    backgroundImage: 'linear-gradient(#09181B, #09181B), linear-gradient(90deg, #CCFFFD 0%, #000000 100%)',
                                    backgroundOrigin: 'border-box',
                                    backgroundClip: 'content-box, border-box',
                                }}
                            >
                                <div className="w-10 h-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                                    <Image
                                        src={EyeIcon}
                                        alt="Eye Icon"
                                        width={40}
                                        height={40}
                                    />
                                </div>
                            </div>
                            <p className="text-gray-300 text-lg max-w-sm">Incentivize community members to report misuse of DAO allocated funds to improve accountability within the DAO ecosystem</p>
                        </div>
                        <div className="text-center flex flex-col items-center">
                            <div
                                className="w-32 h-32 rounded-full relative flex items-center justify-center mb-8 group hover:scale-105 transition-transform duration-300"
                                style={{
                                    background: '#09181B',
                                    boxShadow: 'inset 0px 4px 12px 0px rgba(255, 255, 255, 0.2)',
                                    border: '0.5px solid transparent',
                                    backgroundImage: 'linear-gradient(#09181B, #09181B), linear-gradient(90deg, #CCFFFD 0%, #000000 100%)',
                                    backgroundOrigin: 'border-box',
                                    backgroundClip: 'content-box, border-box',
                                }}
                            >
                                <div className="w-10 h-10 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                                    <Image
                                        src={CubeShape}
                                        alt="Cube Shape"
                                        width={40}
                                        height={40}
                                    />
                                </div>
                            </div>
                            <p className="text-gray-300 text-lg max-w-sm">Deter malicious actors by introducing transparent consequences for fund mismanagement</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl mb-16 text-[#FFFAE0] font-light">How It Works</h2>
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
                        <div className="text-center relative">
                            <div className="flex items-center gap-2 justify-center mb-6">
                                <Image
                                    src={ProgressDot}
                                    alt="Progress Dot Indicator"
                                    width={6}
                                    height={6}
                                    className="opacity-90"
                                />
                                <span className="text-[#4ECDC4] text-sm font-light">Step 1</span>
                            </div>
                            <h4 className="text-2xl mb-4 font-light tracking-wide">Submit a Report</h4>
                            <p className="text-gray-400 text-base leading-relaxed max-w-xs mx-auto">
                                Confidentially report evidence-based misuse of DAO funds.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center relative">
                            <div className="flex items-center gap-2 justify-center mb-6">
                                <Image
                                    src={ProgressDot}
                                    alt="Progress Dot Indicator"
                                    width={6}
                                    height={6}
                                    className="opacity-90"
                                />
                                <span className="text-[#4ECDC4] text-sm font-light">Step 2</span>
                            </div>
                            <h4 className="text-2xl mb-4 font-light tracking-wide">Rewards</h4>
                            <p className="text-gray-400 text-base leading-relaxed max-w-xs mx-auto">
                                Earn ARB-based rewards for valid misuse reports, including a base payout and a share of recovered funds.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center relative">
                            <div className="flex items-center gap-2 justify-center mb-6">
                                <Image
                                    src={ProgressDot}
                                    alt="Progress Dot Indicator"
                                    width={6}
                                    height={6}
                                    className="opacity-90"
                                />
                                <span className="text-[#4ECDC4] text-sm font-light">Step 3</span>
                            </div>
                            <h4 className="text-2xl mb-4 font-light tracking-wide">Review Process</h4>
                            <p className="text-gray-400 text-base leading-relaxed max-w-xs mx-auto">
                                A trusted panel evaluates the report, determines severity (Low, Medium, High), and takes action.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Truence Matters Section */}
            <section className="py-16 px-4 bg-[#1A1B1E]/30">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl mb-12 text-[#FFFAE0] font-light">Why Truence Matters</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Recover Card */}
                        <div className="relative group">
                            <div className="relative overflow-hidden rounded-xl"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(6, 26, 34, 0.08) 47.74%, rgba(12, 75, 100, 0.2) 100%)',
                                    backdropFilter: 'blur(80px)',
                                    border: '1px solid transparent',
                                    borderImageSource: 'linear-gradient(180deg, rgba(130, 255, 244, 0.4) 0%, rgba(49, 133, 126, 0.4) 100%)',
                                    borderImageSlice: '1',
                                }}
                            >
                                <div className="p-6">
                                    <div className="mb-8 relative h-48 flex items-center justify-center">
                                        <Image
                                            src={RecoverSection}
                                            alt="Recover Misused Funds"
                                            width={200}
                                            height={200}
                                            className="object-contain transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <h3 className="text-xl font-light mb-3 text-[#4ECDC4]">Recover Misused Funds</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Strengthen DAO finances by identifying and recovering misallocated resources.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Prevent Card */}
                        <div className="relative group">
                            <div className="relative overflow-hidden rounded-xl"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(6, 26, 34, 0.08) 47.74%, rgba(12, 75, 100, 0.2) 100%)',
                                    backdropFilter: 'blur(80px)',
                                    border: '1px solid transparent',
                                    borderImageSource: 'linear-gradient(180deg, rgba(130, 255, 244, 0.4) 0%, rgba(49, 133, 126, 0.4) 100%)',
                                    borderImageSlice: '1',
                                }}
                            >
                                <div className="p-6">
                                    <div className="mb-8 relative h-48 flex items-center justify-center">
                                        <Image
                                            src={PreventSection}
                                            alt="Prevent Misconduct"
                                            width={200}
                                            height={200}
                                            className="object-contain transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <h3 className="text-xl font-light mb-3 text-[#4ECDC4]">Prevent Misconduct</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Transparent reporting and public accountability deter bad actors.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Empower Card */}
                        <div className="relative group">
                            <div className="relative overflow-hidden rounded-xl"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(6, 26, 34, 0.08) 47.74%, rgba(12, 75, 100, 0.2) 100%)',
                                    backdropFilter: 'blur(80px)',
                                    border: '1px solid transparent',
                                    borderImageSource: 'linear-gradient(180deg, rgba(130, 255, 244, 0.4) 0%, rgba(49, 133, 126, 0.4) 100%)',
                                    borderImageSlice: '1',
                                }}
                            >
                                <div className="p-6">
                                    <div className="mb-8 relative h-48 flex items-center justify-center">
                                        <Image
                                            src={EmpowerSection}
                                            alt="Empower the Community"
                                            width={200}
                                            height={200}
                                            className="object-contain transform group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <h3 className="text-xl font-light mb-3 text-[#4ECDC4]">Empower the Community</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Give contributors the tools and incentives to uphold the integrity of the Arbitrum ecosystem.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reward Structure Section */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl mb-6 text-[#FFFAE0] font-light">Reward Structure</h2>
                    <div className="bg-[#1A1B1E]/20 rounded-lg p-4 text-center mb-12">
                        <p className="text-gray-400 text-sm">Community members are rewarded based on the severity of the misuse</p>
                    </div>

                    <div className="relative flex justify-center items-center min-h-[500px]">
                        {/* Spiral Image in the center */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Image
                                src={SpiralImage}
                                alt="Reward Structure Spiral"
                                width={300}
                                height={500}
                                className="object-contain"
                            />
                        </div>

                        {/* High Severity - Top */}
                        <div className="absolute top-0 left-0 flex items-center gap-4">
                            <Image
                                src={UpArrow}
                                alt="Up Arrow"
                                width={24}
                                height={24}
                                className="opacity-80"
                            />
                            <div className="text-left">
                                <h3 className="text-xl font-light mb-2">High Severity</h3>
                                <p className="text-[#4ECDC4] text-2xl font-light">30,000 ARB + 5%</p>
                                <p className="text-sm text-gray-400">of recovered funds (capped at $100k)</p>
                            </div>
                        </div>

                        {/* Medium Severity - Middle Right */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-4">
                            <Image
                                src={EqualSign}
                                alt="Equal Sign"
                                width={24}
                                height={24}
                                className="opacity-80"
                            />
                            <div className="text-left">
                                <h3 className="text-xl font-light mb-2">Medium Severity</h3>
                                <p className="text-[#4ECDC4] text-2xl font-light">10,000 ARB + 5%</p>
                                <p className="text-sm text-gray-400">of recovered funds (capped at $50k)</p>
                            </div>
                        </div>

                        {/* Low Severity - Bottom */}
                        <div className="absolute bottom-0 left-0 flex items-center gap-4">
                            <Image
                                src={DownArrow}
                                alt="Down Arrow"
                                width={24}
                                height={24}
                                className="opacity-80"
                            />
                            <div className="text-left">
                                <h3 className="text-xl font-light mb-2">Low Severity</h3>
                                <p className="text-[#4ECDC4] text-2xl font-light">1,000 ARB + 5%</p>
                                <p className="text-sm text-gray-400">of recovered funds (capped at $10k)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-24 px-4 bg-[#1A1B1E]/30 relative">
                <div
                    className="max-w-4xl mx-auto relative"
                    style={{
                        background: 'linear-gradient(270.15deg, rgba(6, 26, 34, 0.312) -1.49%, rgba(26, 104, 136, 0.28) 99.87%)',
                        backdropFilter: 'blur(80px)',
                        borderRadius: '16px',
                        border: '1px solid white',
                    }}
                >
                    <div className="px-8 py-12 text-center relative z-10">
                        <h2 className="text-4xl mb-4 font-light tracking-wide">Ready to take action?</h2>
                        <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
                            Submit a report, help us recover misused funds, and earn your rewards! Together, we can ensure Arbitrum DAO funds are used for the betterment of the ecosystem.
                        </p>
                    </div>
                </div>
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={ActionSection}
                        alt="Background Action Image"
                        fill
                        className="object-cover opacity-50"
                        priority={false}
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 text-center text-gray-400 text-sm">
                <p>Copyright © 2024 Truence. All rights reserved.</p>
            </footer>
        </div>
    );
} 