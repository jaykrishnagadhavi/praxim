import * as React from "react";
import { CheckCircle2, Brain, Activity, ArrowRight, Check } from "lucide-react";
import { LoginButton } from "@/components/LoginButton";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* SoftwareApplication JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Praxim",
            "operatingSystem": "WebBrowser",
            "applicationCategory": "ProductivityApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Praxim is a beautifully minimalist habit and mood tracker designed for deep focus and distraction-free productivity.",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "102"
            }
          })
        }}
      />

      {/* Header Navigation */}
      <header className="flex items-center justify-between p-6 max-w-6xl w-full mx-auto">
        <div className="font-semibold text-xl tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold leading-none">P</span>
          </div>
          Praxim
        </div>
        <nav aria-label="Main Navigation">
          <LoginButton 
            variant="ghost" 
            showError={false}
            className="text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Sign In
          </LoginButton>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center">
          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">
              The Minimalist Habit & Mood Tracker <br className="hidden md:block" /> for Deep Focus.
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              A beautifully simple workspace to stack your daily routines, track your mental wellbeing, and capture daily reflections. 
              Built for focus, designed for momentum.
            </p>
            
            <div className="pt-8 flex flex-col items-center gap-4">
              <LoginButton 
                className="bg-white text-black hover:bg-neutral-200 h-14 px-8 text-lg font-medium rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-1 group disabled:opacity-80"
              >
                Continue with Google
                <ArrowRight className="ml-2 h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
              </LoginButton>

              <p className="text-xs text-neutral-600">
                Free forever. No credit card required.
              </p>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-20 px-6 bg-neutral-950/50 border-y border-neutral-900/50">
          <div className="max-w-6xl w-full mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need. Nothing you don't.</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">We stripped away the gamification, ads, and noise to build a pure productivity tool.</p>
          </div>
          
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="bg-[#111] border border-neutral-800 p-8 rounded-3xl transition-all duration-500 hover:border-indigo-500/30 hover:bg-[#151515]">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Intelligent Habit Stacking</h3>
              <p className="text-neutral-400 leading-relaxed">
                Separate tasks by Daily, Weekly, or Monthly horizons. Completed items gracefully move out of your way to keep you focused on what's next. Build long-lasting discipline effortlessly.
              </p>
            </article>

            <article className="bg-[#111] border border-neutral-800 p-8 rounded-3xl transition-all duration-500 hover:border-emerald-500/30 hover:bg-[#151515]">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Daily Micro-Reflections</h3>
              <p className="text-neutral-400 leading-relaxed">
                Capture quick thoughts, journal ideas, or lessons in the exact moment. Every entry is automatically timestamped, creating a secure, searchable daily reflection log.
              </p>
            </article>

            <article className="bg-[#111] border border-neutral-800 p-8 rounded-3xl transition-all duration-500 hover:border-amber-500/30 hover:bg-[#151515]">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Activity className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Mood & Insight Analytics</h3>
              <p className="text-neutral-400 leading-relaxed">
                Monitor your emotional consistency and habit completion with visual progress bars. Get real-time completion rates and an aggregated 30-day activity history.
              </p>
            </article>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">How Praxim drives momentum</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector line on desktop */}
              <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-neutral-800 -z-10" />
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center text-xl font-bold text-white mb-6">1</div>
                <h3 className="text-lg font-semibold text-white mb-2">Set Your Routines</h3>
                <p className="text-neutral-400 text-sm">Define what success looks like daily, weekly, and monthly.</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-indigo-900/50 border-2 border-indigo-500 flex items-center justify-center text-xl font-bold text-white mb-6">2</div>
                <h3 className="text-lg font-semibold text-white mb-2">Execute & Track</h3>
                <p className="text-neutral-400 text-sm">Check off habits and log your mood with zero friction.</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center text-xl font-bold text-white mb-6">3</div>
                <h3 className="text-lg font-semibold text-white mb-2">Reflect & Review</h3>
                <p className="text-neutral-400 text-sm">Look back at your micro-reflections and analytics to adjust.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6 bg-neutral-950/50 border-y border-neutral-900/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <article>
                <h3 className="text-lg font-medium text-white">Is Praxim really free?</h3>
                <p className="text-neutral-400 mt-2">Yes, Praxim is completely free to use. We believe everyone deserves access to a clean, distraction-free productivity tool.</p>
              </article>
              <article>
                <h3 className="text-lg font-medium text-white">Can I track my mood alongside habits?</h3>
                <p className="text-neutral-400 mt-2">Absolutely. Praxim features an integrated mood tracker that allows you to log your daily emotional state alongside your micro-reflections.</p>
              </article>
              <article>
                <h3 className="text-lg font-medium text-white">Is my data secure?</h3>
                <p className="text-neutral-400 mt-2">We use secure Google OAuth for login and Supabase for database management, ensuring your private reflections and habits stay private.</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 mt-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-neutral-900 pb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="font-semibold text-xl text-white flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
                <span className="text-white text-xs font-bold leading-none">P</span>
              </div>
              Praxim
            </div>
            <p className="text-neutral-500 text-sm max-w-xs">
              The minimalist habit and mood tracker built for deep focus and distraction-free productivity.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Use Cases</h4>
            <ul className="space-y-2 text-sm text-neutral-500 flex flex-col">
              <a href="/use-cases/adhd-habit-tracker" className="hover:text-indigo-400 transition-colors">ADHD Habit Tracker</a>
              <a href="/use-cases/minimalist-habit-tracker" className="hover:text-indigo-400 transition-colors">Minimalist Habit Tracker</a>
              <a href="/use-cases/student-routine-planner" className="hover:text-indigo-400 transition-colors">Student Routine Planner</a>
              <a href="/use-cases/daily-mood-journal" className="hover:text-indigo-400 transition-colors">Daily Mood Journal</a>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-neutral-500 flex flex-col">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </ul>
          </div>
        </div>
        
        <div className="text-center text-neutral-600 text-sm">
          &copy; {new Date().getFullYear()} Praxim. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
