"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ConfiguratorPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Athena configurator by default
    router.replace("/configurator/athena");
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to configurator...</p>
      </div>
    </div>
  );
}
