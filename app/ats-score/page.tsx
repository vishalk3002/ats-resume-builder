"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ATSScorePage() {
  const [score, setScore] = useState<number | null>(null);

  // const [text, setText] = useState("");

  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("ats-result");

    if (!stored) return;

    const parsed = JSON.parse(stored);

    setScore(parsed.score);

    //setText(parsed.text);
    setSuggestions(parsed.suggestions || []);
    setLoading(false);
  }, []);

  /* const handleOptimize = async () => {
    const res = await fetch("/api/auth-status");

    const data = await res.json();

    if (!data.authenticated) {
      sessionStorage.setItem("redirect-after-login", "/resume-preview");

      // store extracted ATS data too
      const atsData = sessionStorage.getItem("ats-result");

      if (atsData) {
        sessionStorage.setItem("resume-source-data", atsData);
      }

      router.push("/resume-preview");
      return;
    }

    // already signed in
    const atsData = sessionStorage.getItem("ats-result");

    if (atsData) {
      sessionStorage.setItem("resume-source-data", atsData);
    }

    router.push("/resume-builder");
  }; */

  const handleOptimize = async () => {
    const atsData = sessionStorage.getItem("ats-result");

    if (atsData) {
      sessionStorage.setItem("resume-source-data", atsData);
    }

    const res = await fetch("/api/auth-status");

    const data = await res.json();

    if (!data.authenticated) {
      sessionStorage.setItem("redirect-after-login", "/resume-preview");

      // router.push("/auth/sign-in");
      router.push("/auth/sign-in?callbackUrl=/resume-preview");
      return;
    }

    router.push("/resume-preview");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your resume...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">ATS Score Result</h1>
          <p className="text-gray-500 mt-2">
            Analysis of your resume performance
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white border rounded-2xl shadow-sm p-10 text-center">
          <p className="text-gray-500 text-sm mb-2">Your Resume Score</p>

          <h2 className="text-6xl font-extrabold text-gray-900 mb-4">
            {score ?? 0}
            <span className="text-2xl text-gray-500">%</span>
          </h2>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all duration-500"
              style={{ width: `${score ?? 0}%` }}
            />
          </div>

          <p className="text-gray-600 text-sm">
            Improve your resume to increase your ATS compatibility score.
          </p>
        </div>

        {/* suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-8 bg-white border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Suggestions to Improve Your Resume
            </h3>

            <ul className="space-y-3">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-gray-700 text-sm"
                >
                  <span className="mt-1 w-2 h-2 bg-black rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto border border-gray-300 px-6 py-3 rounded-xl text-center hover:bg-gray-100 transition"
          >
            Another Resume
          </Link>

          <button
            onClick={handleOptimize}
            className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition shadow-md"
          >
            Optimize My Resume
          </button>
        </div>
      </div>
    </main>
  );
}
