import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ResumeBuilder from "@/components/resume/Resume-upload";

export default async function ResumeBuilderPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/resume-builder");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Resume Builder</h1>
        <p className="mt-2">Create a professional resume in minutes.</p>
      </div>

      <ResumeBuilder />
    </main>
  );
}
