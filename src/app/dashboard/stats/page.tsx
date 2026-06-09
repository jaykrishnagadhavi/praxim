import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import DashboardNav from "@/components/dashboard/DashboardNav";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default async function StatsPage() {
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

  const { data: habits } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", session.user.id);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 31);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

  const { data: logs } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("user_id", session.user.id)
    .gte("logged_date", thirtyDaysAgoStr);

  const todayStr = new Date().toISOString().split("T")[0];

  let dailyTotal = 0;
  let dailyCompleted = 0;

  if (habits && logs) {
    const dailyHabits = habits.filter(h => h.frequency === "daily" && !(h.end_date && h.end_date < todayStr));
    dailyTotal = dailyHabits.length;
    
    dailyHabits.forEach(h => {
      if (logs.some(l => l.habit_id === h.id && l.logged_date === todayStr && l.status === "completed")) {
        dailyCompleted++;
      }
    });
  }

  const dailyProgress = dailyTotal === 0 ? 0 : Math.round((dailyCompleted / dailyTotal) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 p-8">
      <div className="max-w-4xl mx-auto">
        <DashboardHeader profile={profile} />
        <DashboardNav />
        <main>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-6 shadow-sm hover:border-indigo-500/30 transition-all">
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Daily Completion</h3>
              <p className="text-4xl font-bold text-indigo-500 mt-2">{dailyProgress}%</p>
              <p className="text-xs text-neutral-500 mt-2">{dailyCompleted} of {dailyTotal} daily habits completed today</p>
            </div>
            <div className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-6 shadow-sm hover:border-indigo-500/30 transition-all">
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Total Active Habits</h3>
              <p className="text-4xl font-bold text-white mt-2">{habits?.length || 0}</p>
              <p className="text-xs text-neutral-500 mt-2">Active habits currently being tracked</p>
            </div>
            <div className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-6 shadow-sm hover:border-emerald-500/30 transition-all">
              <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">30-Day Activity</h3>
              <p className="text-4xl font-bold text-emerald-500 mt-2">{logs?.length || 0}</p>
              <p className="text-xs text-neutral-500 mt-2">Logs recorded in the past 30 days</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
