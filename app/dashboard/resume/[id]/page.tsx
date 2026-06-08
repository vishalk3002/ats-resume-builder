"use client";

import { useEffect, useState } from "react";

export default function ResumePreviewPage() {
  const [text, setText] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("resume-builder-result");

    if (!stored) return;

    const parsed = JSON.parse(stored);

    setText(parsed.text);
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Extracted Resume</h1>

      <div className="border rounded-lg p-4 whitespace-pre-wrap max-h-[700px] overflow-y-auto">
        {text}
      </div>
    </main>
  );
}
