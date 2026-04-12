import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { UserCircle2 } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export const metadata = {
  title: "My Profile | Muse & Mist",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, email, phone, created_at")
    .eq("id", user.id)
    .single();

  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const fullName = profile?.full_name || user.user_metadata?.full_name;
  const email = profile?.email || user.email;
  const phone = profile?.phone || user.phone;
  const createdAt = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-[#DCEFFF] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4">
        {/* Avatar */}
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Profile Photo"
            width={96}
            height={96}
            className="rounded-full border-4 border-[#DCD9F8] object-cover"
          />
        ) : (
          <UserCircle2 size={96} className="text-[#1A237E]" />
        )}

        {/* Name — Google users */}
        {fullName && (
          <h1 className="text-2xl font-semibold text-[#1A237E] text-center mt-2">
            {fullName}
          </h1>
        )}

        {/* Email — Google users */}
        {email && <p className="text-base text-gray-500">{email}</p>}

        {/* Phone — OTP users */}
        {!email && phone && <p className="text-base text-gray-500">{phone}</p>}

        {/* Member since */}
        {createdAt && (
          <p className="text-xs text-gray-400">Member since {createdAt}</p>
        )}

        <LogoutButton />
      </div>
    </main>
  );
}
