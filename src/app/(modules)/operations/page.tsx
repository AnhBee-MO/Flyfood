"use client";

import { useEffect, useMemo, useState } from "react";

type TeamKey = "prep" | "cooking" | "sauce" | "dessert" | "plating" | "qc";
type CheckIn = { label: string; value: string };
type TaskStatus = "todo" | "doing" | "waiting" | "done" | "risk";
type Task = { id: string; title: string; linkedOrder: string; status: TaskStatus; eta: string; priority: string };
type Handoff = { to: string; sla: string; criteria: string[] };
type OpsTeam = {
  key: TeamKey;
  label: string;
  shortLabel: string;
  tone: "emerald" | "sky" | "amber" | "rose";
  shift: string;
  supervisor: string;
  currentLoad: string;
  responsibilities: string[];
  checkIns: CheckIn[];
  tasks: Task[];
  handoff: Handoff;
  alerts?: string[];
  notes?: string[];
};

const toneBadgeStyles: Record<string, string> = {
  emerald: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  sky: "border border-sky-200 bg-sky-50 text-sky-700",
  amber: "border border-amber-200 bg-amber-50 text-amber-700",
  rose: "border border-rose-200 bg-rose-50 text-rose-700",
};

const workflowStatusStyles: Record<TaskStatus, string> = {
  todo: "border border-slate-200 bg-slate-50 text-slate-600",
  doing: "border border-emerald-200 bg-emerald-50 text-emerald-600",
  waiting: "border border-amber-200 bg-amber-50 text-amber-600",
  done: "border border-sky-200 bg-sky-50 text-sky-600",
  risk: "border border-rose-200 bg-rose-50 text-rose-600",
};

const workflowStatusLabel: Record<TaskStatus, string> = {
  todo: "Chờ xử lý",
  doing: "Đang thực hiện",
  waiting: "Đang chờ",
  done: "Hoàn tất",
  risk: "Nguy cơ",
};

export default function OperationsPage() {
  const [viewMode, setViewMode] = useState<"admin" | "member">("admin");
  const [selectedTeamKey, setSelectedTeamKey] = useState<TeamKey>("prep");
  const [memberTeamKey, setMemberTeamKey] = useState<TeamKey>("prep");
  const [teams, setTeams] = useState<OpsTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/operations/teams");
        const json = await res.json();
        if (!cancelled) setTeams((json.teams ?? []) as OpsTeam[]);
      } catch {}
      finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const visibleTeams = useMemo(() => {
    if (viewMode === "admin") return teams;
    return teams.filter((team) => team.key === memberTeamKey);
  }, [teams, viewMode, memberTeamKey]);

  const activeTeam = useMemo<OpsTeam | null>(() => {
    if (!teams.length) return null;
    if (viewMode === "admin") return teams.find((t) => t.key === selectedTeamKey) ?? teams[0];
    return teams.find((t) => t.key === memberTeamKey) ?? teams[0];
  }, [teams, selectedTeamKey, memberTeamKey, viewMode]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Quản trị tổ sản xuất</h2>
          <p className="text-sm text-slate-600">Chuyển đổi giữa chế độ giám sát và chế độ nhân viên để xem khối lượng công việc thực tế của từng tổ.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1 rounded-full border border-slate-300 bg-white px-3 py-1 shadow-sm">
            <button onClick={() => setViewMode("admin")} className={`rounded-full px-3 py-1 font-semibold uppercase tracking-wide ${viewMode === "admin" ? "border border-emerald-300 bg-emerald-50 text-emerald-700" : "text-slate-500"}`}>Chế độ Admin</button>
            <button onClick={() => setViewMode("member")} className={`rounded-full px-3 py-1 font-semibold uppercase tracking-wide ${viewMode === "member" ? "border border-emerald-300 bg-emerald-50 text-emerald-700" : "text-slate-500"}`}>Chế độ Nhân viên</button>
          </div>
          {viewMode === "member" ? (
            <label className="flex items-center gap-2">
              <span>Chọn tổ:</span>
              <select value={memberTeamKey} onChange={(e) => setMemberTeamKey(e.target.value as TeamKey)} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm focus:border-emerald-300">
                {teams.map((team) => (
                  <option key={team.key} value={team.key}>{team.label}</option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {loading && !teams.length ? (
            <span className="text-xs text-slate-500">Đang tải danh sách tổ...</span>
          ) : (
            visibleTeams.map((team) => (
              <button
                key={team.key}
                onClick={() => setSelectedTeamKey(team.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wide transition ${activeTeam && activeTeam.key === team.key ? "border border-emerald-300 bg-emerald-50 text-emerald-700" : "border border-slate-300 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50"}`}
                disabled={viewMode === "member"}
              >
                {team.shortLabel}
              </button>
            ))
          )}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
              {activeTeam ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Thông tin tổ</p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">{activeTeam.label}</h3>
                      <p className="text-xs text-slate-500">Ca trực: {activeTeam.shift}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${toneBadgeStyles[activeTeam.tone]}`}>{activeTeam.currentLoad}</span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-700">
                    <p><span className="text-slate-500">Tổ trưởng:</span> {activeTeam.supervisor}</p>
                    <p><span className="text-slate-500">Bàn giao cho:</span> {activeTeam.handoff.to}</p>
                    <p><span className="text-slate-500">SLA:</span> {activeTeam.handoff.sla}</p>
                  </div>
                  <div className="mt-4 grid gap-2">
                    {activeTeam.checkIns.map((item) => (
                      <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm">
                        <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                        <p className="text-base font-semibold text-slate-900">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-slate-600">Chọn tổ để xem thông tin.</p>
              )}
            </div>

            {activeTeam?.responsibilities?.length ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Trọng tâm ca trực</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {activeTeam.responsibilities.map((item) => (
                    <li key={item} className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {activeTeam?.alerts?.length ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em]">Cảnh báo</p>
                <ul className="mt-2 space-y-1">
                  {activeTeam.alerts.map((alert) => (
                    <li key={alert} className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400"></span>{alert}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {activeTeam?.notes?.length ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Ghi chú</p>
                <ul className="mt-2 space-y-1">
                  {activeTeam.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>

          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Công việc trong ca</h4>
                  <p className="text-xs text-slate-500">Liên kết trực tiếp với SLA bàn giao và trạng thái đơn hàng.</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <button className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 uppercase tracking-wide text-emerald-700 hover:bg-emerald-100">Giao việc mới</button>
                  <button className="rounded-full border border-slate-300 bg-white px-3 py-1 uppercase tracking-wide hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700">Xuất checklist</button>
                </div>
              </header>

              <div className="mt-4 grid gap-3 text-sm text-slate-700">
                {activeTeam?.tasks?.map((task) => (
                  <div key={task.id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-inner">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <span>{task.id} – {task.linkedOrder}</span>
                      <span>{task.eta}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-base font-medium text-slate-900">{task.title}</p>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className={`rounded-full px-2 py-1 ${workflowStatusStyles[task.status]}`}>{workflowStatusLabel[task.status]}</span>
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-amber-700">{task.priority}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-900">Điều kiện bàn giao</h4>
              <p className="mt-2 text-sm text-slate-600">Tổ nhận: {activeTeam?.handoff?.to} – SLA: {activeTeam?.handoff?.sla}</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {activeTeam?.handoff?.criteria?.map((criterion) => (
                  <li key={criterion} className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>{criterion}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

