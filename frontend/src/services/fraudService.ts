import type { PredictionService } from "@/types/models";

export interface FraudPredictionInput {
  [key: string]: unknown;
}

export const fraudService: PredictionService<FraudPredictionInput> = {
  async predict(_input) {
    throw new Error("Fraud prediction service is not connected yet.");
  },
};