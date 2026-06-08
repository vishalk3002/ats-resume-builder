"use client";

import { useEffect, useState } from "react";
import DefaultTemplate from "@/components/templates/DefaultResume";

export default function ResumePreviewClient() {
  const [resumeText, setResumeText] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("resume-source-data");

    if (!stored) return;

    const parsed = JSON.parse(stored);

    setResumeText(parsed.text);
  }, []);

  if (!resumeText) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Building resume...
      </div>
    );
  }

  return <DefaultTemplate resumeText={resumeText} />;
}
