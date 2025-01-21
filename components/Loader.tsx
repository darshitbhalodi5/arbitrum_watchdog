interface LoadingProps {
  message?: string;
}

export default function Loading({ message = "Your report is on its way, hold tight!" }: LoadingProps) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 relative">
        {/* Loading spinner */}
        <div className="relative w-20 h-20 mb-6">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00ff95] animate-spin" />
  
          {/* Inner pulsing circle */}
          <div className="absolute inset-2 rounded-full border-2 border-[#00ff95] animate-ping opacity-75" />
  
          {/* Center dot */}
          <div className="absolute inset-[35%] rounded-full bg-[#00ff95] animate-pulse" />
        </div>
  
        {/* Loading text */}
        <div className="text-center">
          <p className="text-gray-400">{message}</p>
        </div>
      </div>
    )
  }
  
  