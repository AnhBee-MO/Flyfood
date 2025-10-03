import { NextResponse } from "next/server";
import navigation from "@/data/navigation.json";
import subNavJson from "@/data/module-subnav.json";

type SubNavItem = { label: string; href: string };
type SubNavMap = Record<string, SubNavItem[]>;

export async function GET() {
  const subNavigation = subNavJson as unknown as SubNavMap;
  return NextResponse.json(
    { navigation, subNavigation },
    {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
      },
    }
  );
}
