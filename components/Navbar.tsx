import Link from "next/link";
import Image from "next/image";

import LOGO from "@/public/logo.png";
import { auth } from "@/lib/auth";
import UserMenu from "./UserMenu";

export default async function Navbar() {
  const session = await auth();

  const user = session?.user;
  const isAuthed = !!user;

  const loginRedirect = "/";

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LEFT */}
          <Link href="/" className="flex items-center gap-2">
            <Image src={LOGO} alt="ATS Builder Logo" width={36} height={36} />
            <span className="font-bold text-blue-600 text-lg">My ATS</span>
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-6">
            <Link
              href={isAuthed ? "/resume-builder" : loginRedirect}
              className="text-gray-600 hover:text-black text-sm"
            >
              Resume Builder
            </Link>

            {isAuthed ? (
              <UserMenu image={user?.image ?? null} name={user?.name ?? ""} />
            ) : (
              <Link
                href={loginRedirect}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
