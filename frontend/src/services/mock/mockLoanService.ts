import type { LoanFormData } from "@/features/loan/loanSchema";
import type { PredictionService } from "@/types/models";

export const mockLoanService: PredictionService<LoanFormData> = {
  async predict(_input) {
    await new Promise((resolve) => window.setTimeout(resolve, 1200));

    // Development-only mock. This is not a real ML prediction.
    return Math.random() >= 0.5 ? 1 : 0;
  },
};
