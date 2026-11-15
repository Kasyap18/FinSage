import type { FraudFormDataV2 } from "@/features/fraud/fraudSchemaV2";
import type { PredictionService } from "@/types/models";

export const mockFraudServiceV2: PredictionService<FraudFormDataV2> = {
  async predict(_input) {
    await new Promise((resolve) => window.setTimeout(resolve, 1200));

    const probability = Math.random();
    const prediction = probability >= 0.66 ? 1 : 0;
    return {
      prediction,
      probability,
      label: prediction === 1 ? "FRAUD" : "NOT FRAUD",
    };
  },
};
