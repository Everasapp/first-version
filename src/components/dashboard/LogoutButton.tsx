"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { createClient } from "@/src/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    const supabase = createClient();
    await supabase.auth.signOut();

    router.replace("/accedi");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#075EAE] bg-white px-6 py-3.5 font-bold text-[#075EAE] transition hover:bg-[#075EAE] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut aria-hidden="true" className="h-5 w-5" />
      {isLoading ? "Uscita..." : "Esci"}
    </button>
  );
}
