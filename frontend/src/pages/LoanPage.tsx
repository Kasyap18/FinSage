import { useMemo, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WizardNavigation } from "@/components/wizard/WizardNavigation";
import { WizardProgress } from "@/components/wizard/WizardProgress";
import { WizardStep } from "@/components/wizard/WizardStep";
import { ResultView } from "@/components/result/ResultView";
import { ReviewSection } from "@/components/result/ReviewSection";

import {
  loanFields,
  type LoanFieldMetadata,
  type LoanSection,
} from "@/features/loan/loanMetadata";
import {
  loanSchema,
  type LoanFormData,
} from "@/features/loan/loanSchema";
import { loanApiService } from "@/services/api/loanApiService";
import type { Prediction } from "@/types/models";

const steps = [
  "Applicant & Loan Setup",
  "Property & Occupancy",
  "Credit Profile",
  "Loan & Interest",
  "Payment & Security",
  "Review",
  "Analyze",
  "Result",
];

const sectionTitles: Record<LoanSection, string> = {
  applicant: "Applicant & Loan Setup",
  property: "Property & Occupancy",
  credit: "Credit Profile",
  loan: "Loan & Interest Details",
  payment: "Payment & Security",
};

const sectionDescriptions: Record<LoanSection, string> = {
  applicant:
    "Provide the applicant and basic loan setup information.",
  property:
    "Provide the property, construction, occupancy, and unit information.",
  credit:
    "Provide the applicant's credit profile, income, score, and age information.",
  loan:
    "Provide loan amount, interest, charges, term, application, and LTV details.",
  payment:
    "Provide payment structure, region, and security information.",
};

const sectionOrder: LoanSection[] = [
  "applicant",
  "property",
  "credit",
  "loan",
  "payment",
];

function fieldsFor(section: LoanSection) {
  return loanFields.filter((field) => field.section === section);
}

function LoanField({
  field,
  register,
  error,
}: {
  field: LoanFieldMetadata;
  register: ReturnType<typeof useForm<LoanFormData>>["register"];
  error?: { message?: string };
}) {
  return (
    <div>
      <label
        htmlFor={field.name}
        className="mb-2 block text-sm font-medium text-slate-800"
      >
        {field.label}
        {field.required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <div className="relative">
        {field.type === "select" ? (
          <select
            id={field.name}
            {...register(field.name)}
            className="min-h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          >
            <option value="">Select {field.label}</option>

            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={field.name}
            type="number"
            inputMode="decimal"
            step={field.step ?? 1}
            min={field.min}
            max={field.max}
            {...register(field.name, {
              valueAsNumber: true,
            })}
            className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        )}

        {field.unit && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
            {field.unit}
          </span>
        )}
      </div>

      {field.helperText && (
        <p className="mt-1.5 text-xs text-slate-500">
          {field.helperText}
        </p>
      )}

      {error?.message && (
        <p
          className="mt-2 text-xs font-medium text-red-600"
          role="alert"
        >
          {error.message}
        </p>
      )}

      {field.min !== undefined && field.max !== undefined && (
        <p className="mt-1.5 text-[11px] text-slate-400">
          Range: {field.min.toLocaleString()} –{" "}
          {field.max.toLocaleString()}
          {field.unit ? ` ${field.unit}` : ""}
        </p>
      )}
    </div>
  );
}

