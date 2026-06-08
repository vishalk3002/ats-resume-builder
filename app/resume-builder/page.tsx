"use client";

import ResumeBuilder from "@/components/resume/Resume-upload";
import { useEffect } from "react";

export default function ResumeBuilderPage() {
  useEffect(() => {
    /* const timer = setTimeout(() => {}, 9000);
    return () => clearTimeout(timer); */
    const stored = sessionStorage.getItem("resume-source-data");

    if (!stored) return;

    const parsed = JSON.parse(stored);

    console.log(parsed.text);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Resume Builder</h1>
        <p className="mt-2 text-muted-foreground">
          Create a professional resume in minutes.
        </p>
      </div>

      <ResumeBuilder />
    </main>
  );
}
