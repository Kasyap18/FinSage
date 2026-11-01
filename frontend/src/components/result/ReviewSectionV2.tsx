import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FraudFieldMetadata } from "@/features/fraud/fraudMetadataV2";
import type { LoanFieldMetadata } from "@/features/loan/loanMetadata";

export type ReviewableFieldV2 =
  | LoanFieldMetadata
  | FraudFieldMetadata
  | {
      name: string;
      label: string;
      unit?: string;
    };

interface ReviewSectionV2Props {
  title: string;
  fields: readonly ReviewableFieldV2[];
  values: Record<string, unknown>;
  onEdit: () => void;
}

export function ReviewSectionV2({
  title,
  fields,
  values,
  onEdit,
}: ReviewSectionV2Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

        <Button
          variant="ghost"
          className="min-h-8 px-2.5 text-xs"
          onClick={onEdit}
        >
          <Pencil size={13} aria-hidden="true" />
          Edit
        </Button>
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name}>
            <dt className="text-xs text-slate-500">{field.label}</dt>
            <dd className="mt-1 text-sm font-medium text-slate-900">
              {String(values[field.name] ?? "—")}
              {field.unit ? ` ${field.unit}` : ""}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

