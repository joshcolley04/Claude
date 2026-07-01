import {
  LayoutDashboard,
  Briefcase,
  Radar,
  Sparkles,
  Newspaper,
  CalendarClock,
  ListChecks,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Portfolio & market overview" },
  { label: "Portfolio", href: "/portfolio", icon: Briefcase, description: "Holdings, P&L & allocation" },
  { label: "Market Scanner", href: "/scanner", icon: Radar, description: "Momentum, breakouts & signals" },
  { label: "AI Analyst", href: "/ai-analyst", icon: Sparkles, description: "AI investment research" },
  { label: "News", href: "/news", icon: Newspaper, description: "Financial news intelligence" },
  { label: "Calendar", href: "/calendar", icon: CalendarClock, description: "Economic events" },
  { label: "Watchlists", href: "/watchlists", icon: ListChecks, description: "Your tracked assets" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, description: "Performance & journal" },
  { label: "Settings", href: "/settings", icon: Settings, description: "Risk, alerts & integrations" },
];
