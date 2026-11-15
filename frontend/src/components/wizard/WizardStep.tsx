
import type { ReactNode } from "react";

interface WizardStepProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function WizardStep({
  title,
  description,
  children,
}: WizardStepProps) {
  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}
