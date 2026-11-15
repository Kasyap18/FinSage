import { Sparkles, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import type { ExampleScenario } from "@/features/testSamplesV2";
import { cn } from "@/lib/utils";

interface QuickExamplesBarProps<T> {
  title?: string;
  subtitle?: string;
  examples: ExampleScenario<T>[];
  activeExampleId?: string | null;
  onSelectExample: (example: ExampleScenario<T>) => void;
  onClear?: () => void;
}

export function QuickExamplesBar<T>({
  title = "Quick Demo Scenarios",
  subtitle = "Click an example below to auto-fill all fields and jump directly to Review. You can edit any field before analyzing.",
  examples,
  activeExampleId,
  onSelectExample,
  onClear,
}: QuickExamplesBarProps<T>) {
  return (
    <section className="mb-6 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-slate-50/40 to-white p-4 shadow-xs sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
            <Sparkles size={15} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 self-start text-xs font-medium text-slate-500 hover:text-slate-700 transition sm:self-auto"
          >
            <RotateCcw size={12} />
            Reset Form
          </button>
        )}
      </div>

      <div className="mt-3.5 grid gap-3 sm:grid-cols-3">
        {examples.map((example) => {
          const isActive = activeExampleId === example.id;

          const badgeClass =
            example.badgeType === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : example.badgeType === "danger"
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-amber-50 text-amber-700 border-amber-200";

          return (
            <button
              key={example.id}
              type="button"
              onClick={() => onSelectExample(example)}
              className={cn(
                "group relative flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                isActive
                  ? "border-indigo-500 bg-white shadow-sm ring-1 ring-indigo-500"
                  : "border-slate-200/90 bg-white/90 hover:border-indigo-300 hover:bg-white hover:shadow-xs",
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-900">
                    {example.title}
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide",
                      badgeClass,
                    )}
                  >
                    {example.badge}
                  </span>
                </div>

                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                  {example.summary}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-medium text-indigo-600 group-hover:text-indigo-700">
                <span className="inline-flex items-center gap-1">
                  {isActive ? (
                    <>
                      <CheckCircle2 size={13} className="text-indigo-600" />
                      Loaded in Review
                    </>
                  ) : (
                    "Load & Review"
                  )}
                </span>
                <ArrowRight
                  size={12}
                  className="transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
