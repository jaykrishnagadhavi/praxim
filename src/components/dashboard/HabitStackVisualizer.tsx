"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Layers } from "lucide-react";

type Habit = {
  id: string;
  name: string;
  stacked_on_id: string | null;
  end_date: string | null;
};

export default function HabitStackVisualizer({ userId }: { userId: string }) {
  const supabase = createClient();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHabits = async () => {
      const { data } = await supabase
        .from("habits")
        .select("id, name, stacked_on_id, end_date")
        .eq("user_id", userId)
        .eq("is_archived", false)
        .order("created_at", { ascending: true });
        
      if (data) {
        const todayStr = new Date().toISOString().split("T")[0];
        const activeOnly = data.filter(h => !(h.end_date && h.end_date < todayStr));
        setHabits(activeOnly);
      }
      setLoading(false);
    };
    
    fetchHabits();
  }, [userId]);

  if (loading || habits.length === 0) return null;

  const rootHabits = habits.filter(h => !h.stacked_on_id);
  const getChildren = (parentId: string) => habits.filter(h => h.stacked_on_id === parentId);

  const renderHabitNode = (habit: Habit, depth: number = 0) => {
    const children = getChildren(habit.id);
    
    return (
      <div key={habit.id} className="flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          {depth > 0 && (
            <div className="w-4 h-6 border-l-2 border-b-2 border-indigo-500/30 rounded-bl-lg opacity-80" />
          )}
          <div className="bg-[#1a1a1a] border border-neutral-800 px-4 py-2.5 rounded-xl text-sm font-medium text-neutral-300 shadow-sm flex items-center gap-2">
            {depth === 0 && <Layers className="h-4 w-4 text-indigo-400" />}
            {habit.name}
          </div>
        </div>
        {children.length > 0 && (
          <div className="ml-4 flex flex-col pl-4 border-l-2 border-neutral-800/50">
            {children.map(child => renderHabitNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const hasStacks = habits.some(h => h.stacked_on_id !== null);
  if (!hasStacks) return null;

  return (
    <div className="mt-12 pt-8 border-t border-neutral-900">
      <div className="flex items-center gap-2 mb-6">
        <Layers className="h-5 w-5 text-indigo-400" />
        <h2 className="text-xl font-semibold tracking-tight">Habit Stacks</h2>
      </div>
      <div className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-6">
        <div className="space-y-6">
          {rootHabits.map(root => {
            const children = getChildren(root.id);
            if (children.length === 0) return null; 
            return renderHabitNode(root, 0);
          })}
        </div>
      </div>
    </div>
  );
}
