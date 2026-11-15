
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WizardProgressProps {
  steps: string[];
  currentStep: number;
}

export function WizardProgress({
  steps,
  currentStep,
}: WizardProgressProps) {
  const progress =
    steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 100;

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
          Assessment Progress
        </span>
        <span className="text-xs font-medium text-slate-500">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>

      <div className="relative">
        <div className="absolute left-0 right-0 top-4 h-px bg-slate-200" />
        <div
          className="absolute left-0 top-4 h-px bg-slate-900 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />

        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const completed = index < currentStep;
            const active = index === currentStep;

            return (
              <div
                key={step}
                className="flex max-w-24 flex-col items-center gap-2 sm:max-w-32"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-xs font-semibold transition-all duration-300",
                    completed && "border-slate-900 bg-slate-900 text-white",
                    active &&
                      "border-slate-900 text-slate-900 ring-4 ring-slate-100",
                    !completed && !active && "border-slate-200 text-slate-400",
                  )}
                >
                  {completed ? (
                    <Check size={14} strokeWidth={2.5} aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </div>

                <span
                  className={cn(
                    "text-center text-[11px] leading-4 sm:text-xs",
                    active
                      ? "font-semibold text-slate-900"
                      : "font-medium text-slate-500",
                  )}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
