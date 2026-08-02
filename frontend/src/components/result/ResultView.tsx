import { AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Prediction } from "@/types/models";

interface ResultViewProps {
  prediction: Prediction;
  title?: string;
  onRestart: () => void;
}

export function ResultView({
  prediction,
  title = "Assessment Result",
  onRestart,
}: ResultViewProps) {
  const isPositive = prediction === 1;

  return (
    <div className="mx-auto max-w-2xl py-8 text-center sm:py-12">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
          isPositive ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
        }`}
      >
        {isPositive ? (
          <AlertTriangle size={30} aria-hidden="true" />
        ) : (
          <CheckCircle2 size={30} aria-hidden="true" />
        )}
      </div>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        {isPositive ? "Assessment Flagged" : "Assessment Not Flagged"}
      </h2>

      <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-600">
        {isPositive
          ? "The assessment returned a positive model result. Review the submitted information and follow your applicable decision process."
          : "The assessment returned a negative model result based on the current model response."}
      </p>

      <p className="mt-5 text-xs text-slate-400">
        Development result: {prediction}
      </p>

      <Button className="mt-8" onClick={onRestart}>
        <RotateCcw size={16} aria-hidden="true" />
        Start New Analysis
      </Button>
    </div>
  );
}
