export default function Loading() {
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
          <h3 className="text-xl font-medium text-[#00ff95] mb-2">
            Loading
            <span className="animate-pulse">.</span>
            <span className="animate-pulse delay-100">.</span>
            <span className="animate-pulse delay-200">.</span>
          </h3>
          <p className="text-gray-400">Your report is on its way, hold tight!</p>
        </div>
      </div>
    )
  }
  
  