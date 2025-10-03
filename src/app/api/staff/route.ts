import { NextResponse } from "next/server";
import staffMembers from "@/data/staff.json";

type StaffMember = {
  id: string;
  name: string;
  role: string;
  shift: string;
  teamKey: string | null;
  brandId: string;
  permissions: string[];
  status: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const searchQuery = searchParams.get("searchQuery") || "";
  const roleFilter = searchParams.get("roleFilter") || "all";
  const brandFilter = searchParams.get("brandFilter") || "all";
  const teamFilter = searchParams.get("teamFilter") || "all";
  const activeTab = searchParams.get("activeTab") || "active";

  // Pre-calculate filter options from the full dataset
  const allRoles = [
    "all",
    ...Array.from(new Set((staffMembers as unknown as StaffMember[]).map((member) => member.role))),
  ];
  const allBrands = [
    "all",
    ...Array.from(
      new Set((staffMembers as unknown as StaffMember[]).map((member) => member.brandId).filter(Boolean))
    ),
  ];
  const allTeams = [
    "all",
    ...Array.from(
      new Set((staffMembers as unknown as StaffMember[]).map((member) => member.teamKey).filter(Boolean))
    ),
  ];

  // Filter logic
  const filteredData = (staffMembers as unknown as StaffMember[]).filter((member) => {
    const suspendedSet = new Set(["Tạm ngưng", "Tạm khóa", "Nghỉ phép"]);
    const matchesTab = activeTab === "active" ? !suspendedSet.has(member.status) : suspendedSet.has(member.status);

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !searchQuery ||
      member.name.toLowerCase().includes(normalizedQuery) ||
      member.id.toLowerCase().includes(normalizedQuery) ||
      member.role.toLowerCase().includes(normalizedQuery);

    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesBrand = brandFilter === "all" || member.brandId === brandFilter;
    const matchesTeam = teamFilter === "all" || member.teamKey === teamFilter;

    return matchesTab && matchesQuery && matchesRole && matchesBrand && matchesTeam;
  });

  // Sort
  const sortedData = filteredData.sort((a, b) => a.name.localeCompare(b.name, "vi", { sensitivity: "base" }));

  // Pagination logic
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  return NextResponse.json({
    total: filteredData.length,
    page,
    limit,
    data: paginatedData,
    allRoles,
    allBrands,
    allTeams,
  });
}
