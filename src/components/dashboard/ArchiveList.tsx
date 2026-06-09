"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HabitLog {
  id: string;
  logged_date: string;
  type: 'habit' | 'mood';
  habits?: { name: string; frequency: string } | null;
  moodData?: { emoji: string; label: string };
}

export default function ArchiveList({ userId }: { userId: string }) {
  const supabase = createClient();
  const [logHistory, setLogHistory] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
      
    // Fetch all habits to map names and frequencies (bulletproof against missing foreign keys)
    const { data: allHabits } = await supabase
      .from("habits")
      .select("id, name, frequency")
      .eq("user_id", userId);

    const habitMap = (allHabits || []).reduce((acc, h) => {
      acc[h.id] = { name: h.name, frequency: h.frequency };
      return acc;
    }, {} as Record<string, { name: string; frequency: string }>);

    // Fetch history without SQL JOIN
    const { data: logsData, error: logsError } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("logged_date", { ascending: false });
      
    // Fetch daily reflections to get mood entries
    const { data: reflectionsData, error: reflectionsError } = await supabase
      .from("daily_reflections")
      .select("id, date, reflection_text")
      .eq("user_id", userId)
      .like("reflection_text", "[Mood:%")
      .order("date", { ascending: false });

    if (logsError) {
      console.error("Error fetching logs:", JSON.stringify(logsError, null, 2), logsError.message);
    }
      
    let combinedLogs: HabitLog[] = [];

    if (logsData) {
      // Map the names and frequencies manually
      const mappedLogs = logsData.map(log => ({
        id: log.id,
        logged_date: log.logged_date,
        type: 'habit' as const,
        habits: habitMap[log.habit_id] 
          ? { name: habitMap[log.habit_id].name, frequency: habitMap[log.habit_id].frequency }
          : { name: "Deleted Habit", frequency: "unknown" }
      }));
      combinedLogs = [...combinedLogs, ...mappedLogs];
    }

    if (reflectionsData) {
      const mappedMoods = reflectionsData.map(reflection => {
        // reflection_text is like "[Mood: 🟢] Good - 14:08"
        const moodMatch = reflection.reflection_text.match(/\[Mood:\s(.*?)\]\s(.*?)\s-/);
        return {
          id: reflection.id,
          logged_date: reflection.date,
          type: 'mood' as const,
          moodData: {
            emoji: moodMatch ? moodMatch[1] : '😐',
            label: moodMatch ? moodMatch[2] : 'Mood Logged'
          }
        };
      });
      combinedLogs = [...combinedLogs, ...mappedMoods];
    }
    
    // Sort combined descending
    combinedLogs.sort((a, b) => new Date(b.logged_date).getTime() - new Date(a.logged_date).getTime());
    
    setLogHistory(combinedLogs);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const undoLog = async (logId: string, type: 'habit' | 'mood') => {
    if (type === 'habit') {
      const { error } = await supabase
        .from("habit_logs")
        .delete()
        .eq("id", logId);
        
      if (!error) {
        setLogHistory(logHistory.filter(l => l.id !== logId));
      } else {
        console.error("Error undoing log:", error);
      }
    } else if (type === 'mood') {
      const { error } = await supabase
        .from("daily_reflections")
        .delete()
        .eq("id", logId);
        
      if (!error) {
        setLogHistory(logHistory.filter(l => l.id !== logId));
      } else {
        console.error("Error undoing mood:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white tracking-tight">Completion History</h2>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {logHistory.length === 0 ? (
          <div className="text-center py-10 bg-[#0f0f0f] border border-neutral-800 rounded-3xl">
            <p className="text-neutral-500">No habits completed yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logHistory.map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 rounded-xl bg-[#0f0f0f] border border-neutral-800 transition-all hover:border-neutral-700">
                <div className="flex items-center gap-3">
                  {log.type === 'habit' ? (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-lg shadow-inner">
                      {log.moodData?.emoji}
                    </div>
                  )}
                  <div>
                    {log.type === 'habit' ? (
                      <>
                        <p className="font-medium text-neutral-300">{(log.habits as any)?.name || "Deleted Habit"}</p>
                        <p className="text-[10px] text-neutral-500 font-mono mt-0.5 uppercase tracking-wider">
                          {(log.habits as any)?.frequency || "UNKNOWN"}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-neutral-300">Mood of the Day</p>
                        <p className="text-[10px] text-indigo-400 font-mono mt-0.5 uppercase tracking-wider">
                          {log.moodData?.label}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-xs text-neutral-500 font-mono">
                    {new Date(log.logged_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <Button 
                    onClick={() => undoLog(log.id, log.type)}
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-[10px] text-neutral-500 hover:text-red-400"
                  >
                    Undo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
