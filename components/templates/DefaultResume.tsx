"use client";

import { generateResumePdf } from "@/lib/generatePdf";
import { useRouter } from "next/navigation";

type Props = {
  resumeText: string;
};

export default function DefaultTemplate({ resumeText }: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-200 py-10">
      {/* Controls */}
      <div className="max-w-[900px] mx-auto mb-6 flex justify-end gap-3">
        <button
          onClick={() => generateResumePdf(resumeText)}
          className="bg-black text-white px-5 py-2 rounded-md"
        >
          Download PDF
        </button>

        <button
          onClick={() => {
            sessionStorage.removeItem("resume-source-data");
            router.push("/resume-builder");
          }}
          className="border bg-white px-5 py-2 rounded-md"
        >
          Build Another
        </button>
      </div>

      {/* --Resume-- */}
      <div className="max-w-[900px] mx-auto">
        <div
          id="resume"
          className="bg-white shadow-xl mx-auto p-12 min-h-[1200px]"
        >
          <div className="whitespace-pre-wrap text-[15px] leading-7 text-black">
            {resumeText}
          </div>
        </div>
      </div>
    </div>
  );
}
