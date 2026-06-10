import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AuthErrorPage({ searchParams }: Props) {
  const params = await searchParams;

  const error = params.error;

  if (
    error === "OAuthCallbackError" ||
    error === "AccessDenied" ||
    error === "Configuration"
  ) {
    redirect("/auth/sign-in");
  }

  redirect("/auth/sign-in");
}
