import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse-fork";

// -----------------------------
// SUGGESTIONS ENGINE (IMPROVED)
// -----------------------------
function generateSuggestions(text: string) {
  const lower = text.toLowerCase();
  const suggestions: string[] = [];

  const hasEmail = /[^\s]+@[^\s]+\.[^\s]+/.test(text);
  const hasPhone = /(\+?\d[\d\s-]{8,}\d)/.test(text);

  const hasLinkedIn = lower.includes("linkedin");
  const hasGitHub = lower.includes("github");

  const wordCount = text.split(/\s+/).length;

  const hasSkills = lower.includes("skills");
  const hasExperience = lower.includes("experience");
  const hasProjects = lower.includes("projects");

  // CONTACT
  if (!hasEmail) suggestions.push("Add a professional email address.");
  if (!hasPhone) suggestions.push("Add a phone number for recruiters.");
  if (!hasLinkedIn) suggestions.push("Add a LinkedIn profile link.");
  if (!hasGitHub)
    suggestions.push("Add a GitHub profile (important for tech roles).");

  // STRUCTURE
  const missing = [];
  if (!hasExperience) missing.push("Experience");
  if (!hasSkills) missing.push("Skills");
  if (!hasProjects) missing.push("Projects");

  if (missing.length > 0) {
    suggestions.push(`Add missing sections: ${missing.join(", ")}.`);
  }

  // CONTENT DEPTH
  if (wordCount < 200) {
    suggestions.push("Resume is too short — needs more detail.");
  } else if (wordCount < 350) {
    suggestions.push("Add more achievements and quantified impact.");
  }

  // FORMATTING
  const bulletCount = (text.match(/•|- |\*/g) || []).length;

  if (bulletCount < 6) {
    suggestions.push("Use more bullet points for readability.");
  }

  return suggestions;
}

// -----------------------------
// STRICT ATS SCORE ENGINE (REALISTIC 63–67 RANGE)
// -----------------------------
function calculateATSScore(text: string) {
  const lower = text.toLowerCase();

  // 🔥 stricter base (THIS IS THE KEY CHANGE)
  let score = 55;

  // -----------------------------
  // CONTACT (max +12)
  // -----------------------------
  const hasEmail = /[^\s]+@[^\s]+\.[^\s]+/.test(text);
  const hasPhone = /(\+?\d[\d\s-]{8,}\d)/.test(text);
  const hasLinkedIn = lower.includes("linkedin");
  const hasGitHub = lower.includes("github");

  if (hasEmail) score += 4;
  if (hasPhone) score += 4;
  if (hasLinkedIn) score += 2;
  if (hasGitHub) score += 2;

  // -----------------------------
  // STRUCTURE (max +8)
  // -----------------------------
  const keywords = [
    "experience",
    "education",
    "skills",
    "projects",
    "work",
    "internship",
    "summary",
    "objective",
  ];

  let hits = 0;
  keywords.forEach((k) => {
    if (lower.includes(k)) hits++;
  });

  score += Math.min(hits * 1.5, 8);

  // -----------------------------
  // CONTENT DEPTH (max +8)
  // -----------------------------
  const wordCount = text.split(/\s+/).length;

  if (wordCount > 300) score += 3;
  if (wordCount > 600) score += 3;
  if (wordCount > 900) score += 2;

  // -----------------------------
  // FORMATTING (max +7)
  // -----------------------------
  const bulletCount = (text.match(/•|- |\*/g) || []).length;

  if (bulletCount > 5) score += 3;
  if (bulletCount > 12) score += 4;

  // -----------------------------
  // REALISTIC PENALTIES (VERY IMPORTANT)
  // -----------------------------
  const hasExperience = lower.includes("experience");
  const hasProjects = lower.includes("projects");
  const hasSkills = lower.includes("skills");

  if (!hasExperience) score -= 8;
  if (!hasProjects) score -= 5;
  if (!hasSkills) score -= 5;

  // weak resume penalty
  if (text.length < 250) score -= 8;

  // no structure penalty
  if (hits <= 2) score -= 5;

  // -----------------------------
  // FINAL NORMALIZATION
  // -----------------------------
  score = Math.max(0, Math.min(100, score));

  // 🎯 soft clamp to prevent fake 90+ spikes
  if (score > 88) score = 88;

  return score;
}

// -----------------------------
// API ROUTE
// -----------------------------
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files allowed" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdf(buffer);

    if (data.numpages > 3) {
      return NextResponse.json(
        { error: "Resume must not exceed 2 pages" },
        { status: 400 },
      );
    }

    const extractedText = data.text;

    if (!extractedText || extractedText.length < 100) {
      return NextResponse.json(
        { error: "Unreadable or image-based PDF" },
        { status: 400 },
      );
    }

    const score = calculateATSScore(extractedText);
    const suggestions = generateSuggestions(extractedText);

    return NextResponse.json({
      success: true,
      score,
      suggestions,
      text: extractedText,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
