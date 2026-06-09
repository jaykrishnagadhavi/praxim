"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DashboardNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Active Habits" },
    { href: "/dashboard/stats", label: "Stats" },
    { href: "/dashboard/archive", label: "Archive" },
    { href: "/dashboard/reflections", label: "Reflections" },
  ];

  return (
    <nav className="flex space-x-6 border-b border-neutral-800 mb-8 mt-6">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "pb-4 text-sm font-medium transition-colors border-b-2",
              isActive
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-neutral-500 hover:text-neutral-300 hover:border-neutral-700"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
