"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const MOODS = [
  { emoji: "😫", label: "Terrible", value: "terrible" },
  { emoji: "🙁", label: "Bad", value: "bad" },
  { emoji: "😐", label: "Okay", value: "okay" },
  { emoji: "🙂", label: "Good", value: "good" },
  { emoji: "🤩", label: "Great", value: "great" },
];

export default function MoodTracker({ userId }: { userId: string }) {
  const supabase = createClient();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleMoodSelect = async (mood: typeof MOODS[0]) => {
    if (isSubmitting || isSaved) return;
    
    setIsSubmitting(true);
    setSelectedMood(mood.value);
    
    const now = new Date();
    const today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    // We log it to daily_reflections using a special prefix so the archive can parse it
    const { error } = await supabase
      .from("daily_reflections")
      .insert({
        user_id: userId,
        date: today,
        reflection_text: `[Mood: ${mood.emoji}] ${mood.label} - ${timeStr}`
      });
      
    if (error) {
      console.error("Error saving mood:", error);
      setIsSubmitting(false);
      setSelectedMood(null);
      return;
    }
    
    setIsSubmitting(false);
    setIsSaved(true);
    
    // reset visual state after a delay
    setTimeout(() => {
      setIsSaved(false);
      setSelectedMood(null);
    }, 4000);
  };

  return (
    <div className="mt-8 border-t border-neutral-900 pt-8">
      <div className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-indigo-400 uppercase tracking-widest mb-1">Mood Tracker</h3>
            <p className="text-sm text-neutral-400">How are you feeling right now?</p>
          </div>
          {isSaved && (
            <span className="text-xs font-medium text-emerald-400 animate-in fade-in zoom-in duration-300">
              Mood logged!
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between gap-2 mt-6">
          {MOODS.map((mood) => {
            const isSelected = selectedMood === mood.value;
            return (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood)}
                disabled={isSubmitting || isSaved}
                className={cn(
                  "relative flex-1 flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300",
                  "border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900/50",
                  isSelected && "border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)] scale-105",
                  (isSaved && !isSelected) && "opacity-40 grayscale pointer-events-none"
                )}
              >
                {isSubmitting && isSelected ? (
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-2" />
                ) : (
                  <span className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-110">
                    {mood.emoji}
                  </span>
                )}
                <span className={cn(
                  "text-[10px] font-medium tracking-wide uppercase",
                  isSelected ? "text-indigo-400" : "text-neutral-500"
                )}>
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
