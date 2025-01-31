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

  if (redirecting) {
      return <Loading message="Redirecting to homepage..." />;
  }

  if (!authenticated || !user) {
    return <Loading message="Fetching latest data for you ..." />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full mx-auto lg:pt-8">
        <ReviewerDashboard />
      </main>
    </div>
  );
}
