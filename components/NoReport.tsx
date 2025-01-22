export default function NoReports() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Empty state illustration */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-lg border-2 border-[#2A6F6F] opacity-50 backdrop-blur-sm" />
        <div className="absolute inset-2 rounded-lg border-2 border-[#2A6F6F] opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-[#2A6F6F]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </div>

      {/* Message */}
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10">
        <h3 className="text-xl font-light text-[#2A6F6F] mb-2">
          No Reports Submitted
        </h3>
        <p className="text-gray-400 max-w-sm">
          There are currently no reports submitted from your address. New
          submissions will appear here.
        </p>
      </div>
    </div>
  );
}
