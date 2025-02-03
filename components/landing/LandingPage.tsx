import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import EyeIcon from "@/public/assets/solar-eye-broken.png";
import CubeShape from "@/public/assets/heroicons-cube-transparent.png";
import MissionGraphic from "@/public/assets/mission-section.png";
import RecoverSection from "@/public/assets/recover.svg";
import EmpowerSection from "@/public/assets/empower.svg";
import PreventSection from "@/public/assets/prevent.svg";
import SpiralImage from "@/public/assets/spiral.png";
import ActionSection from "@/public/assets/action.png";
import HeroBg from "@/public/assets/background.svg";
import Arrow from "@/public/assets/arrow.png";
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { Equal } from "lucide-react";
import { LandingPageProps } from "@/types/landingpage";

export default function LandingPage({ onRoleSelect }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#000000] text-white font-secondary">
      {/* Hero Section with Navbar - Full Height */}
      <div className="relative flex flex-col">
        {/* Background Image for Hero */}
        <div className="absolute top-[-150px] h-auto sm:h-[900px] w-full">
          <Image
            src={HeroBg}
            alt="Hero Background"
            className="object-contain opacity-50"
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
            <div className="w-[90%] mx-auto">
              <h1 className="text-4xl sm:text-7xl lg:text-8xl xl:text-9xl mt-12 mb-4 font-primary font-medium tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-[#ffffff] from-[17.3%] to-[168.94%] to-[#000000]">
                Welcome to Truence
              </h1>
              <div className="rounded-full text-xs sm:text-base px-4 py-2 sm:px-12 sm:py-3 inline-block mb-16 text-[#FFFAD1] font-secondary tracking-wide border-[0.5px] border-[#FAFFC8A6] bg-[#00000052] shadow-[inset_0px_4px_29.8px_0px_#FFFFFF33] backdrop-blur-[20px]">
                Protecting the Integrity of DAO Funds
              </div>

              {/* Login Options */}
              <div className="grid md:grid-cols-2 gap-6 mx-auto">
                {["reviewer", "submitter"].map((role) => (
                  <div
                    key={role}
                    onClick={() =>
                      onRoleSelect(role as "reviewer" | "submitter")
                    }
                    className="rounded-lg overflow-hidden relative cursor-pointer group bg-[#020C1099] border border-[#82FFF466]"
                    style={{
                      backdropFilter: "blur(80px)",
                      boxShadow: "0px 4px 50.5px 0px #96F1FF21 inset",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#4ECDC4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="py-5 px-8 sm:py-7 sm:px-14 lg:py-10 lg:px-20 text-left relative">
                      <div className="flex items-center justify-start gap-4 mb-3">
                        <h3 className="text-3xl text-[#B0E9FF] font-primary font-medium mb-3">
                          Login as{" "}
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </h3>
                        <div className="text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-6 transition-transform duration-300">
                          <Image
                            src={Arrow}
                            alt="Arrow Icon"
                            className="w-[25px] h-auto"
                          />
                        </div>
                      </div>
                      <p className="text-[#ffffff] text-base leading-relaxed font-secondary">
                        {role === "reviewer"
                          ? "Review and validate submitted content. Only authorized reviewer wallets can access this role."
                          : "Submit content for review. Reviewer wallets cannot access this role."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Note text */}
              <p className="text-[#CDFFFA] text-sm mt-6 font-secondary">
                Note: Each wallet can only be used for one role. Reviewer
                wallets cannot submit reports.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Mission Section */}
      <section className="p-4 relative overflow-x-hidden mt-[50px] md:mt-0">
        <div className="w-[90%] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-12">
            <div className="w-full md:w-[70%] lg:w-1/2">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 font-primary font-medium text-transparent bg-clip-text bg-gradient-to-br from-[#FBFCA4] from-[17.14%] to-[#FFFFFF] to-[135.08%]">
                The Mission
              </h2>
              <p className="text-[#ffffff] text-sm md:text-base lg:text-lg leading-relaxed">
                The Arbitrum DAO has distributed over $50 million ARB tokens to
                fund ecosystem initiatives. However, there have been instances
                of misused tokens and we need accountability to ensure the
                long-term success of the DAO. The Truence Program incentivizes
                the community to protect DAO funds and to identify grant
                spending misuse or fraud.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center relative w-full h-[500px] md:h-[400px] lg:h-[500px] xl:h-[700px] md:mr-[-100px]">
              <Image
                src={MissionGraphic || "/placeholder.svg"}
                alt="Mission Section Graphic"
                fill
                className="w-auto h-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* What is Truence Section */}
      <section className="p-4">
        <div className="w-[90%] mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 font-primary font-medium text-transparent bg-clip-text bg-gradient-to-br from-[#C3FEF8] from-[17.14%] to-[#D8D8D8] to-[135.08%]">
            What is Truence ?
          </h2>
          <p className="text-[#ffffff] mb-16 text-sm sm:text-lg leading-relaxed">
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
              <div key={index} className="flex flex-col items-start w-full md:w-[340px] lg:w-[440px] xl:w-[500px]">
                <div
                  className="w-16 h-16 rounded-full relative flex items-center justify-center mb-8 group bg-gradient-to-b from-[rgba(6,26,34,0.08)] to-[rgba(12,75,100,0.2)] backdrop-blur-xl"
                  style={{
                    border: "0.5px solid #CCFFFD",
                    background: "#09181B",
                    boxShadow: "0px 4px 12px 0px #FFFFFF33 inset",
                  }}
                >
                  <div className="w-8 h-8 opacity-90 flex items-center justify-center">
                    <Image
                      src={item.icon || "/placeholder.svg"}
                      alt="Icon"
                      width={32}
                      height={32}
                    />
                  </div>
                </div>
                <p className="text-[#ffffff] text-xs sm:text-sm lg:text-base leading-relaxed text-wrap">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-4">
        <div className="w-[90%] h-full mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-6 mb-14 font-primary font-medium text-transparent bg-clip-text bg-gradient-to-br from-[#FBFCA4] from-[17.14%] to-[#FFFFFF] to-[135.08%]">
            How It Works
          </h2>
          <div className="relative">
            <div className="hidden md:flex w-[14%] lg:w-[17%] xl:w-[20%] h-[1px] bg-white absolute top-[12px] left-[20%] lg:left-[17%] xl:left-[14%] bg-gradient-to-r from-[#000000] via-[#FBFCAF] to-[#000000]"></div>
            <div className="hidden md:flex w-[14%] lg:w-[17%] xl:w-[20%] h-[1px] bg-white absolute top-[12px] left-[56%] lg:left-[52%] xl:left-[49%] bg-gradient-to-r from-[#000000] via-[#FBFCAF] to-[#000000]"></div>

            <div className="grid md:grid-cols-3 gap-16 relative">
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
                <div key={index} className="text-left px-4">
                  <div className="flex items-center justify-start gap-4 mb-8">
                    <div className="w-[25px] h-[25px] border-[0.5px] border-[#FAFCA3] rounded-full flex items-center justify-center">
                      <div className="w-[13px] h-[13px] bg-[#FAFCA3] rounded-full"></div>
                    </div>
                    <span className="text-[#ffffff] text-lg">{item.step}</span>
                  </div>

                  <h4 className="text-xl sm:text-3xl mb-6 font-primary font-medium text-transparent bg-clip-text bg-gradient-to-br from-[#FBFCA4] from-[17.14%] to-[#FFFFFF] to-[135.08%]">
                    {item.title}
                  </h4>
                  <p className="text-[#ffffff] text-xs sm:text-sm lg:text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Truence Matters Section */}
      <section className="py-4 px-4">
        <div className="w-[90%] mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl my-10 font-primary font-medium text-transparent bg-clip-text bg-gradient-to-br from-[#C3FEF8] from-[17.14%] to-[#D8D8D8] to-[135.08%]">
            Why Truence Matters
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 h-max">
            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-b from-[rgba(6,26,34,0.08)] to-[rgba(12,75,100,0.2)] backdrop-blur-xl border border-[#4ECDC4]/20 overflow-hidden h-full">
                <div className="flex items-start justify-start ml-[-180px]">
                  <Image
                    src={RecoverSection}
                    alt="Recover Misused Funds"
                    className="h-[120px] md:h-[150px] lg:h-[170px] xl:h-[200px]"
                  />
                </div>
                <div className="p-6 lg:px-10 lg:py-8 xl:px-14 xl:py-10">
                  <h3 className="text-[#B0E9FF] text-2xl md:text-3xl font-light mb-3">
                    Recover
                    <br /> Misused Funds
                  </h3>
                  <p className="text-[#ffffff] text-xs sm:text-sm leading-relaxed tracking-wide">
                    Strengthen DAO finances by identifying and recovering
                    misallocated resources.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-b from-[rgba(6,26,34,0.08)] to-[rgba(12,75,100,0.2)] backdrop-blur-xl border border-[#4ECDC4]/20 overflow-hidden h-full">
                <div className="flex items-start justify-start">
                  <Image
                    src={PreventSection}
                    alt="Prevent Misconduct"
                    className="h-[120px] md:h-[150px] lg:h-[170px] xl:h-[200px]"
                  />
                </div>
                <div className="p-6 lg:px-10 lg:py-8 xl:px-14 xl:py-10">
                  <h3 className="text-[#B0E9FF] text-2xl md:text-3xl font-light mb-3">
                    Prevent
                    <br /> Misconduct
                  </h3>
                  <p className="text-[#ffffff] text-xs sm:text-sm leading-relaxed tracking-wide">
                    Transparent reporting and public accountability deter bad
                    actors.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl bg-gradient-to-b from-[rgba(6,26,34,0.08)] to-[rgba(12,75,100,0.2)] backdrop-blur-xl border border-[#4ECDC4]/20 overflow-hidden h-full">
                <div className="flex items-start justify-start mr-[-95px]">
                  <Image
                    src={EmpowerSection}
                    alt="Empower the Community"
                    className="h-[120px] md:h-[150px] lg:h-[170px] xl:h-[200px]"
                  />
                </div>
                <div className="p-6 lg:px-10 lg:py-8 xl:px-14 xl:py-10">
                  <h3 className="text-[#B0E9FF] text-2xl md:text-3xl font-light mb-3">
                    Empower the <br /> Community
                  </h3>
                  <p className="text-[#ffffff] text-xs sm:text-sm leading-relaxed tracking-wide">
                    Give contributors the tools and incentives to uphold the
                    integrity of the Arbitrum ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reward Structure Section */}
      <section className="py-24 px-4 overflow-x-hidden">
        <div className="w-[90%] mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-6 mb-5 font-primary font-medium text-transparent text-center bg-clip-text bg-gradient-to-br from-[#FBFCA4] from-[17.14%] to-[#FFFFFF] to-[135.08%]">
            Reward Structure
          </h2>
          <div className="flex justify-center items-center">
            <div className="bg-[#00000052] rounded-full px-10 py-3 inline-block mb-16 border-[0.5px] border-[#FAFFC8A6] shadow-[inset_0px_4px_29.8px_0px_#FFFFFF33]">
              <p className="text-[#FFFAD1] text-xs md:text-sm text-center tracking-wide">
                Community members are rewarded based on the severity of the
                misuse
              </p>
            </div>
          </div>

          <div className="relative h-[700px] w-[320px] md:w-[768px] xl:w-full max-w-[1400px] mx-auto overflow-hidden">
            {/* Spiral Image */}
            <div className="absolute left-[-50px] md:left-[10%] xl:left-[30%] top-[15%] xl:top-[5%] w-[400px] md:w-[450px] xl:w-[550px]">
              <Image
                src={SpiralImage || "/placeholder.svg"}
                alt="Reward Structure Spiral"
                className="w-full h-auto"
              />
            </div>

            <div className="absolute top-[35%] left-[20%] md:top-[25%] md:left-[57%] xl:top-[20%] xl:left-[63%] w-[6px] h-[6px] bg-[#FFFAD1] rounded-full"></div>
            <div className="absolute top-[calc(25%-60px)] left-[calc(57%+2.2px)] xl:top-[calc(20%-80px)] xl:left-[calc(63%+2.2px)] w-0 md:w-[1.5px] h-[60px] xl:h-[80px] bg-[#FFFAD1]"></div>
            <div className="absolute top-[calc(35%-110px)] left-[calc(20%+2.2px)] md:top-[calc(25%-60px)] md:left-[47.2%] xl:top-[calc(20%-80px)] xl:left-[23.2%] h-[110px] w-[1.5px] md:h-[1.5px] md:w-[10%] xl:w-[40%] bg-gradient-to-b md:bg-gradient-to-r from-[#000000] from-[7.67%] to-[#FFFAD1]"></div>

            <div className="absolute top-[39%] left-[85%] md:top-[53%] md:left-[52%] xl:top-[45%] xl:left-[63%] w-[6px] h-[6px] bg-[#FFFAD1] rounded-full"></div>
            <div className="absolute top-[39%] left-[calc(85%+2.5px)] md:top-[calc(53%+2.5px)] md:left-[52%] xl:top-[calc(45%+2.5px)] xl:left-[63%] w-[1.5px] h-[110px] md:h-[1.5px] md:w-[7%] xl:w-[10%] bg-gradient-to-t md:bg-gradient-to-l from-[#000000] from-[7.67%] to-[#FFFAD1]"></div>

            <div className="absolute top-[60%] left-[5%] md:top-[70%] md:left-[35%] xl:top-[64%] xl:left-[36%] w-[6px] h-[6px] bg-[#FFFAD1] rounded-full"></div>
            <div className="absolute top-[60%] left-[calc(5%+2.5px)] md:top-[calc(70%+2.5px)] md:left-[25%] xl:top-[calc(64%+2.5px)] xl:left-[26%] w-[1.5px] h-[150px] md:h-[1.5px] md:w-[10%] bg-gradient-to-t md:bg-gradient-to-r from-[#000000] from-[7.67%] to-[#FFFAD1]"></div>

            {/* High Severity Label */}
            <div className="absolute top-0 left-0 md:top-[-50px] xl:top-12 md:left-[7%] flex flex-col items-start justify-center gap-4">
              {/* Icon */}
              <div className="w-5 h-5 md:w-10 md:h-10 flex items-center justify-center bg-[#00000052] border-[0.5px] rounded-full border-[#FAFFC8A6] shadow-[0px_4px_29.8px_0px_#FFFFFF33_inset]">
                <ChevronUp className="text-[#FFFAD1]"  />
              </div>
              {/* Label Content */}
              <div className="text-left">
                <h3 className="text-xl md:text-3xl mb-2 md:mb-4 text-transparent bg-clip-text bg-gradient-to-b from-[#FBFCA4] from-[17.14%] to-[#FFFFFF] to-[135.08%]">
                  High Severity
                </h3>
                <p className="text-[#ffffff] text-lg md:text-2xl font-bold mb-2 md:mb-4">
                  30,000 ARB + 5%
                </p>
                <p className="text-xs md:text-sm text-[#ffffff] tracking-wider">
                  of recovered funds (capped at $100k)
                </p>
              </div>
            </div>

            {/* Medium Severity Label */}
            <div className="absolute top-[68%] right-[2%] md:top-[64%] xl:right-[3%] xl:top-[56%] -translate-y-1/2 flex flex-col items-end md:items-start justify-center gap-4">
              {/* Icon */}
              <div className="w-5 h-5 md:w-10 md:h-10 flex items-center justify-center bg-[#00000052] border-[0.5px] rounded-full border-[#FAFFC8A6] shadow-[0px_4px_29.8px_0px_#FFFFFF33_inset]">
                <Equal className="text-[#FFFAD1]" />
              </div>
              {/* Label Content */}
              <div className="text-right md:text-left">
                <h3 className="text-xl md:text-3xl mb-2 md:mb-4 text-transparent bg-clip-text bg-gradient-to-b from-[#FBFCA4] from-[17.14%] to-[#FFFFFF] to-[135.08%]">
                  Medium Severity
                </h3>
                <p className="text-[#ffffff] text-lg md:text-2xl font-bold mb-2 md:mb-4">
                  10,000 ARB + 5%
                </p>
                <p className="text-xs md:text-sm text-[#ffffff] tracking-wider">
                  of recovered funds (capped at $50k)
                </p>
              </div>
            </div>

            {/* Low Severity Label */}
            <div className="absolute left-[1%] top-[82%] md:top-[74%] md:left-[10%] xl:top-[65%] xl:left-[7%] flex flex-col items-start justify-center gap-4">
              {/* Icon */}
              <div className="w-5 h-5 md:w-10 md:h-10 flex items-center justify-center bg-[#00000052] border-[0.5px] rounded-full border-[#FAFFC8A6] shadow-[0px_4px_29.8px_0px_#FFFFFF33_inset]">
                <ChevronDown
                  className="text-[#FFFAD1]"
                  
                />
              </div>
              {/* Label Content */}
              <div className="text-left">
                <h3 className="text-xl md:text-3xl mb-2 md:mb-4 text-transparent bg-clip-text bg-gradient-to-b from-[#FBFCA4] from-[17.14%] to-[#FFFFFF] to-[135.08%]">
                  Low Severity
                </h3>
                <p className="text-[#ffffff] text-lg md:text-2xl font-bold mb-2 md:mb-4">
                  1,000 ARB + 5%
                </p>
                <p className="text-xs md:text-sm text-[#ffffff] tracking-wider">
                  of recovered funds (capped at $10k)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-4">
        <div className="w-[90%] mx-auto relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[400px] md:w-[700px] md:h-[500px] opacity-80 pointer-events-none">
            <Image
              src={ActionSection || "/placeholder.svg"}
              alt="Action Section"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div
            className="rounded-3xl overflow-hidden relative"
            style={{
              background:
                "linear-gradient(270.15deg, rgba(6, 26, 34, 0.312) -1.49%, rgba(26, 104, 136, 0.28) 99.87%)",
              border: "1px solid #82FFF466",
              backdropFilter: "blur(1.3rem)",
            }}
          >
            <div className="p-4 sm:p-9 md:p-10 lg::p-16 text-center relative bg-gradient-to-b from-[rgba(6,26,34,0.05)] to-[rgba(12,75,100,0.025)]">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl mb-6 text-[#B0E9FF]">
                Ready to take action?
              </h2>
              <p className="text-[#ffffff] text-xs sm:text-sm tracking-wide w-[70%] mx-auto">
                Submit a report, help us recover misused funds, and earn your
                rewards! Together, we can ensure Arbitrum DAO funds are used for
                the betterment of the ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Updated Footer */}
      <footer className="py-8 md:pt-24 md:pb-10 px-4 text-center text-xs md:text-base">
        <p className="text-[#ffffff] text-sm">
          Copyright © 2025 Truence. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
