import { NextResponse } from "next/server";
import operationsTeams from "@/data/operations-teams.json";

export async function GET() {
  const labels = operationsTeams.map((t) => ({ key: t.key, label: t.label }));
  return NextResponse.json(
    { labels },
    {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
      },
    }
  );
}
