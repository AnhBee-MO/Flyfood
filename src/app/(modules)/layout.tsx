"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { ComponentType, SVGProps } from "react";
import {
  TagIcon,
  UsersIcon,
  ShoppingCartIcon,
  ArchiveBoxIcon,
  TruckIcon,
  CubeIcon,
  ArrowsRightLeftIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

type ModuleKey =
  | "branding"
  | "people"
  | "orders"
  | "warehouse"
  | "supply"
  | "product"
  | "distribution"
  | "operations"
  | "productionFinish";

type ModuleNavItem = {
  key: ModuleKey;
  label: string;
  href: string;
};

type ModuleSubNavItem = {
  label: string;
  href: string;
};

export default function ModulesLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [navigation, setNavigation] = useState<ModuleNavItem[]>([]);
  const [subNavigation, setSubNavigation] = useState<Partial<Record<ModuleKey, ModuleSubNavItem[]>>>({});
  const [openSubmenus, setOpenSubmenus] = useState<Partial<Record<ModuleKey, boolean>>>({});

  const iconMap: Record<ModuleKey, ComponentType<SVGProps<SVGSVGElement>>> = {
    branding: TagIcon,
    people: UsersIcon,
    orders: ShoppingCartIcon,
    warehouse: ArchiveBoxIcon,
    supply: TruckIcon,
    product: CubeIcon,
    distribution: ArrowsRightLeftIcon,
    operations: WrenchScrewdriverIcon,
    productionFinish: CheckCircleIcon,
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/navigation");
        const json = await res.json();
        if (!cancelled) {
          setNavigation(json.navigation ?? []);
          setSubNavigation(json.subNavigation ?? {});
        }
      } catch {
        // no-op
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!navigation.length) return;
    setOpenSubmenus((previous) => {
      const next = { ...previous };
      navigation.forEach((item) => {
        const hasSub = (subNavigation[item.key]?.length ?? 0) > 0;
        if (hasSub && pathname.startsWith(item.href)) {
          next[item.key] = true;
        }
      });
      return next;
    });
  }, [pathname, navigation, subNavigation]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem("sidebar:collapsed") : null;
      if (raw === "1" || raw === "true") {
        setCollapsed(true);
      }
    } catch {}
  }, []);

  const makeItemClasses = (href: string, extra?: string) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    let classes = "group flex items-center gap-3 rounded-lg px-3 py-2 transition-all";

    if (extra) {
      classes += " " + extra;
    }

    if (isActive) {
      classes += " bg-slate-100 text-slate-900";
    } else {
      classes += " text-slate-600 hover:bg-slate-50 hover:text-slate-900";
    }

    return classes;
  };

  const getSubItemClasses = (href: string) => {
    const isActive = pathname === href;
    let classes = "block rounded-md px-3 py-2 text-sm transition-all";

    if (isActive) {
      classes += " bg-slate-100 text-slate-900";
    } else {
      classes += " text-slate-500 hover:bg-slate-50 hover:text-slate-900";
    }

    return classes;
  };

  const handleToggleSubmenu = (key: ModuleKey) => {
    if ((subNavigation[key]?.length ?? 0) === 0) {
      return;
    }

    setOpenSubmenus((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const isSubmenuOpen = (key: ModuleKey) => {
    return Boolean(openSubmenus[key]);
  };

  const handleToggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem("sidebar:collapsed", next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  return (
    <div
      className={
        "min-h-screen bg-slate-100 lg:grid " + (collapsed ? "lg:grid-cols-[64px_1fr]" : "lg:grid-cols-[280px_1fr]")
      }
    >
      <aside
        className={
          "hidden flex-shrink-0 border-r border-slate-200 bg-white py-6 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:gap-4 lg:overflow-y-auto " +
          (collapsed ? "w-16 px-2 items-center" : "w-72 px-4")
        }
      >
        <div className={(collapsed ? "justify-center" : "justify-between") + " flex items-center px-2 pb-2 w-full"}>
          {!collapsed && (
            <span className="text-xl font-bold tracking-tighter text-slate-900">Flyfood Dashboard</span>
          )}
          {collapsed && (
            <span aria-hidden className="text-lg font-bold text-slate-900">F</span>
          )}
          <button
            type="button"
            onClick={handleToggleSidebar}
            aria-label={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            className={
              "inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 " +
              (collapsed ? "" : "ml-2")
            }
            title={collapsed ? "Mở rộng" : "Thu gọn"}
          >
            <svg
              className={"h-4 w-4 transition " + (collapsed ? "rotate-180" : "")}
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path d="M12 6l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <hr className="border-slate-200" />
        <nav className="flex flex-col gap-1 w-full">
          {navigation.map((item) => {
            const subItems = subNavigation[item.key] ?? [];
            const hasSubItems = subItems.length > 0;
            const Icon = iconMap[item.key];

            if (!hasSubItems || collapsed) {
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={makeItemClasses(item.href, collapsed ? "justify-center px-0" : undefined)}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className={collapsed ? "sr-only" : "text-sm font-medium"}>{item.label}</span>
                </Link>
              );
            }

            const submenuId = item.key + "-submenu";
            const open = isSubmenuOpen(item.key);

            return (
              <div key={item.key} className="space-y-1">
                <div className={makeItemClasses(item.href, "justify-between")}> 
                  <Link href={item.href} className="flex flex-1 items-center gap-3">
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                  <button
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    aria-label={"Toggle " + item.label}
                    aria-expanded={open}
                    aria-controls={submenuId}
                    onClick={() => handleToggleSubmenu(item.key)}
                  >
                    <svg
                      className={"h-4 w-4 transition " + (open ? "rotate-180" : "")}
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                {open && (
                  <div id={submenuId} className="ml-6 space-y-1 border-l border-slate-200 pl-4">
                    {subItems.map((subItem) => (
                      <Link key={subItem.href} href={subItem.href} className={getSubItemClasses(subItem.href)}>
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1">
        <nav className="border-b border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {navigation.map((item) => {
              const Icon = iconMap[item.key];
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={makeItemClasses(item.href, "flex min-w-[200px] flex-col items-start")}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-semibold uppercase tracking-wide">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <main className="flex-1 px-4 py-6 sm:px-8 lg:px-12 xl:px-16">
          {children}
        </main>
      </div>
    </div>
  );
}
