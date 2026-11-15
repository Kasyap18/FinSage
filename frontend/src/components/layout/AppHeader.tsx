import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { appConfig } from "@/config/app";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
            <ShieldCheck size={19} aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-900">
            {appConfig.name}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-amber-700 sm:inline-flex">
            PHASE 5 • FRONTEND
          </span>
          <span className="hidden text-xs font-medium text-slate-500 md:block">
            AI Risk Assessment
          </span>
        </div>
      </div>
    </header>
  );
}
