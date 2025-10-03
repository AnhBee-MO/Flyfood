import { NextResponse } from "next/server";
import operationsTeams from "@/data/operations-teams.json";

export async function GET() {
  return NextResponse.json(
    { teams: operationsTeams },
    {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
      },
    }
  );
}
