
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting?: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  isSubmitting = false,
  onBack,
  onNext,
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={isFirstStep || isSubmitting}
        className="w-full sm:w-auto"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back
      </Button>

      <Button
        onClick={onNext}
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? "Saving..." : isLastStep ? "Finish" : "Continue"}
        {!isLastStep && <ArrowRight size={16} aria-hidden="true" />}
      </Button>
    </div>
  );
}
