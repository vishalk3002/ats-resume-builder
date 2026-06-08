"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account?",
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await fetch("/api/delete-account", {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete account");
        return;
      }

      alert("Account deleted successfully");

      window.location.href = "/";
    } catch (error) {
      console.error(error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-600 text-white px-5 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete Account"}
    </button>
  );
}
