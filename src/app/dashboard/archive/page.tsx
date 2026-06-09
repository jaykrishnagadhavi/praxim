import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { History, LayoutDashboard } from "lucide-react";
import ArchiveList from "@/components/dashboard/ArchiveList";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default async function ArchivePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, goals_metadata")
    .eq("id", session.user.id)
    .single();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 p-8">
      <div className="max-w-4xl mx-auto">
        <DashboardHeader profile={profile} />

        <DashboardNav />

        <main>
          <ArchiveList userId={session.user.id} />
        </main>
      </div>
    </div>
  );
}
