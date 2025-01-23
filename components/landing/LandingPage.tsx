import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import EyeIcon from "@/public/assets/solar-eye-broken.png";
import CubeShape from "@/public/assets/heroicons-cube-transparent.png";
import MissionGraphic from "@/public/assets/mission-section.png";
import RecoverSection from "@/public/assets/recover.png";
import EmpowerSection from "@/public/assets/empower.png";
import PreventSection from "@/public/assets/prevent.png";
import SpiralImage from "@/public/assets/spiral.png";
import ActionSection from "@/public/assets/action.png";
import HeroBg from "@/public/assets/background.png";
import Arrow from "@/public/assets/arrow.png";
import { CircleDot } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { Equal } from "lucide-react";

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
        <div className="flex-1 flex items-center justify-center">
          <section className="w-full text-center relative z-10">
            <div className="w-[90%] mx-auto max-w-6xl">
              <h1
                className="text-6xl md:text-8xl font-light mb-4 font-primary tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] to-[#000000]"
                style={{
                  backgroundImage:
                    "linear-gradient(179.21deg, #FFFFFF 17.3%, #000000 168.94%)",
                }}
              >
                Welcome to Truence
              </h1>
              <div
                className="rounded-full px-8 py-3 inline-block mb-16"
                style={{
                  border: "0.5px solid #FAFFC8A6",
                  background: "#00000052",
                  boxShadow: "0px 4px 29.8px 0px #FFFFFF33 inset",
                  backdropFilter: "blur(20px)", // Optional if needed
                }}
              >
                <p className="text-[#FFFAD1] text-sm">
                  Protecting the Integrity of DAO Funds
                </p>
              </div>

              {/* Login Options */}
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {["reviewer", "submitter"].map((role) => (
                  <div
                    key={role}
                    onClick={() =>
                      onRoleSelect(role as "reviewer" | "submitter")
                    }
                    className="rounded-lg overflow-hidden relative cursor-pointer group"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(6, 26, 34, 0.4) 0%, rgba(12, 75, 100, 0.2) 100%)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#4ECDC4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="p-8 text-left relative">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl text-[#B0E9FF] font-medium">
                          Login as{" "}
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </h3>
                        <div className="text-gray-400 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300">
                          <Image src={Arrow} alt="Arrow Icon" />
                        </div>
                      </div>
                      <p className="text-[#ffffff] text-sm mb-6 leading-relaxed">
                        {role === "reviewer"
                          ? "Review and validate submitted content. Only authorized reviewer wallets can access this role."
                          : "Submit content for review. Reviewer wallets cannot access this role."}
                      </p>
                      <div className="absolute bottom-0 right-0 w-24 h-24 opacity-10">
                        <Image
                          src={role === "reviewer" ? EyeIcon : CubeShape}
                          alt={`${role} icon`}
                          width={96}
                          height={96}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Note text */}
              <p className="text-[#CDFFFA] text-sm mt-6">
                Note: Each wallet can only be used for one role. Reviewer
                wallets cannot submit reports.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-24 px-4 relative bg-gradient-to-b from-[#000203] to-[#011116]">
        <div className="w-[90%] mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2">
              <h2
                className="text-4xl sm:text-5xl mb-6 font-primary font-light text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(179.48deg, #FBFCA4 17.14%, #FFFFFF 135.08%)",
                }}
              >
                The Mission
              </h2>
              <p className="text-[#ffffff] text-lg leading-relaxed">
                The Arbitrum DAO has distributed over $50 million ARB tokens to
                fund ecosystem initiatives. However, there have been instances
                of misused tokens and we need accountability to ensure the
                long-term success of the DAO. The Truence Program incentivizes
                the community to protect DAO funds and to identify grant
                spending misuse or fraud.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-[400px] aspect-square">
                <Image
                  src={MissionGraphic || "/placeholder.svg"}
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
      <section className="py-24 px-4 bg-[#000203]">
        <div className="w-[90%] mx-auto max-w-6xl">
          <h2
            className="text-4xl sm:text-5xl mb-6 font-primary font-light text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(179.48deg, #C3FEF8 17.14%, #D8D8D8 117.32%)",
            }}
          >
            What is Truence ?
          </h2>
          <p className="text-[#ffffff] mb-16 text-lg">
            Truence is a grant misuse bounty program designed to:
          </p>
          <div className="grid md:grid-cols-2 gap-16">
            {[
              {
                icon: EyeIcon,
                text: "Incentivize community members to report misuse of DAO-allocated funds. Strengthen accountability within the DAO ecosystem.",
              },
              {
                icon: CubeShape,
                text: "Deter malicious actors by introducing transparent consequences for fund mismanagement.",
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-start">
                <div
                  className="w-24 h-24 rounded-full relative flex items-center justify-center mb-8 group bg-gradient-to-b from-[rgba(6,26,34,0.08)] to-[rgba(12,75,100,0.2)] backdrop-blur-xl"
                  style={{
                    border: "0.5px solid #CCFFFD",
                    background: "#09181B",
                    boxShadow: "0px 4px 12px 0px #FFFFFF33 inset",
                  }}
                >
                  <div className="w-8 h-8 opacity-90">
                    <Image
                      src={item.icon || "/placeholder.svg"}
                      alt="Icon"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                </div>
                <p className="text-[#ffffff] text-lg leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-[#000203]">
        <div className="w-[90%] mx-auto max-w-6xl">
          <h2
            className="text-4xl sm:text-5xl mb-24 font-light font-primary bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(179.48deg, #FBFCA4 17.14%, #FFFFFF 135.08%)",
            }}
          >
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-16 relative">
            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-[22px] w-full">
              <div
                className="absolute left-[33%] right-[67%] h-[2px]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(78, 205, 196, 0.2) 0%, #4ECDC4 100%)",
                  boxShadow: "0 0 20px rgba(78, 205, 196, 0.4)",
                }}
              ></div>
              <div
                className="absolute left-[67%] right-[33%] h-[2px]"
                style={{
                  background:
                    "linear-gradient(90deg, #4ECDC4 0%, rgba(78, 205, 196, 0.2) 100%)",
                  boxShadow: "0 0 20px rgba(78, 205, 196, 0.4)",
                }}
              ></div>
            </div>

            {[
              {
                step: "Step 1",
                title: "Submit a Report",
                description:
                  "Confidentially report evidence-based misuse of DAO funds.",
              },
              {
                step: "Step 2",
                title: "Rewards",
                description:
                  "Earn ARB-based rewards for valid misuse reports, including a base payout and a share of recovered funds.",
              },
              {
                step: "Step 3",
                title: "Review Process",
                description:
                  "A trusted panel evaluates the report, determines severity (Low, Medium, High), and takes action.",
              },
            ].map((item, index) => (
              <div key={index} className="text-left relative">
                <div className="justify-center content-center">
                <span className="text-[#ffffff] text-lg font-light mb-6 block">
                < CircleDot className="inline-block mr-[1rem] text-[#FBFCA4]"/>
                  {item.step}
                </span>
                </div>
                <h4
                  className="text-2xl mb-4 font-light bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(179.48deg, #FBFCA4 17.14%, #FFFFFF 135.08%)",
                  }}
                >
                  {item.title}
                </h4>
                <p className="text-[#ffffff] text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Truence Matters Section */}
      <section className="py-24 px-4 bg-[#000203]">
        <div className="w-[90%] mx-auto max-w-6xl">
          <h2
            className="text-4xl sm:text-5xl mb-12 font-light font-primary text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(179.48deg, #C3FEF8 17.14%, #D8D8D8 117.32%)",
            }}
          >
            Why Truence Matters
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image: RecoverSection,
                title: "Recover Misused Funds",
                description:
                  "Strengthen DAO finances by identifying and recovering misallocated resources.",
              },
              {
                image: PreventSection,
                title: "Prevent Misconduct",
                description:
                  "Transparent reporting and public accountability deter bad actors.",
              },
              {
                image: EmpowerSection,
                title: "Empower the Community",
                description:
                  "Give contributors the tools and incentives to uphold the integrity of the Arbitrum ecosystem.",
              },
            ].map((card, index) => (
              <div key={index} className="relative">
                <div className="rounded-lg p-6 bg-gradient-to-b from-[rgba(6,26,34,0.08)] to-[rgba(12,75,100,0.2)] backdrop-blur-xl border border-[#4ECDC4]/20">
                  <div className="mb-8 relative h-48 flex items-center justify-center">
                    <Image
                      src={card.image || "/placeholder.svg"}
                      alt={card.title}
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-[#B0E9FF] text-xl font-light mb-3">
                    {card.title}
                  </h3>
                  <p className="text-[#ffffff] text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reward Structure Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#000203] to-[#011116]">
        <div className="w-[90%] mx-auto max-w-6xl">
          <h2
            className="text-4xl sm:text-5xl mb-4 text-[#FFFAE0] font-light font-primary text-center bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(179.48deg, #FBFCA4 17.14%, #FFFFFF 135.08%)",
            }}
          >
            Reward Structure
          </h2>
          <div className="flex justify-center items-center">
            <div
              className="bg-[#1A1B1E]/30 rounded-full px-8 py-3 inline-block mb-16 border border-[#4ECDC4]/10"
              style={{
                background: "#00000052",
                border: "0.5px solid #FAFFC8A6",
                boxShadow: "0px 4px 29.8px 0px #FFFFFF33 inset",
              }}
            >
              <p className="text-[#FFFAD1] text-sm">
                Community members are rewarded based on the severity of the
                misuse
              </p>
            </div>
          </div>
          <div className="relative flex justify-center items-center min-h-[600px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={SpiralImage || "/placeholder.svg"}
                alt="Reward Structure Spiral"
                width={400}
                height={600}
                className="object-contain"
              />
            </div>

            {[
              {
                position: "top-12 left-0",
                icon: ChevronUp,
                title: "High Severity",
                reward: "30,000 ARB + 5%",
                cap: "of recovered funds (capped at $100k)",
              },
              {
                position: "right-0 top-1/2 -translate-y-1/2",
                icon: Equal,
                title: "Medium Severity",
                reward: "10,000 ARB + 5%",
                cap: "of recovered funds (capped at $50k)",
              },
              {
                position: "bottom-12 left-0",
                icon: ChevronDown,
                title: "Low Severity",
                reward: "1,000 ARB + 5%",
                cap: "of recovered funds (capped at $10k)",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`absolute ${item.position} flex flex-col items-start justify-center gap-2`}
              >
                <div className="w-8 h-8 flex items-center justify-center bg-[#00000052] border-0.5 border-solid rounded-full border-[#FAFFC8A6] shadow-[0px_4px_29.8px_0px_#FFFFFF33_inset]">
                  <item.icon className="text-[#4ECDC4]" width={20} height={20} />
                </div>
                <div className="text-left">
                  <h3
                    className="text-lg font-light mb-1 text-transparent bg-clip-text"
                    style={{
                      backgroundImage:
                        "linear-gradient(179.48deg, #FBFCA4 17.14%, #FFFFFF 135.08%)",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[#ffffff] text-xl font-light mb-1">
                    {item.reward}
                  </p>
                  <p className="text-xs text-[#ffffff]">{item.cap}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-4">
        <div className="w-[90%] max-w-4xl mx-auto relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] opacity-80 pointer-events-none">
            <Image
              src={ActionSection || "/placeholder.svg"}
              alt="Action Section"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div
            className="rounded-2xl overflow-hidden relative"
            style={{
              background:
                "linear-gradient(270.15deg, rgba(6, 26, 34, 0.312) -1.49%, rgba(26, 104, 136, 0.28) 99.87%)",
              border: "1px solid #82FFF466",
              backdropFilter: "blur(1.5rem)",
            }}
          >
            <div className="px-8 py-12 text-center relative bg-gradient-to-b from-[rgba(6,26,34,0.05)] to-[rgba(12,75,100,0.025)]">
              <h2 className="text-4xl sm:text-5xl mb-4 font-light text-[#B0E9FF]">
                Ready to take action?
              </h2>
              <p className="text-[#ffffff] text-lg max-w-2xl mx-auto">
                Submit a report, help us recover misused funds, and earn your
                rewards! Together, we can ensure Arbitrum DAO funds are used for
                the betterment of the ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Updated Footer */}
      <footer className="py-8 px-4 text-center">
        <p className="text-gray-600 text-sm">
          Copyright © 2024 Truence. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
