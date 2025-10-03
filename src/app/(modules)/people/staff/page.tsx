"use client";

import { useMemo, useState } from "react";
import { PencilIcon, EyeIcon, UserPlusIcon, XCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import AddStaffModal from "../components/AddStaffModal";
import Pagination from "../components/Pagination";
import { useBrands, useStaff, useTeamLabels } from "@/hooks/useApi";
import type { StaffMember } from "@/types/api";

const tabs = [
  { id: "active", name: "Đang làm" },
  { id: "suspended", name: "Tạm ngưng" },
];

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"active" | "suspended">("active");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;
  const { staff: paginatedStaff, total: totalStaff, allRoles, allBrands, loading: isLoading } = useStaff({
    page: currentPage,
    limit: itemsPerPage,
    searchQuery,
    roleFilter,
    brandFilter,
    teamFilter,
    activeTab,
  });
  const totalPages = Math.ceil(totalStaff / itemsPerPage);
  const { labels: operationsTeams } = useTeamLabels();
  const { brands: brandDirectory } = useBrands();

  const handleSuspendStaff = async (staffId: string) => {
    const idx = paginatedStaff.findIndex((m) => m.id === staffId);
    if (idx >= 0) paginatedStaff[idx].status = "Tạm ngưng";
  };

  const handleAddStaff = async () => { /* TODO: call API to add staff, then refresh */ };

  const teamLookup = useMemo(() => {
    return operationsTeams.reduce<Record<string, string>>((acc, team) => {
      acc[team.key] = team.label;
      return acc;
    }, { logistics: "Giao vận" });
  }, [operationsTeams]);

  const brandLookup = useMemo(() => {
    return brandDirectory.reduce<Record<string, string>>((acc, brand) => {
      acc[brand.id] = brand.name;
      return acc;
    }, {});
  }, [brandDirectory]);

  const hasActiveFilters = searchQuery.trim().length > 0 || roleFilter !== "all" || brandFilter !== "all" || teamFilter !== "all";

  const handleResetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setBrandFilter("all");
    setTeamFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {isModalOpen && (
        <AddStaffModal onClose={() => setIsModalOpen(false)} onAddStaff={handleAddStaff} />
      )}
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Quản lý nhân viên</h2>
          <p className="text-sm text-slate-600">Quản lý thông tin, vai trò và trạng thái làm việc của nhân viên.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          <UserPlusIcon className="h-4 w-4" />
          Thêm nhân viên mới
        </button>
      </header>

      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as "active" | "suspended"); setCurrentPage(1); }}
              className={classNames(
                tab.id === activeTab ? "border-sky-500 text-sky-600" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700",
                "whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium"
              )}
              aria-current={tab.id === activeTab ? "page" : undefined}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4">
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="relative text-sm">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true" />
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm nhân viên"
                  className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                />
              </div>
            </div>
            <div className="md:col-span-8 flex items-center justify-end gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                >
                  <XCircleIcon className="h-4 w-4" />
                  <span>Xóa bộ lọc</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 text-left">Nhân sự</th>
                <th className="px-4 py-3 text-left">Vai trò</th>
                <th className="px-4 py-3 text-left">Thương hiệu</th>
                <th className="px-4 py-3 text-left">Tổ đang gán</th>
                <th className="px-4 py-3 text-left">Quyền thao tác</th>
                <th className="px-4 py-3 text-left">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">Đang tải dữ liệu...</td>
                </tr>
              ) : paginatedStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">Không tìm thấy nhân sự phù hợp với bộ lọc hiện tại.</td>
                </tr>
              ) : (
                paginatedStaff.map((member: StaffMember) => (
                  <tr key={member.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 align-middle">
                      <div className="font-medium text-slate-900">{member.name}</div>
                      <div className="text-xs font-mono text-slate-500">{member.id}</div>
                    </td>
                    <td className="px-4 py-3 align-middle text-slate-700">{member.role}</td>
                    <td className="px-4 py-3 align-middle">
                      <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">{brandLookup[member.brandId] ?? "Không xác định"}</span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">{member.teamKey ? (teamLookup[member.teamKey] ?? "Không xác định") : "Chưa gán"}</span>
                    </td>
                    <td className="px-4 py-3 align-middle text-xs text-slate-600">
                      <ul className="space-y-1">
                        {member.permissions.map((permission) => (
                          <li key={permission} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            {permission}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 align-middle text-xs">
                      <span className="rounded-full border px-3 py-1 shadow-sm">
                        {member.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-sky-700" aria-label={`Chỉnh sửa ${member.name}`} title="Chỉnh sửa">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-sky-700" aria-label={`Xem chi tiết ${member.name}`} title="Chi tiết">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleSuspendStaff(member.id)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-rose-700" aria-label={`Tạm ngưng ${member.name}`} title="Tạm ngưng">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </section>
    </div>
  );
}

