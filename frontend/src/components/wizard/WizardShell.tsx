
import { useState } from "react";
import {
  type FieldErrors,
  type UseFormRegister,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { WizardNavigation } from "@/components/wizard/WizardNavigation";
import { WizardProgress } from "@/components/wizard/WizardProgress";
import { WizardStep } from "@/components/wizard/WizardStep";

const wizardSchema = z.object({
  stepOne: z.string().min(1, "Please enter a value before continuing."),
  stepTwo: z.string().min(1, "Please enter a value before continuing."),
  stepThree: z.string().min(1, "Please enter a value before continuing."),
  stepFour: z.string().min(1, "Please enter a value before continuing."),
});

type WizardFormData = z.infer<typeof wizardSchema>;

interface WizardShellProps {
  title: string;
  subtitle: string;
  steps: string[];
}

const stepFields: (keyof WizardFormData)[] = [
  "stepOne",
  "stepTwo",
  "stepThree",
  "stepFour",
];

const stepContent = [
  {
    title: "Step One",
    description: "Placeholder step for the first group of model inputs.",
    label: "Placeholder input",
    placeholder: "Enter a value",
  },
  {
    title: "Step Two",
    description: "Placeholder step for the second group of model inputs.",
    label: "Placeholder input",
    placeholder: "Enter a value",
  },
  {
    title: "Step Three",
    description: "Placeholder step for the third group of model inputs.",
    label: "Placeholder input",
    placeholder: "Enter a value",
  },
  {
    title: "Step Four",
    description: "Placeholder step for the fourth group of model inputs.",
    label: "Placeholder input",
    placeholder: "Enter a value",
  },
] as const;

function Field({
  name,
  label,
  placeholder,
  register,
  error,
}: {
  name: keyof WizardFormData;
  label: string;
  placeholder: string;
  register: UseFormRegister<WizardFormData>;
  error?: FieldErrors<WizardFormData>[keyof WizardFormData];
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-800"
      >
        {label}
      </label>

      <input
        id={name}
        {...register(name)}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      />

      {error?.message && (
        <p className="mt-2 text-xs font-medium text-red-600" role="alert">
          {String(error.message)}
        </p>
      )}
    </div>
  );
}

export function WizardShell({
  title,
  subtitle,
  steps,
}: WizardShellProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    mode: "onTouched",
    defaultValues: {
      stepOne: "",
      stepTwo: "",
      stepThree: "",
      stepFour: "",
    },
  });

  const currentField = stepFields[currentStep];
  const currentContent = stepContent[currentStep];

  const handleNext = async () => {
    const valid = await trigger(currentField);

    if (!valid) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const onSubmit = async (_data: WizardFormData) => {
    console.log("Phase 3 placeholder submission");
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          {subtitle}
        </h1>
      </div>

      <Card>
        <CardContent className="p-5 sm:p-7">
          <WizardProgress steps={steps} currentStep={currentStep} />

          <div className="my-8 border-t border-slate-200" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <WizardStep
              title={currentContent.title}
              description={currentContent.description}
            >
              <div className="max-w-xl">
                <Field
                  name={currentField}
                  label={currentContent.label}
                  placeholder={currentContent.placeholder}
                  register={register}
                  error={errors[currentField]}
                />
              </div>
            </WizardStep>

            <div className="mt-10">
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={steps.length}
                isSubmitting={isSubmitting}
                onBack={handleBack}
                onNext={handleNext}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
