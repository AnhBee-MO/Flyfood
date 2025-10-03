"use client";

import { useEffect, useState } from "react";
import { fetchJson, getCached, setCached } from "@/lib/api";
import type { Brand, TeamLabel, StaffMember } from "@/types/api";

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | undefined>(() => getCached<T>(url));
  const [loading, setLoading] = useState<boolean>(!Boolean(getCached<T>(url)));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!getCached<T>(url)) {
      (async () => {
        try {
          const json = await fetchJson<T>(url);
          if (!cancelled) {
            setCached(url, json);
            setData(json);
          }
        } catch (err) {
          if (!cancelled) setError(err as Error);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
    }
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error } as const;
}

export function useTeamLabels() {
  const { data, loading, error } = useApi<{ labels: TeamLabel[] }>("/api/operations/team-labels");
  return { labels: (data?.labels as TeamLabel[]) ?? [], loading, error } as const;
}

export function useBrands() {
  const { data, loading, error } = useApi<{ brands: Brand[] }>("/api/brands");
  return { brands: (data?.brands as Brand[]) ?? [], loading, error } as const;
}

export type StaffQuery = {
  page?: number;
  limit?: number;
  searchQuery?: string;
  roleFilter?: string;
  brandFilter?: string;
  teamFilter?: string;
  activeTab?: "active" | "suspended";
};

export function useStaff(query: StaffQuery) {
  const params = new URLSearchParams({
    page: String(query.page ?? 1),
    limit: String(query.limit ?? 10),
    searchQuery: query.searchQuery ?? "",
    roleFilter: query.roleFilter ?? "all",
    brandFilter: query.brandFilter ?? "all",
    teamFilter: query.teamFilter ?? "all",
    activeTab: query.activeTab ?? "active",
  });
  const url = "/api/staff?" + params.toString();
  const { data, loading, error } = useApi<{ total: number; page: number; limit: number; data: StaffMember[]; allRoles: string[]; allBrands: string[]; allTeams: string[] }>(url);
  return {
    staff: data?.data ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? (query.page ?? 1),
    limit: data?.limit ?? (query.limit ?? 10),
    allRoles: data?.allRoles ?? [],
    allBrands: data?.allBrands ?? [],
    allTeams: data?.allTeams ?? [],
    loading,
    error,
  } as const;
}
