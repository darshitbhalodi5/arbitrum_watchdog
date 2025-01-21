"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import SubmitterDashboard from "@/components/submitter/SubmitterDashboard";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loader";

export default function SubmitterPage() {
  const router = useRouter();
  const { user, authenticated, ready } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated || !user) {
    return (
        <Loading />
    );
  }

  return (
    <div>
      <Navbar />
      <SubmitterDashboard />
    </div>
  );
}
