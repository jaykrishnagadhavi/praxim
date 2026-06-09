"use client";

import * as React from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Brain, Activity, ArrowRight, Loader2 } from "lucide-react";

export default function LandingPage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error("Auth error:", error);
        setErrorMessage(`Login failed: ${error.message}. Please make sure Google Auth is enabled and redirect URLs include ${window.location.origin}`);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setErrorMessage(`An unexpected error occurred: ${err.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-6xl w-full mx-auto">
        <div className="font-semibold text-xl tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold leading-none">P</span>
          </div>
          Praxim
        </div>
        <Button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          variant="ghost"
          className="text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
        </Button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
            Theory into <br className="hidden md:block" /> maximum action.
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            A beautifully minimal workspace to stack your habits, track your progress, and capture daily reflections. 
            Built for focus, designed for momentum.
          </p>
          
          <div className="pt-8 flex flex-col items-center gap-4">
            <Button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="bg-white text-black hover:bg-neutral-200 h-14 px-8 text-lg font-medium rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-1 group disabled:opacity-80 disabled:hover:-translate-y-0 disabled:hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Continue with Google
                  <ArrowRight className="ml-2 h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            
            {errorMessage && (
              <div className="text-red-400 text-sm max-w-md bg-red-500/10 p-4 rounded-xl border border-red-500/20 animate-in fade-in zoom-in-95 duration-200">
                {errorMessage}
              </div>
            )}

            <p className="text-xs text-neutral-600">
              Free forever. No credit card required.
            </p>
          </div>
        </div>

        {/* Features Bento Grid */}
        <div className="max-w-6xl w-full mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
          
          <div className="bg-[#111] border border-neutral-800 p-8 rounded-3xl transition-all duration-500 hover:border-indigo-500/30 hover:bg-[#151515] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle2 className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Intelligent Stacking</h3>
            <p className="text-neutral-400 leading-relaxed">
              Separate tasks by Daily, Weekly, or Monthly horizons. Completed items gracefully move out of your way to keep you focused on what's next.
            </p>
          </div>

          <div className="bg-[#111] border border-neutral-800 p-8 rounded-3xl transition-all duration-500 hover:border-emerald-500/30 hover:bg-[#151515] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Brain className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Micro-Reflections</h3>
            <p className="text-neutral-400 leading-relaxed">
              Capture quick thoughts, ideas, or lessons in the exact moment. Every entry is automatically timestamped and safely stored.
            </p>
          </div>

          <div className="bg-[#111] border border-neutral-800 p-8 rounded-3xl transition-all duration-500 hover:border-amber-500/30 hover:bg-[#151515] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Activity className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Insightful Analytics</h3>
            <p className="text-neutral-400 leading-relaxed">
              Monitor your consistency with visual progress bars, real-time completion rates, and an aggregated 30-day activity history.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12 text-center mt-20">
        <p className="text-neutral-600 text-sm">
          &copy; {new Date().getFullYear()} Praxim. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
