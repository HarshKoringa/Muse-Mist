"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full py-3 rounded-xl bg-[#1A237E] text-white text-base font-medium mt-6 hover:opacity-90 transition-opacity cursor-pointer"
    >
      Sign Out
    </button>
  );
}
