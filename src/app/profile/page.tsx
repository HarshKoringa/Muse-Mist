import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { redirect } from "next/navigation";
import Image from "next/image";
import { UserCircle2 } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import OrderHistory from "@/components/OrderHistory";
import EditProfileForm from "@/components/EditProfileForm";
import { formatPhone } from "@/utils/formatPhone";

export const dynamic = 'force-dynamic'

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

  const adminSupabase = createAdminClient();

  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("id, full_name, avatar_url, email, phone_number, updated_at")
    .eq("id", user.id)
    .single();

  // If no profile row exists yet (trigger may not have fired), create one.
  // Only set phone/email — never touch full_name so user edits are preserved.
  if (!profile) {
    await adminSupabase
      .from("profiles")
      .insert({
        id: user.id,
        phone_number: user.phone ?? null,
        email: user.email ?? null,
      });
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("id, status, total, payment_method, created_at, items")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const fullName = profile?.full_name || user.user_metadata?.full_name;
  const email = profile?.email || user.email;
  const displayPhone = profile?.phone_number || user.phone;
  const isPhoneUser = !email && !!displayPhone;
  const createdAt = profile?.updated_at
    ? new Date(profile.updated_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-[#DCEFFF] flex items-center justify-center px-4 pt-20 pb-16">
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

        {/* Name */}
        {fullName && (
          <h1 className="text-2xl font-semibold text-[#1A237E] text-center mt-2">
            {fullName}
          </h1>
        )}

        {/* Email — Google users */}
        {email && <p className="text-base text-gray-500">{email}</p>}

        {/* Phone — OTP users */}
        {isPhoneUser && displayPhone && (
          <p className="text-base text-gray-500">
            {formatPhone(displayPhone)}
          </p>
        )}

        {/* Member since */}
        {createdAt && (
          <p className="text-xs text-gray-400">Member since {createdAt}</p>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 my-2" />

        {/* Edit profile form */}
        <EditProfileForm
          profile={{
            id: user.id,
            full_name: profile?.full_name ?? null,
            email: profile?.email ?? null,
            phone_number: profile?.phone_number ?? null,
            avatar_url: profile?.avatar_url ?? null,
          }}
          userEmail={user.email ?? null}
          userPhone={user.phone ?? null}
        />

        {/* Divider before logout */}
        <div className="w-full h-px bg-gray-100 my-2" />

        <LogoutButton />

        {orders && orders.length > 0 && (
          <OrderHistory orders={orders} />
        )}
      </div>
    </main>
  );
}
