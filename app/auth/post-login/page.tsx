"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostLoginPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectTo = sessionStorage.getItem("redirect-after-login") || "/";

    sessionStorage.removeItem("redirect-after-login");

    router.replace(redirectTo);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Redirecting...
    </div>
  );
}
