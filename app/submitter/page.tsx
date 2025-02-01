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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full mx-auto lg:pt-8">
        <SubmitterDashboard />
      </main>
    </div>
  );
}
