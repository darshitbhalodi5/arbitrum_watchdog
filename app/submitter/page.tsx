"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import SubmitterDashboard from "@/components/submitter/SubmitterDashboard";
import Navbar from "@/components/common/Navbar";
import Loading from "@/components/Loader";

export default function SubmitterPage() {
  const router = useRouter();
  const { user, authenticated, ready } = usePrivy();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (ready && !authenticated) {
      setRedirecting(true);
      router.push("/");
    }
  }, [ready, authenticated, router]);

  if (redirecting) {
    return <Loading message="Redirecting to homepage..." />;
  }
  
  if (!authenticated || !user) {
    return <Loading message="Fetching latest data for you ..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#1A1B1E]">
      <Navbar />
      <main className="flex-1 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <SubmitterDashboard />
      </main>
    </div>
  );
}
