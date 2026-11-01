import type { FraudFormData } from "@/features/fraud/fraudSchema";
import type { PredictionService } from "@/types/models";

export const mockFraudService: PredictionService<FraudFormData> = {
  async predict(_input) {
    await new Promise((resolve) => window.setTimeout(resolve, 1200));

    const probability = Math.random();
    const prediction = probability >= 0.5 ? 1 : 0;
    return {
      prediction,
      probability,
      label: prediction === 1 ? "FRAUD" : "NOT FRAUD",
    };
  },
};
