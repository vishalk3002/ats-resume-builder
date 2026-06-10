import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    error?: string;
  };
};

export default function AuthErrorPage({ searchParams }: Props) {
  const error = searchParams.error;

  // Treat cancel / access denied as safe exit
  if (error === "AccessDenied" || error === "OAuthCallbackError") {
    redirect("/");
  }

  // fallback for real errors
  redirect("/auth/sign-in");
}
