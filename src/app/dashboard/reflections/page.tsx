import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default async function ReflectionsPage() {
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

  if (!session) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, goals_metadata")
    .eq("id", session.user.id)
    .single();

  const { data: reflections } = await supabase
    .from("daily_reflections")
    .select("*")
    .eq("user_id", session.user.id)
    .order("date", { ascending: false });

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

        <main className="space-y-4">
          {(!reflections || reflections.length === 0) ? (
            <div className="text-center py-20 bg-[#0f0f0f] border border-neutral-800 rounded-2xl">
              <p className="text-neutral-500">No reflections yet. Start capturing your daily learnings!</p>
            </div>
          ) : (
            reflections.map(ref => (
              <div key={ref.id} className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-6 transition-all hover:border-indigo-500/30">
                <div className="mb-4">
                  <p className="text-xs text-indigo-400/80 font-mono tracking-wide">
                    {new Date(ref.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <p className="text-lg font-medium text-neutral-200 whitespace-pre-wrap">"{ref.reflection_text}"</p>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
