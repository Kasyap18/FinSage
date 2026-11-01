import type { FraudFormData } from "@/features/fraud/fraudSchema";
import type { PredictionResult, PredictionService } from "@/types/models";
import { postPrediction } from "@/services/api/apiClient";

type BackendPredictionResponse =
  | number
  | {
      prediction?: number;
      probability?: number;
      label?: string;
      result?: number;
      fraudulent?: number;
    };

const endpoint = import.meta.env.VITE_FRAUD_PREDICT_ENDPOINT ?? "";

function extractPredictionResult(
  response: BackendPredictionResponse,
): PredictionResult {
  if (typeof response === "number") {
    if (response !== 0 && response !== 1) {
      throw new Error(
        "Fraud API returned an invalid prediction. Expected binary 0 or 1.",
      );
    }
    return {
      prediction: response,
      probability: response === 1 ? 1 : 0,
      label: response === 1 ? "FRAUD" : "NOT FRAUD",
    };
  }

  const value =
    response.prediction ?? response.result ?? response.fraudulent;

  if (value !== 0 && value !== 1) {
    throw new Error(
      "Fraud API returned an invalid prediction. Expected binary 0 or 1.",
    );
  }

  return {
    prediction: value,
    probability:
      typeof response.probability === "number"
        ? response.probability
        : undefined,
    label:
      typeof response.label === "string"
        ? response.label
        : value === 1
          ? "FRAUD"
          : "NOT FRAUD",
  };
}

export const fraudApiService: PredictionService<FraudFormData> = {
  async predict(input) {
    const response = await postPrediction<
      FraudFormData,
      BackendPredictionResponse
    >(endpoint, input);

    return extractPredictionResult(response);
  },
};
