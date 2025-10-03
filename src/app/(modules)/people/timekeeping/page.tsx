"use client";

import { useMemo } from "react";
import { useStaff, useTeamLabels } from "@/hooks/useApi";
import type { StaffMember } from "@/types/api";

export default function TimekeepingPage() {
  const { staff: staffMembers, loading: staffLoading } = useStaff({ page: 1, limit: 100, activeTab: "active" });
  const { labels: operationsTeams, loading: teamsLoading } = useTeamLabels();
  const loading = staffLoading || teamsLoading;
  const teamLookup = useMemo(() => operationsTeams.reduce<Record<string, string>>((acc, t) => { acc[t.key] = t.label; return acc; }, { logistics: "Giao vận" }), [operationsTeams]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Chấm công</h2>
          <p className="text-sm text-slate-600">Theo dõi tình trạng chấm công, gán tổ và phân ca phù hợp.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1 shadow-sm">{staffMembers.length} nhân sự</span>
          <span className="rounded-full border border-slate-300 bg-white px-3 py-1 shadow-sm">6 tổ sản xuất + giao vận</span>
        </div>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Bảng chấm công</h3>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Nhân sự</th>
                <th className="px-3 py-2 text-left">Vai trò</th>
                <th className="px-3 py-2 text-left">Ca trực</th>
                <th className="px-3 py-2 text-left">Tổ đang gán</th>
                <th className="px-3 py-2 text-left">Trạng thái</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">Đang tải dữ liệu...</td></tr>
              ) : staffMembers.map((member: StaffMember) => (
                <tr key={member.id} className="hover:bg-slate-50">
                  <td className="px-3 py-3">
                    <div className="font-medium text-slate-900">{member.name}</div>
                    <div className="text-xs text-slate-500">{member.id}</div>
                  </td>
                  <td className="px-3 py-3 text-slate-700">{member.role}</td>
                  <td className="px-3 py-3 text-slate-700">{member.shift}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">{member.teamKey ? (teamLookup[member.teamKey] ?? "Không xác định") : "Chưa gán"}</span>
                  </td>
                  <td className="px-3 py-3 text-xs"><span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">{member.status}</span></td>
                  <td className="px-3 py-3 text-right"><button className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs uppercase tracking-wide text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700">Ghi nhận</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

