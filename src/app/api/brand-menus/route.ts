import { NextResponse } from "next/server";

import { brandMenusResponse } from "./data";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(brandMenusResponse);
}
