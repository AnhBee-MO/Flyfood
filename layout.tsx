"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { moduleNavigation } from "@/data/dashboard";
import type { ModuleNavItem } from "@/data/dashboard";

export default function ModulesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const getItemClasses = (href: string) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);
    return [
      "block rounded-2xl border px-4 py-3 transition",
      isActive
        ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm"
        : "border-transparent text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700",
    ].join(" ");
  };

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="hidden w-72 flex-shrink-0 border-r border-slate-200 bg-white px-4 py-6 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:gap-2 lg:overflow-y-auto">
        {moduleNavigation.map((item: ModuleNavItem) => (
          <Link key={item.key} href={item.href} className={getItemClasses(item.href)}>
            <span className="text-sm font-semibold uppercase tracking-wide">{item.label}</span>
          </Link>
        ))}
      </aside>

      <div className="flex-1">
        <nav className="border-b border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {moduleNavigation.map((item: ModuleNavItem) => (
              <Link
                key={item.key}
                href={item.href}
                className={`${getItemClasses(item.href)} min-w-[240px]`}
              >
                <span className="text-xs font-semibold uppercase tracking-wide">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
