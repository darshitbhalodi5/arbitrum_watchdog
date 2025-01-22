"use client";

import { motion } from "framer-motion";
import { FileX2, Search, AlertCircle } from "lucide-react";

export default function NoReports() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[500px] relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2A6F6F]/5 to-transparent" />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Animated circles */}
        <div className="relative w-32 h-32 mb-8">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#2A6F6F]/20"
            animate={{ scale: [1, 1.1, 1], rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-[#2A6F6F]/30"
            animate={{ scale: [1.1, 1, 1.1], rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Center icon container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ opacity: [1, 0, 0, 1] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  times: [0, 0.3, 0.7, 1],
                }}
              >
                <FileX2 className="w-12 h-12 text-[#2A6F6F]" />
              </motion.div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ opacity: [0, 1, 0, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  times: [0, 0.3, 0.7, 1],
                }}
              >
                <Search className="w-12 h-12 text-[#2A6F6F]" />
              </motion.div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ opacity: [0, 0, 1, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  times: [0, 0.3, 0.7, 1],
                }}
              >
                <AlertCircle className="w-12 h-12 text-[#2A6F6F]" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10 max-w-md">
          <h3 className="text-2xl font-light text-[#2A6F6F] mb-4">
            No Reports Found
          </h3>
          <p className="text-gray-400">
            We couldn&apos;t find any reports associated with your account. New
            submissions will be displayed here once they&apos;re created.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
