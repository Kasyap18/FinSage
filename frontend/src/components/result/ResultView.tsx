import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ModelKind, PredictionOutput } from "@/types/models";

interface ResultViewProps {
  prediction: PredictionOutput;
  title?: string;
  modelKind?: ModelKind;
  onRestart: () => void;
}

function formatPercent(value: number): string {
  const pct = Math.min(100, Math.max(0, value * 100));
  if (pct > 0 && pct < 0.01) {
    return "< 0.01%";
  }
  if (pct > 99.99 && pct < 100) {
    return "99.99%";
  }
  return `${pct.toFixed(2)}%`;
}

export function ResultView({
  prediction,
  title = "Assessment Result",
  modelKind,
  onRestart,
}: ResultViewProps) {
  const predValue: 0 | 1 =
    typeof prediction === "number" ? prediction : prediction.prediction;
  const rawProbability: number | undefined =
    typeof prediction === "number" ? undefined : prediction.probability;
  const rawLabel: string | undefined =
    typeof prediction === "number" ? undefined : prediction.label;

  const resolvedKind: ModelKind =
    modelKind ??
    (title.toLowerCase().includes("fraud") ||
    rawLabel?.toLowerCase().includes("fraud")
      ? "fraud"
      : "loan");

  const isFlagged = predValue === 1;

  // Model probability `p` is the probability of class 1 (Loan Default or Fraud).
  // Confidence in the predicted decision is:
  //   - `p` when prediction === 1 (Default / Fraud)
  //   - `1 - p` when prediction === 0 (No Default / Not Fraud)
  const decisionConfidence =
    rawProbability !== undefined
      ? isFlagged
        ? rawProbability
        : 1 - rawProbability
      : undefined;

  const confidencePercentText =
    decisionConfidence !== undefined
      ? formatPercent(decisionConfidence)
      : "N/A";

  const riskPercentText =
    rawProbability !== undefined ? formatPercent(rawProbability) : "N/A";

  const confidenceBarWidth =
    decisionConfidence !== undefined
      ? Math.min(100, Math.max(4, decisionConfidence * 100))
      : 100;

  const riskBarWidth =
    rawProbability !== undefined
      ? Math.min(100, Math.max(2, rawProbability * 100))
      : isFlagged
        ? 85
        : 5;

  const copy =
    resolvedKind === "loan"
      ? isFlagged
        ? {
            badge: "LOAN REJECTED • HIGH DEFAULT RISK",
            headline: "Loan Rejected — High Risk of Default",
            sentence:
              decisionConfidence !== undefined
                ? `Based on the applicant's credit profile, income, property value, and repayment terms, this loan application is rejected / flagged for default with ${confidencePercentText} confidence (estimated default risk: ${riskPercentText}).`
                : "Based on the applicant's financial and credit profile, this loan application is rejected due to a high predicted risk of loan default.",
            recommendation:
              "Manual underwriting review, additional collateral, or rejection of the loan application is recommended.",
            riskLabel: "Estimated Default Probability",
            thresholdText: "50.00% (Default Threshold)",
            statusLabel: rawLabel ?? "LOAN DEFAULT",
          }
        : {
            badge: "LOAN ACCEPTED • NO LOAN DEFAULT",
            headline: "Loan Accepted — Low Default Risk",
            sentence:
              decisionConfidence !== undefined
                ? `Based on the applicant's credit profile, income, property value, and repayment terms, this loan application is accepted with ${confidencePercentText} confidence (estimated default risk: ${riskPercentText}). The model predicts the borrower will repay the loan without defaulting.`
                : "Based on the submitted credit and financial profile, this loan application is accepted with a low predicted risk of default.",
            recommendation:
              "The application meets the model's creditworthiness criteria and can proceed to standard loan approval.",
            riskLabel: "Estimated Default Probability",
            thresholdText: "50.00% (Default Threshold)",
            statusLabel: rawLabel ?? "NO LOAN DEFAULT",
          }
      : isFlagged
        ? {
            badge: "FRAUD DETECTED • BLOCK TRANSACTION",
            headline: "Fraud Detected — High-Risk Transaction",
            sentence:
              decisionConfidence !== undefined
                ? `Alert: This transaction is flagged as a fraud with ${confidencePercentText} confidence (estimated fraud probability: ${riskPercentText}). Anomalous transaction patterns were detected.`
                : "Alert: This transaction is flagged as a fraud by the detection model.",
            recommendation:
              "Hold or decline this transaction immediately and trigger cardholder step-up verification.",
            riskLabel: "Estimated Fraud Probability",
            thresholdText: "66.00% (Fraud Threshold)",
            statusLabel: rawLabel ?? "FRAUD",
          }
        : {
            badge: "NOT A FRAUD • TRANSACTION APPROVED",
            headline: "Not a Fraud — Legitimate Transaction",
            sentence:
              decisionConfidence !== undefined
                ? `This transaction is not a fraud. The model verified the transaction as legitimate with ${confidencePercentText} confidence (estimated fraud risk: ${riskPercentText}).`
                : "This transaction is not a fraud and matches normal cardholder behavior.",
            recommendation:
              "No suspicious indicators were found. The transaction can be safely approved.",
            riskLabel: "Estimated Fraud Probability",
            thresholdText: "66.00% (Fraud Threshold)",
            statusLabel: rawLabel ?? "NOT FRAUD",
          };

  return (
    <div className="mx-auto max-w-2xl py-6 sm:py-10">
      {/* Top Status Banner */}
      <div
        className={`rounded-2xl border p-6 text-center sm:p-8 ${
          isFlagged
            ? "border-red-200 bg-gradient-to-b from-red-50/90 to-white"
            : "border-emerald-200 bg-gradient-to-b from-emerald-50/90 to-white"
        }`}
      >
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full shadow-sm ${
            isFlagged
              ? "bg-red-100 text-red-600 ring-4 ring-red-50"
              : "bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50"
          }`}
        >
          {resolvedKind === "fraud" ? (
            isFlagged ? (
              <ShieldAlert size={32} aria-hidden="true" />
            ) : (
              <ShieldCheck size={32} aria-hidden="true" />
            )
          ) : isFlagged ? (
            <AlertTriangle size={32} aria-hidden="true" />
          ) : (
            <CheckCircle2 size={32} aria-hidden="true" />
          )}
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </p>

        <div
          className={`mt-3 inline-flex items-center rounded-full px-3.5 py-1 text-xs font-bold tracking-wide uppercase shadow-2xs ring-1 ring-inset ${
            isFlagged
              ? "bg-red-100 text-red-800 ring-red-300"
              : "bg-emerald-100 text-emerald-800 ring-emerald-300"
          }`}
        >
          <span
            className={`mr-2 inline-block h-2 w-2 rounded-full ${
              isFlagged ? "bg-red-600" : "bg-emerald-600"
            }`}
          />
          {copy.badge}
        </div>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {copy.headline}
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-700 sm:text-base">
          {copy.sentence}
        </p>
      </div>

      {/* Confidence & Risk Breakdown Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {/* Decision Confidence Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Decision Confidence
            </span>
            <span
              className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                isFlagged
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {copy.statusLabel}
            </span>
          </div>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {confidencePercentText}
          </p>

          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFlagged ? "bg-red-600" : "bg-emerald-600"
              }`}
              style={{ width: `${confidenceBarWidth}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Model certainty in the{" "}
            <span className="font-semibold text-slate-700">
              {copy.statusLabel}
            </span>{" "}
            outcome.
          </p>
        </div>

        {/* Raw Risk Probability Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {copy.riskLabel}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Class: {predValue}
            </span>
          </div>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {riskPercentText}
          </p>

          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFlagged ? "bg-red-500" : "bg-emerald-500"
              }`}
              style={{ width: `${riskBarWidth}%` }}
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Decision cutoff: {copy.thresholdText}
          </p>
        </div>
      </div>

      {/* Recommended Next Step */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Recommended Action
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-700">
          {copy.recommendation}
        </p>
      </div>

      <div className="mt-8 text-center">
        <Button onClick={onRestart}>
          <RotateCcw size={16} aria-hidden="true" />
          Start New Analysis
        </Button>
      </div>
    </div>
  );
}
