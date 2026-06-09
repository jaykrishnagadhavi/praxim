"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { Check, Plus, Loader2, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Horizon = "daily" | "weekly" | "monthly";

interface Habit {
  id: string;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
  end_date: string | null;
  stacked_on_id: string | null;
  created_at: string;
};

interface HabitLog {
  id: string;
  habit_id: string;
  status: string;
  logged_date: string;
}

export default function HabitList({ userId }: { userId: string }) {
  const supabase = createClient();
  const [activeHorizon, setActiveHorizon] = useState<Horizon>("daily");
  
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<Record<string, HabitLog>>({});
  const [allRecentLogs, setAllRecentLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitEndDate, setNewHabitEndDate] = useState("");
  const [stackedOnId, setStackedOnId] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);
  const [showEndDateInput, setShowEndDateInput] = useState(false);

  const horizons: { id: Horizon; label: string }[] = [
    { id: "daily", label: "Daily" },
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
  ];

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch habits that are active
    const { data: habitsData } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
      
    if (habitsData) setHabits(habitsData);

    const today = new Date().toISOString().split("T")[0];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 31);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    const { data: logsData } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", userId)
      .gte("logged_date", thirtyDaysAgoStr);

    if (logsData) {
      setAllRecentLogs(logsData);
      const logsMap: Record<string, HabitLog> = {};
      logsData.forEach(log => { 
        if (log.logged_date === today) {
          logsMap[log.habit_id] = log; 
        }
      });
      setTodayLogs(logsMap);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    
    setIsAdding(true);
    const { data, error } = await supabase
      .from("habits")
      .insert({
        user_id: userId,
        name: newHabitName.trim(),
        frequency: activeHorizon,
        end_date: newHabitEndDate || null,
        stacked_on_id: stackedOnId || null
      })
      .select()
      .single();

    if (data) {
      setHabits([...habits, data]);
      setNewHabitName("");
      setNewHabitEndDate("");
      setStackedOnId("");
      setShowEndDateInput(false);
    } else {
      console.error("Error creating habit:", JSON.stringify(error, null, 2), error?.message);
    }
    setIsAdding(false);
  };

  const toggleLog = async (habitId: string, existingLog?: HabitLog) => {
    const today = new Date().toISOString().split("T")[0];
    
    if (existingLog && existingLog.status === "completed") {
      const { error } = await supabase
        .from("habit_logs")
        .delete()
        .eq("id", existingLog.id);
        
      if (error) {
        console.error("Error unchecking habit:", JSON.stringify(error, null, 2), error.message);
      } else {
        const newLogs = { ...todayLogs };
        if (newLogs[habitId]?.id === existingLog.id) delete newLogs[habitId];
        setTodayLogs(newLogs);
        setAllRecentLogs(allRecentLogs.filter(l => l.id !== existingLog.id));
      }
    } else {
      const { data, error } = await supabase
        .from("habit_logs")
        .insert({
          habit_id: habitId,
          user_id: userId,
          status: "completed",
          logged_date: today
        })
        .select()
        .single();
        
      if (error) {
        console.error("Error checking off habit:", JSON.stringify(error, null, 2), error.message);
      }
      if (data) {
        setTodayLogs({ ...todayLogs, [habitId]: data });
        setAllRecentLogs([...allRecentLogs, data]);
      }
    }
  };



  const deleteHabit = async (habitId: string) => {
    if (!window.confirm("Are you sure you want to delete this habit? This cannot be undone.")) return;
    
    // Delete logs first to avoid foreign key constraint errors
    await supabase.from("habit_logs").delete().eq("habit_id", habitId);
    
    const { error } = await supabase.from("habits").delete().eq("id", habitId);
    
    if (error) {
      console.error("Error deleting habit:", error);
    } else {
      setHabits(habits.filter(h => h.id !== habitId));
      
      // Clean up local state
      const newLogs = { ...todayLogs };
      if (newLogs[habitId]) delete newLogs[habitId];
      setTodayLogs(newLogs);
      setAllRecentLogs(allRecentLogs.filter(l => l.habit_id !== habitId));
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];
  
  const getStartOfWeek = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday is start of week
    const start = new Date(d.setDate(diff));
    return start.toISOString().split("T")[0];
  };

  const getStartOfMonth = () => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split("T")[0];
  };

  const startOfWeek = getStartOfWeek();
  const startOfMonth = getStartOfMonth();

  // Filter out habits whose end date has passed.
  const activeHabits = habits.filter(h => {
    if (h.frequency !== activeHorizon) return false;
    if (h.end_date && h.end_date < todayStr) return false;
    return true;
  });

  const habitItems = activeHabits.map(habit => {
    let activeLog: HabitLog | undefined;
    if (habit.frequency === "daily") {
      activeLog = todayLogs[habit.id];
    } else if (habit.frequency === "weekly") {
      activeLog = allRecentLogs.find(l => l.habit_id === habit.id && l.logged_date >= startOfWeek);
    } else if (habit.frequency === "monthly") {
      activeLog = allRecentLogs.find(l => l.habit_id === habit.id && l.logged_date >= startOfMonth);
    }
    const isCompleted = activeLog?.status === "completed";
    return { habit, activeLog, isCompleted };
  });

  const uncompletedItems = habitItems.filter(item => !item.isCompleted);
  const completedItems = habitItems.filter(item => item.isCompleted);

  const totalDailyHabits = habits.filter(h => h.frequency === "daily" && !(h.end_date && h.end_date < todayStr)).length;
  const completedDailyHabits = habits.filter(h => h.frequency === "daily" && todayLogs[h.id] && todayLogs[h.id].status === "completed").length;
  const progressPercentage = totalDailyHabits === 0 ? 0 : Math.round((completedDailyHabits / totalDailyHabits) * 100);

  const renderHabitItem = ({ habit, activeLog, isCompleted }: { habit: Habit, activeLog?: HabitLog, isCompleted: boolean }) => (
    <div
      key={habit.id}
      className={cn(
        "group relative flex items-center justify-between p-5 rounded-2xl transition-all duration-300 overflow-hidden",
        isCompleted 
          ? "bg-[#0f1412] border border-emerald-500/20 shadow-[0_4px_20px_-10px_rgba(16,185,129,0.15)] opacity-60 hover:opacity-100"
          : "bg-[#111] border border-neutral-800 hover:border-neutral-700 hover:shadow-lg"
      )}
    >
      <div className="flex items-center gap-5">
        <button
          onClick={() => toggleLog(habit.id, activeLog)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg border-2 transition-all duration-300 shadow-sm",
            isCompleted
              ? "bg-emerald-500 border-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.6)] scale-105"
              : "border-neutral-700 hover:border-indigo-500 bg-black"
          )}
        >
          {isCompleted && <Check className="h-4 w-4 stroke-[3]" />}
        </button>

        <div className="flex flex-col ml-1">
          <span className={cn(
            "text-base font-medium transition-colors duration-300",
            isCompleted ? "text-emerald-500/80 line-through" 
              : "text-neutral-200"
          )}>
            {habit.name}
          </span>
          <span className="text-[10px] text-neutral-600 mt-0.5">
            Added {new Date(habit.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          {habit.end_date && (
            <p className="text-xs text-indigo-400/80 mt-1 font-mono tracking-wide">
              Ends: {habit.end_date}
            </p>
          )}
        </div>
      </div>

      <div className={cn(
        "flex items-center gap-2 transition-all duration-300",
        "opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
      )}>

        <Button
          onClick={() => deleteHabit(habit.id)}
          variant="ghost"
          size="icon"
          className="h-9 w-9 border border-neutral-800 text-neutral-400 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/10"
          title="Delete Habit"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Taskline Progress Bar */}
      <div className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">Today's Progress</h2>
            <p className="text-xs text-neutral-500 mt-1">{completedDailyHabits} of {totalDailyHabits} daily tasks completed</p>
          </div>
          <span className="text-4xl font-bold text-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]">{progressPercentage}%</span>
        </div>
        <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-neutral-900 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)] relative"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-white/20 blur-[2px]" />
          </div>
        </div>
      </div>

      <div className="inline-flex items-center p-1.5 bg-[#111] border border-neutral-800 rounded-xl shadow-inner">
        {horizons.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveHorizon(tab.id)}
            className={cn(
              "px-5 py-2 text-sm font-medium rounded-lg transition-all duration-300",
              activeHorizon === tab.id
                ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleAddHabit} className="relative bg-[#111] border border-neutral-800 rounded-xl p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] flex flex-col gap-2">
        <div className="flex relative">
          <input 
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder={`Add a new ${activeHorizon} task or habit...`}
            className="w-full bg-transparent text-white placeholder-neutral-600 px-4 py-3 focus:outline-none focus:ring-0"
          />
          <div className="flex items-center pr-2 gap-2">
            <button 
              type="button" 
              onClick={() => setShowEndDateInput(!showEndDateInput)}
              className={cn(
                "p-2 rounded-lg transition-colors duration-200 hover:bg-neutral-800",
                newHabitEndDate ? "text-indigo-400" : "text-neutral-500"
              )}
              title="Set End Date"
            >
              <Calendar className="w-5 h-5" />
            </button>
            <Button 
              type="submit" 
              disabled={!newHabitName.trim() || isAdding}
              size="sm"
              className="h-10 bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(79,70,229,0.3)] rounded-lg"
            >
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2 px-2 pb-2">
          {activeHabits.length > 0 && (
            <select 
              value={stackedOnId}
              onChange={(e) => setStackedOnId(e.target.value)}
              className="flex-1 bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-400 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="">(Optional) Stack on top of...</option>
              {activeHabits.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          )}

          {showEndDateInput && (
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-3.5 w-3.5 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input 
                type="date" 
                value={newHabitEndDate}
                min={todayStr}
                onChange={(e) => setNewHabitEndDate(e.target.value)}
                className="w-full bg-black border border-neutral-800 text-neutral-300 pl-9 pr-3 py-2 rounded-lg text-xs focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer relative"
              />
            </div>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
        ) : activeHabits.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-neutral-800 rounded-3xl bg-[#0f0f0f]">
            <h3 className="text-lg font-medium text-neutral-300">No active {activeHorizon} tasks</h3>
            <p className="text-neutral-500 mt-2 max-w-sm mx-auto">You've either completed everything for today, or haven't set up any {activeHorizon} routines yet.</p>
          </div>
        ) : (
          <>
            {uncompletedItems.map(item => renderHabitItem(item))}
            
            {completedItems.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-neutral-500 mb-4 px-2 uppercase tracking-wider">Completed</h3>
                <div className="space-y-4">
                  {completedItems.map(item => renderHabitItem(item))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
