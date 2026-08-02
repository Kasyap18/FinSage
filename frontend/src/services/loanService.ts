import type { PredictionService } from "@/types/models";

export interface LoanPredictionInput {
  [key: string]: unknown;
}

export const loanService: PredictionService<LoanPredictionInput> = {
  async predict(_input) {
    throw new Error("Loan prediction service is not connected yet.");
  },
};