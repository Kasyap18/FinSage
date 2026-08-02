import type { FraudFormData } from "@/features/fraud/fraudSchema";
import type { PredictionService } from "@/types/models";
import { postPrediction } from "@/services/api/apiClient";

type BackendPredictionResponse =
  | number
  | {
      prediction?: number;
      result?: number;
      fraudulent?: number;
    };

const endpoint = import.meta.env.VITE_FRAUD_PREDICT_ENDPOINT ?? "";

function extractPrediction(response: BackendPredictionResponse): 0 | 1 {
  const value =
    typeof response === "number"
      ? response
      : response.prediction ??
        response.result ??
        response.fraudulent;

  if (value !== 0 && value !== 1) {
    throw new Error(
      "Fraud API returned an invalid prediction. Expected binary 0 or 1.",
    );
  }

  return value;
}

export const fraudApiService: PredictionService<FraudFormData> = {
  async predict(input) {
    const response = await postPrediction<
      FraudFormData,
      BackendPredictionResponse
    >(endpoint, input);

    return extractPrediction(response);
  },
};
