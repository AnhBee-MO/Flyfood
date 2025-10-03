import { NextResponse } from "next/server";
import brands from "@/data/brands.json";

export async function GET() {
  return NextResponse.json(
    { brands },
    {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
      },
    }
  );
}
