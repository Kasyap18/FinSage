import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting?: boolean;
  canJumpToReview?: boolean;
  onBack: () => void;
  onNext: () => void;
  onJumpToReview?: () => void;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  isSubmitting = false,
  canJumpToReview = false,
  onBack,
  onNext,
  onJumpToReview,
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isFirstStep || isSubmitting}
          className="w-full sm:w-auto"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back
        </Button>

        {canJumpToReview && onJumpToReview && (
          <Button
            type="button"
            variant="secondary"
            onClick={onJumpToReview}
            disabled={isSubmitting}
            className="w-full border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50 sm:w-auto"
          >
            <Eye size={15} aria-hidden="true" />
            Return to Review
          </Button>
        )}
      </div>

      <Button
        type="button"
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