export function LoanPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [prediction, setPrediction] =
    useState<Prediction | null>(null);
  const [serviceError, setServiceError] =
    useState<string | null>(null);

  const {
    register,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    mode: "onTouched",
  });

  const sectionFieldNames = useMemo(
    () =>
      sectionOrder.map((section) =>
        fieldsFor(section).map((field) => field.name),
      ),
    [],
  );

  const handleNext = async () => {
    // Steps 0-4 = actual form sections
    if (currentStep < sectionOrder.length) {
      const fields = sectionFieldNames[currentStep];

      const valid = await trigger(fields);

      if (!valid) {
        return;
      }

      setCurrentStep((step) => step + 1);
      return;
    }

    // Review → Analyze
    if (currentStep === sectionOrder.length) {
      setCurrentStep(sectionOrder.length + 1);
      return;
    }

    // Analyze
    if (currentStep === sectionOrder.length + 1) {
      await handleSubmit(handleAnalyze)();
    }
  };

  const handleBack = () => {
    if (currentStep > 0 && !isSubmitting) {
      setCurrentStep((step) => step - 1);
    }
  };

  const handleEdit = (sectionIndex: number) => {
    setServiceError(null);
    setPrediction(null);
    setCurrentStep(sectionIndex);
  };

  const handleAnalyze = async (data: LoanFormData) => {
    setServiceError(null);

    try {
      const result = await loanApiService.predict(data);

      setPrediction(result);
      setCurrentStep(sectionOrder.length + 2);
    } catch {
      setServiceError(
        "We couldn't complete the analysis. Please try again.",
      );

      setCurrentStep(sectionOrder.length + 1);
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  // Result
  if (
    currentStep === sectionOrder.length + 2 &&
    prediction !== null
  ) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <Card>
          <CardContent className="p-5 sm:p-8">
            <ResultView
              prediction={prediction}
              title="Loan Default Detection"
              onRestart={handleRestart}
            />
          </CardContent>
        </Card>
      </section>
    );
  }

  const activeSection =
    currentStep < sectionOrder.length
      ? sectionOrder[currentStep]
      : null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Loan Default Detection
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          Assess loan default risk
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Enter the applicant, property, credit, and loan details
          below. Review everything before starting the analysis.
        </p>
      </div>

      <Card>
        <CardContent className="p-5 sm:p-7">
          <WizardProgress
            steps={steps}
            currentStep={currentStep}
          />

          <div className="my-8 border-t border-slate-200" />

          {/* Form sections */}
          {currentStep < sectionOrder.length &&
            activeSection && (
              <WizardStep
                title={sectionTitles[activeSection]}
                description={
                  sectionDescriptions[activeSection]
                }
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  {fieldsFor(activeSection).map((field) => (
                    <LoanField
                      key={field.name}
                      field={field}
                      register={register}
                      error={errors[field.name]}
                    />
                  ))}
                </div>
              </WizardStep>
            )}

          {/* Review */}
          {currentStep === sectionOrder.length && (
            <div className="space-y-5">
              <WizardStep
                title="Review your assessment"
                description="Check all submitted information before analysis."
              >
                {sectionOrder.map((section, index) => (
                  <ReviewSection
                    key={section}
                    title={sectionTitles[section]}
                    fields={[...fieldsFor(section)]}
                    values={getValues()}
                    onEdit={() => handleEdit(index)}
                  />
                ))}
              </WizardStep>
            </div>
          )}

          {/* Analyze */}
          {currentStep === sectionOrder.length + 1 && (
            <WizardStep
              title="Ready to analyze"
              description="Start the model assessment when you're ready."
            >
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm leading-6 text-slate-600">
                  Your information has been reviewed. Select
                  Analyze to submit the assessment to the
                  prediction service.
                </p>

                {serviceError && (
                  <div
                    className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    role="alert"
                  >
                    {serviceError}
                  </div>
                )}
              </div>
            </WizardStep>
          )}

          <div className="mt-10">
            {currentStep === sectionOrder.length + 1 &&
            isSubmitting ? (
              <div className="flex flex-col items-center justify-center gap-4 border-t border-slate-200 pt-8 text-center">
                <LoaderCircle
                  size={28}
                  className="animate-spin text-slate-700"
                  aria-hidden="true"
                />

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Analyzing assessment
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Please wait while the prediction service
                    processes the assessment.
                  </p>
                </div>
              </div>
            ) : (
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={steps.length - 1}
                isSubmitting={isSubmitting}
                onBack={handleBack}
                onNext={handleNext}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}