/* import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ResumePreviewClient from "./ResumePreviewClient";
export default async function ResumePreviewPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return <ResumePreviewClient />;
}
 */
"use client";

import { useEffect, useState } from "react";
import DefaultTemplate from "@/components/templates/DefaultResume";
import { Loader2 } from "lucide-react";

export default function ResumePreviewPage() {
  const [resumeText, setResumeText] = useState("");
  const [building, setBuilding] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = sessionStorage.getItem("resume-source-data");

      if (stored) {
        const parsed = JSON.parse(stored);
        setResumeText(parsed.text);
      }

      setBuilding(false);
    }, 9000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (building) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p>Building Resume...</p>
      </div>
    );
  }

  return <DefaultTemplate resumeText={resumeText} />;
}
