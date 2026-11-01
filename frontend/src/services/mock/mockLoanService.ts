import type { LoanFormData } from "@/features/loan/loanSchema";
import type { PredictionService } from "@/types/models";

export const mockLoanService: PredictionService<LoanFormData> = {
  async predict(_input) {
    await new Promise((resolve) => window.setTimeout(resolve, 1200));

    const probability = Math.random();
    const prediction = probability >= 0.5 ? 1 : 0;
    return {
      prediction,
      probability,
      label: prediction === 1 ? "LOAN DEFAULT" : "NO LOAN DEFAULT",
    };
  },
};
