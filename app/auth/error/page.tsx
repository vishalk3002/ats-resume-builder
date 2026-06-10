import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    error?: string;
  };
};

export default function AuthErrorPage({ searchParams }: Props) {
  const error = searchParams.error;

  // treat cancel as normal flow
  if (
    error === "OAuthCallbackError" ||
    error === "AccessDenied" ||
    error === "Configuration"
  ) {
    redirect("/auth/sign-in"); // or "/"
  }

  // fallback
  redirect("/auth/sign-in");
}
