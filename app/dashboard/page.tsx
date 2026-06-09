// app/dashboard/page.tsx

import { auth } from "@/lib/auth";

import { redirect } from "next/navigation";

import DeleteAccountButton from "@/components/DeleteAccountButton";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/sign-in");
  }

  /* const resumes = await prisma.resume.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  }); */

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* User */}
        <div className="bg-white border rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-6">
            {session.user.image && (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-24 h-24 rounded-full border"
              />
            )}

            <div>
              <h1 className="text-3xl font-bold">{session.user.name}</h1>

              <p className="text-gray-500">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Recent resumes */}
        {/*  <div className="bg-white border rounded-2xl p-8 mt-8">
          <h2 className="text-xl font-semibold mb-6">Recent Resumes</h2>

          {resumes.length === 0 ? (
            <p className="text-gray-500">No resumes saved yet.</p>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <Link
                  key={resume.id}
                  href={`/dashboard/resume/${resume.id}`}
                  className="block border rounded-lg p-4 hover:bg-gray-50"
                >
                  <p className="font-medium">{resume.title}</p>

                  <p className="text-sm text-gray-500">
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div> */}

        {/* Danger zone */}
        <div className="bg-white border rounded-2xl p-8 mt-8">
          <h2 className="text-xl font-semibold mb-6 text-red-600">
            Delete Account permanently
          </h2>

          <DeleteAccountButton />
        </div>
      </div>
    </main>
  );
}
