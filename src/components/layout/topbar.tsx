"use client";

import { signOut, useSession } from "next-auth/react";
import { Bell, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "./brand";

export function Topbar() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? session?.user?.email ?? "Investor";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/10 bg-night/70 px-4 backdrop-blur-xl lg:px-6">
      <div className="lg:hidden">
        <Brand compact />
      </div>

      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search symbols, news, opportunities…"
          className="h-9 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3 sm:flex">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
            {initial}
          </div>
          <span className="max-w-[140px] truncate text-sm text-muted-foreground">
            {name}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Sign out"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
