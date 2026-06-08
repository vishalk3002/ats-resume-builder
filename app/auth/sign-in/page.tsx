import { SignIn, SignOut } from "@/components/auth-components";
import { auth } from "@/lib/auth";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const SignInComp = async ({ searchParams }: Props) => {
  const session = await auth();

  const params = await searchParams;

  const isCancelled = params.error === "OAuthCallbackError";

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

            <p className="text-sm text-neutral-400 mt-1">
              You can continue using ATS Score without an account.
            </p>

            <Link
              href="/ats-score"
              className="inline-block mt-4 rounded-md bg-white px-4 py-2 text-black font-medium hover:bg-neutral-200 transition"
            >
              Return to ATS Score
            </Link>
          </div>
        )}

        {!session ? (
          <div className="flex flex-col gap-4">
            <SignIn provider="github" />

            <div className="text-gray-400 text-center text-sm">OR</div>

            <SignIn provider="google" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-300">Signed in as:</p>
              <p className="text-white">{session.user?.email}</p>
            </div>

            <div className="text-center">
              <SignOut />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInComp;
