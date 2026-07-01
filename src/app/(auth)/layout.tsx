import Link from "next/link";
import { Brand } from "@/components/layout/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-night px-4">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Brand />
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
