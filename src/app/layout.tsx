import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Praxim",
    default: "Praxim | The Minimalist Habit & Mood Tracker",
  },
  description: "A beautifully simple habit and mood tracker designed for deep focus and distraction-free productivity. Free forever.",
  keywords: ["habit tracker", "mood tracker", "daily reflection", "minimalist habit app", "productivity tool", "ADHD tracker"],
  authors: [{ name: "Praxim" }],
  openGraph: {
    title: "Praxim | Minimalist Habit & Mood Tracker",
    description: "A beautifully simple habit and mood tracker designed for deep focus and distraction-free productivity.",
    url: "https://praxim.app",
    siteName: "Praxim",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Praxim | Minimalist Habit & Mood Tracker",
    description: "A beautifully simple habit and mood tracker designed for deep focus and distraction-free productivity.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Praxim",
              "url": "https://praxim.app",
              "description": "Minimalist habit and mood tracker for distraction-free productivity.",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
