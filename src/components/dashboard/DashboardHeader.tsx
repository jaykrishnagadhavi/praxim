"use client";

import Image from "next/image";
import { LogOut, Target, Clock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
  goals_metadata?: {
    identity_focus?: string;
    hours_reclaimed?: string;
  } | null;
}

export default function DashboardHeader({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const supabase = createClient();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6 mb-2">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white">Dashboard</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Welcome back, <span className="text-indigo-400 font-medium">{profile?.full_name?.split(" ")[0] || "Builder"}</span>.
          </p>
          <p className="text-xs text-neutral-600 mt-2 font-medium tracking-wide uppercase">
            {currentDate}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLogout}
            className="p-2 text-neutral-500 hover:text-red-400 bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors border border-neutral-800"
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
          </button>
          {profile?.avatar_url ? (
            <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Image 
                src={profile.avatar_url} 
                alt={profile.full_name || "Avatar"} 
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-indigo-400 font-bold">
              {profile?.full_name?.charAt(0) || "U"}
            </div>
          )}
        </div>
      </header>

      {/* North Star Goals */}
      {profile?.goals_metadata && (
        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
          {profile.goals_metadata.identity_focus && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.1)]">
              <Target className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-xs font-medium text-indigo-200">
                {profile.goals_metadata.identity_focus}
              </span>
            </div>
          )}
          {profile.goals_metadata.hours_reclaimed && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.1)]">
              <Clock className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-medium text-amber-200">
                Target: {profile.goals_metadata.hours_reclaimed}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
