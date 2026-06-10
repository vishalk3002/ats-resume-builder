import { SignIn } from "@/components/auth-components";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    error?: string;
    callbackUrl?: string;
  }>;
};

export default async function SignInComp({ searchParams }: Props) {
  const session = await auth();
  const user = session?.user;

  const params = await searchParams;

  const callbackUrl = params.callbackUrl || "/resume-builder";

  const isCancelled = params.error === "OAuthCallbackError";

  // FIX: use user, not session
  if (user) {
    redirect(callbackUrl);
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-neutral-800 rounded-lg p-6 max-w-xl w-full">
        <h1 className="text-white text-xl mb-4 text-center">
          Welcome to ATS Resume Builder
        </h1>

        {isCancelled && (
          <div className="mb-4 rounded-lg border border-neutral-700 bg-neutral-900 p-4 text-center">
            <p className="text-neutral-200 font-medium">
              Sign in was cancelled
            </p>

            <Link
              href={callbackUrl}
              className="inline-block mt-4 rounded-md bg-white px-4 py-2 text-black font-medium"
            >
              Continue
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <SignIn provider="github" callbackUrl={callbackUrl} />

          <div className="text-gray-400 text-center text-sm">OR</div>

          <SignIn provider="google" callbackUrl={callbackUrl} />
        </div>
      </div>
    </div>
  );
}
