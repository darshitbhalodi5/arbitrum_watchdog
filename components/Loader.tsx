import { LoadingProps } from "@/types/loader";

export default function Loading({
  message = "Your report is on its way, hold tight!",
}: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-[100vh] min-h-[400px] p-8 relative">
      {/* Loading spinner */}
      <div className="relative w-20 h-20 mb-6">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2A6F6F] animate-spin" />

        {/* Inner pulsing circle */}
        <div className="absolute inset-2 rounded-full border-2 border-[#2A6F6F] animate-ping opacity-75" />

        {/* Center dot */}
        <div className="absolute inset-[35%] rounded-full bg-[#2A6F6F] animate-pulse" />
      </div>

      {/* Loading text */}
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl px-6 py-4 border border-white/10">
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}
