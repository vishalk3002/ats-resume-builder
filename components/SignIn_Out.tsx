import Link from "next/link";
import { auth } from "@/lib/auth";
import { SignOut } from "./auth-components";

export default async function AuthButton() {
  const session = await auth();

  return session ? (
    <SignOut />
  ) : (
    <Link
      href="/auth/sign-in"
      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
    >
      Sign In
    </Link>
  );
}
