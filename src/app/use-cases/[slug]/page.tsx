import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { LoginButton } from "@/components/LoginButton";
import { useCases, getUseCaseBySlug } from "@/lib/seo-data";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const useCase = getUseCaseBySlug(params.slug);
  if (!useCase) {
    return { title: "Not Found" };
  }

  return {
    title: useCase.title,
    description: useCase.description,
    openGraph: {
      title: useCase.title,
      description: useCase.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: useCase.title,
      description: useCase.description,
    },
  };
}

export function generateStaticParams() {
  return useCases.map((uc) => ({
    slug: uc.slug,
  }));
}

export default function UseCasePage({ params }: Props) {
  const useCase = getUseCaseBySlug(params.slug);

  if (!useCase) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex flex-col font-sans selection:bg-indigo-500/30">
      
      {/* SoftwareApplication JSON-LD Schema - Tailored for this use case */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Praxim",
            "operatingSystem": "WebBrowser",
            "applicationCategory": "ProductivityApplication",
            "description": useCase.description,
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />

      {/* Header Navigation */}
      <header className="flex items-center justify-between p-6 max-w-6xl w-full mx-auto">
        <a href="/" className="font-semibold text-xl tracking-tight text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold leading-none">P</span>
          </div>
          Praxim
        </a>
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
        
        {/* Tailored Hero Section */}
        <section className="flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center">
          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 leading-tight">
              {useCase.h1}
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              {useCase.heroSubtitle}
            </p>
            
            <div className="pt-8 flex flex-col items-center gap-4">
              <LoginButton 
                className="bg-white text-black hover:bg-neutral-200 h-14 px-8 text-lg font-medium rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-1 group disabled:opacity-80"
              >
                Start Tracking Free
                <ArrowRight className="ml-2 h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
              </LoginButton>
            </div>
          </div>
        </section>

        {/* Dynamic Benefits Section */}
        <section className="py-20 px-6 bg-neutral-950/50 border-y border-neutral-900/50">
          <div className="max-w-6xl w-full mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Praxim works.</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">Built from the ground up for deep focus and intentional living.</p>
          </div>
          
          <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCase.benefits.map((benefit, i) => (
              <article key={i} className="bg-[#111] border border-neutral-800 p-8 rounded-3xl transition-all duration-500 hover:border-indigo-500/30 hover:bg-[#151515]">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                <p className="text-neutral-400 leading-relaxed">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Suggested Habits Section */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Routines to get you started</h2>
            <div className="bg-[#111] border border-neutral-800 rounded-3xl p-8 md:p-12 text-left max-w-2xl mx-auto">
              <ul className="space-y-6">
                {useCase.suggestedHabits.map((habit, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg text-neutral-300">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-medium">
                      {i + 1}
                    </div>
                    {habit}
                  </li>
                ))}
              </ul>
              <div className="mt-12 flex justify-center">
                <LoginButton variant="outline" className="text-white border-neutral-700 hover:bg-neutral-800">
                  Add these to your dashboard
                </LoginButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 mt-10 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-neutral-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-neutral-800 flex items-center justify-center">
              <span className="text-neutral-400 text-xs font-bold leading-none">P</span>
            </div>
            &copy; {new Date().getFullYear()} Praxim. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="/" className="hover:text-neutral-400 transition-colors">Home</a>
            <a href="/use-cases/adhd-habit-tracker" className="hover:text-neutral-400 transition-colors">ADHD Tracker</a>
            <a href="/use-cases/minimalist-habit-tracker" className="hover:text-neutral-400 transition-colors">Minimalist App</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
