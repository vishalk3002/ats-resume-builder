import { signIn, signOut } from "@/lib/auth";
import Image from "next/image";
import GitHubLogo from "../public/GitHub_Invertocat_White.png";
import GoogleLogo from "../public/icons8-google-48.png";

export function SignIn({
  provider,
  callbackUrl,
}: {
  provider?: string;
  callbackUrl?: string;
}) {
  const isGithub = provider === "github";

  return (
    <form
      action={async () => {
        "use server";

        if (!provider) {
          throw new Error("Provider is required");
        }

        await signIn(provider, {
          redirectTo: callbackUrl || "/resume-builder",
        });
      }}
    >
      <button
        className={`w-full p-3 rounded-md font-medium flex items-center justify-center gap-3 ${
          isGithub ? "bg-black text-white" : "bg-gray-400 text-black"
        }`}
      >
        <Image
          src={isGithub ? GitHubLogo : GoogleLogo}
          alt="OAuth Logo"
          style={{ width: "20px", height: "auto" }}
        />

        {isGithub ? "Continue with GitHub" : "Continue with Google"}
      </button>
    </form>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button className="text-gray-600 px-3 py-2 text-sm">Sign Out</button>
    </form>
  );
}
