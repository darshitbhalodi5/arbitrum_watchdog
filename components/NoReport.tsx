"use client";

import { motion } from "framer-motion";
import { FileX2, Search, AlertCircle } from "lucide-react";

export default function NoReports() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[500px] relative font-secondary">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4ECDC4]/5 to-transparent" />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Animated circles */}
        <div className="relative w-32 h-32 mb-8">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#4ECDC4]/20"
            animate={{ scale: [1, 1.1, 1], rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-[#4ECDC4]/30"
            animate={{ scale: [1.1, 1, 1.1], rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Center icon container */}
          <div className="absolute inset-8 rounded-full bg-[#020C1099] backdrop-blur-xl border border-[#4ECDC4]/20 flex items-center justify-center">
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
                <FileX2 className="w-12 h-12 text-[#B0E9FF]" />
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
                <Search className="w-12 h-12 text-[#B0E9FF]" />
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
                <AlertCircle className="w-12 h-12 text-[#B0E9FF]" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Text content */}
        <h3
          className="text-2xl sm:text-3xl font-light font-primary mb-4 text-transparent bg-clip-text"
          style={{
            backgroundImage:
              "linear-gradient(179.48deg, #FBFCA4 17.14%, #FFFFFF 135.08%)",
          }}
        >
          No Reports Found
        </h3>
        <p className="text-[#B0E9FF] text-sm sm:text-base font-light max-w-md mx-auto">
          You haven&apos;t submitted any reports yet. Start by clicking the
          &quot;Submit New Report&quot; button above.
        </p>
      </motion.div>
    </div>
  );
}
