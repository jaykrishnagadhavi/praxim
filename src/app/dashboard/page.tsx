import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import HabitList from "@/components/dashboard/HabitList";
import MicroReflection from "@/components/dashboard/MicroReflection";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
export default async function DashboardPage() {
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

  // Check if onboarding is completed and get profile details
  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed, full_name, avatar_url, goals_metadata")
    .eq("id", session.user.id)
    .single();

  if (profile && !profile.onboarding_completed) {
    redirect("/onboarding");
  }

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
          <HabitList userId={session.user.id} />
          <MicroReflection userId={session.user.id} />
        </main>
      </div>
    </div>
  );
}
