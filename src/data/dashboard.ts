export type ModuleNavItem = {
  key: string;
  label: string;
  href: string;
};

// Reuse the existing JSON data source for navigation
import navigation from "./navigation.json" assert { type: "json" };

export const moduleNavigation = navigation as ModuleNavItem[];

