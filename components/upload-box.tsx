"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Loader2, CirclePlus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function UploadBox() {
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  //set actual input field using:
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  //helper to clean up invalid input file
  const clearFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF");
      clearFile();
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Only PDF files allowed");
      clearFile();
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("resume", file);

      const res = await fetch("/api/ats-score", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        clearFile();
        return;
      }

      // save temporarily
      sessionStorage.setItem(
        "ats-result",
        JSON.stringify({
          score: data.score,
          suggestions: data.suggestions,
          text: data.text,
        }),
      );

      router.push("/ats-score"); //pushing data and redirecting to another page
    } catch (error) {
      console.error(error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-2xl p-8 w-full max-w-2xl shadow-sm">
      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted transition">
        <span className="mb-6 text-md text-muted-foreground text-center">
          Click to upload PDF
        </span>

        <CirclePlus size={36} />

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </label>

      <Button onClick={handleUpload} className="w-full mt-6" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Calculating ATS Score...
          </>
        ) : (
          "Calculate ATS Score"
        )}
      </Button>

      {file && <p className="mt-4 text-sm">Selected: {file.name}</p>}
    </div>
  );
}
