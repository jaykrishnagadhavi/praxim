"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Target, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OnboardingWizard() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [identityFocus, setIdentityFocus] = useState("");
  const [hoursReclaimed, setHoursReclaimed] = useState("");
  const [habit1, setHabit1] = useState("");
  const [habit2, setHabit2] = useState("");
  const [habit3, setHabit3] = useState("");

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handleComplete = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // 1. Update Profile
      await supabase
        .from("profiles")
        .update({
          onboarding_completed: true,
          goals_metadata: {
            identity_focus: identityFocus,
            hours_reclaimed: hoursReclaimed,
          }
        })
        .eq("id", session.user.id);

      // 2. Create the foundational routine
      const habitsToInsert = [habit1, habit2, habit3]
        .filter(h => h.trim() !== "")
        .map(h => ({
          user_id: session.user.id,
          name: h,
          frequency: "daily"
        }));

      if (habitsToInsert.length > 0) {
        await supabase.from("habits").insert(habitsToInsert);
      }
      
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-[#0f0f0f] border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-neutral-900">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="space-y-8 mt-4">
          
          {/* STEP 1: Identity */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-indigo-500/10 border border-indigo-500/30 rounded-full flex items-center justify-center">
                  <Target className="h-8 w-8 text-indigo-400" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-center mb-2">Define Your Identity</h2>
              <p className="text-neutral-400 text-center mb-8">What is the core identity you are trying to build? (e.g., "I am an athlete", "I am a creator")</p>
              
              <input 
                autoFocus
                type="text"
                value={identityFocus}
                onChange={(e) => setIdentityFocus(e.target.value)}
                placeholder="I am a..."
                className="w-full bg-black border border-neutral-800 rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}

          {/* STEP 2: Time */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center">
                  <Clock className="h-8 w-8 text-amber-400" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-center mb-2">Reclaim Your Time</h2>
              <p className="text-neutral-400 text-center mb-8">How many hours of deep work do you want to secure every day?</p>
              
              <div className="grid grid-cols-3 gap-4">
                {["1-2 Hours", "3-4 Hours", "5+ Hours"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setHoursReclaimed(opt)}
                    className={cn(
                      "py-4 rounded-xl border transition-all duration-200 text-sm font-medium",
                      hoursReclaimed === opt 
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-500" 
                        : "bg-black border-neutral-800 text-neutral-400 hover:border-neutral-700"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Baseline Habit */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-center mb-2">Your Foundational Routine</h2>
              <p className="text-neutral-400 text-center mb-8">Define 3 daily habits to build your foundation. These will repeat every day.</p>
              
              <div className="space-y-4">
                <input 
                  autoFocus
                  type="text"
                  value={habit1}
                  onChange={(e) => setHabit1(e.target.value)}
                  placeholder="Habit 1 (e.g. Read 10 pages)"
                  className="w-full bg-black border border-neutral-800 rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <input 
                  type="text"
                  value={habit2}
                  onChange={(e) => setHabit2(e.target.value)}
                  placeholder="Habit 2 (e.g. 30 min workout)"
                  className="w-full bg-black border border-neutral-800 rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <input 
                  type="text"
                  value={habit3}
                  onChange={(e) => setHabit3(e.target.value)}
                  placeholder="Habit 3 (e.g. Drink 2L water)"
                  className="w-full bg-black border border-neutral-800 rounded-xl px-5 py-4 text-lg focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          )}

        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-10 pt-6 border-t border-neutral-800/50">
          <Button 
            variant="ghost" 
            onClick={handlePrev}
            className={cn("text-neutral-500 hover:text-white", step === 1 && "invisible")}
          >
            Back
          </Button>

          {step < 3 ? (
            <Button 
              onClick={handleNext}
              disabled={(step === 1 && !identityFocus) || (step === 2 && !hoursReclaimed)}
              className="bg-white text-black hover:bg-neutral-200"
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete}
              disabled={!habit1 || !habit2 || !habit3 || loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Enter Dashboard
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
