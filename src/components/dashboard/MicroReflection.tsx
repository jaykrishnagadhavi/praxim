"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MicroReflection({ userId }: { userId: string }) {
  const supabase = createClient();
  const [reflection, setReflection] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflection.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const now = new Date();
    // Use local YYYY-MM-DD for the date column to perfectly match Supabase's DATE type truncation
    const today = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    
    const { error } = await supabase
      .from("daily_reflections")
      .insert({
        user_id: userId,
        date: today,
        reflection_text: `[${timeStr}] ${reflection.trim()}`
      });
      
    if (error) {
      console.error("Error saving reflection:", JSON.stringify(error, null, 2), error);
      alert(`Error saving reflection: ${error.message}\nDetails: ${error.details}\nHint: ${error.hint}`);
      setIsSubmitting(false);
      return;
    }
    
    // Reset the form
    setReflection("");
    setIsSubmitting(false);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };



  return (
    <div className="mt-12 pt-8 border-t border-neutral-900">
      <div className="bg-[#0f0f0f] border border-neutral-800 rounded-2xl p-6">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-indigo-400 uppercase tracking-widest mb-1">Micro-Reflection</h3>
          <p className="text-sm text-neutral-400">In 5 words or less, what did you learn today?</p>
        </div>
        <form onSubmit={handleSave} className="relative">
          <input
            type="text"
            value={reflection}
            onChange={(e) => {
              setReflection(e.target.value);
              setIsSaved(false);
            }}
            placeholder="Log your reflection..."
            className="w-full bg-black border border-neutral-800 rounded-xl px-5 py-4 text-neutral-200 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner pr-14"
          />
          <button 
            type="submit"
            disabled={!reflection.trim() || isSubmitting || isSaved}
            className={cn(
              "absolute right-2 top-2 bottom-2 px-4 rounded-lg flex items-center justify-center transition-all duration-300",
              isSaved 
                ? "bg-emerald-500/20 text-emerald-500" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:shadow-none"
            )}
          >
            {isSaved ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
