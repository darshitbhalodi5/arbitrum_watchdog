"use client";

import { motion } from "framer-motion";
import { useLogout } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const { logout } = useLogout();
  const router = useRouter();

  const handleLogoutAndRedirect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default Link behavior
    try {
      await logout(); // Logout using Privy
      router.push("/"); // Redirect to dashboard after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0B0C] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background waves */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, transparent, #2A6F6F, transparent)`,
              maskImage:
                "linear-gradient(to bottom, transparent, black, transparent)",
              height: "100%",
              width: "200%",
              left: "-50%",
              opacity: 0.1 + i * 0.1,
            }}
            animate={{
              x: ["0%", "50%"],
              y: [i * 10, i * 10 + 5, i * 10],
            }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 20 + i * 5,
                ease: "linear",
              },
              y: {
                repeat: Number.POSITIVE_INFINITY,
                duration: 5 + i * 2,
                ease: "easeInOut",
                yoyo: true,
              },
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/5 rounded-2xl p-12 border border-white/10"
        >
          <motion.h1
            className="text-8xl md:text-9xl font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1A3D3D] to-[#2A6F6F]">
              404
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="text-2xl md:text-3xl font-light text-white mt-6">
              Page Not Found
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              The requested page doesn&apos;t exist or has been moved. Please
              verify the URL or navigate back to the home page.
            </p>
            <button
              onClick={handleLogoutAndRedirect}
              className="inline-block px-8 py-3 rounded-lg backdrop-blur-sm bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors"
            >
              Return to Dashboard
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-sm text-gray-500">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Truence • Decentralized Content Review Platform
        </motion.div>
      </div>
    </div>
  );
}
