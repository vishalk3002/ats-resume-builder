import { signIn, signOut } from "@/lib/auth";
import Image from "next/image";
import GitHubLogo from "../public/GitHub_Invertocat_White.png";
import GoogleLogo from "../public/icons8-google-48.png";

export function SignIn({ provider }: { provider?: string }) {
  const isGithub = provider === "github";
  return (
    <form
      action={async () => {
        "use server";
        await signIn(provider);
      }}
    >
      <button
        className={`w-full p-3 rounded-md font-medium transition flex items-center justify-center gap-3 ${
          isGithub
            ? "bg-black text-white hover:bg-neutral-400"
            : "bg-gray-400 text-black hover:bg-white border"
        }`}
      >
        <Image
          src={isGithub ? GitHubLogo : GoogleLogo}
          alt={isGithub ? "GitHub Logo" : "Google Logo"}
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
      className="w-full"
    >
      <button className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
        Sign Out
      </button>
    </form>
  );
}
