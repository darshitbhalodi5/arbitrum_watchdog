"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import ReviewerDashboard from "@/components/reviewer/ReviewerDashboard";
import Navbar from "@/components/common/Navbar"
import Loading from "@/components/Loader";

export default function ReviewerPage() {
  const router = useRouter();
  const { user, authenticated, ready } = usePrivy();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (ready && !authenticated) {
      setRedirecting(true);
      router.push("/");
    }
  }, [ready, authenticated, router]);

  if (!ready || redirecting) {
      return <Loading message="Redirecting to homepage..." />;
  }

  if (!ready || !authenticated || !user) {
    return <Loading message="Accessing reviewer dashboard..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1B1E]">
      <Navbar />
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <ReviewerDashboard />
      </main>
    </div>
  );
}
