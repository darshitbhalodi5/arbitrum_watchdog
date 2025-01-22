import React from 'react';

interface hero {
    authenticated: boolean
    handleRoleCardClick: (role: "reviewer" | "submitter") => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HeroSection = ({ authenticated, handleRoleCardClick }: hero) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background with smoke effect */}
      <div className="absolute inset-0 bg-[#020617] overflow-hidden">
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: "url('/assets/background.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col items-center space-y-16">
          {/* Logo */}
          {/* <div className="w-32">
            <img src="/assets/logo.svg" alt="Truence" className="w-full" />
          </div> */}

          {/* Title and Subtitle */}
          <div className="text-center space-y-6">
            <h1 className="text-7xl font-light text-white tracking-wide">
              Welcome to Truence
            </h1>
            <p className="text-lg text-gray-400 font-light tracking-wider">
              Protecting the Integrity of DAO Funds
            </p>
          </div>

          {/* Login Cards */}
          <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 px-4">
            <button
              onClick={() => handleRoleCardClick("reviewer")}
              className="group relative overflow-hidden rounded-lg border border-blue-500/10 bg-black/10 backdrop-blur-sm p-8
                        transition-all duration-300 hover:border-blue-500/30 hover:bg-black/20"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-xl" />
              </div>
              <div className="relative z-10 text-left">
                <h3 className="text-2xl font-light text-white mb-4">Login as Reviewer</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Review and validate submitted content. Only authorized reviewer wallets can access this role.
                </p>
              </div>
            </button>

            <button
              onClick={() => handleRoleCardClick("submitter")}
              className="group relative overflow-hidden rounded-lg border border-blue-500/10 bg-black/10 backdrop-blur-sm p-8
                        transition-all duration-300 hover:border-blue-500/30 hover:bg-black/20"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-xl" />
              </div>
              <div className="relative z-10 text-left">
                <h3 className="text-2xl font-light text-white mb-4">Login as Submitter</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Submit content for review. Reviewer wallets cannot access this role.
                </p>
              </div>
            </button>
          </div>

          {/* Note */}
          <p className="text-sm text-gray-500">
            Note: Each wallet can only be used for one role. Reviewer wallets cannot submit reports.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;