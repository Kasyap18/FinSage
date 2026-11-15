import {
  FRAUD_CATEGORY_MAP,
  FRAUD_GENDER_MAP,
} from "@/features/fraud/fraudMetadataV2";
import type { FraudFormDataV2 } from "@/features/fraud/fraudSchemaV2";
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

function normalizeFraudPayload(
  input: FraudFormDataV2,
): Record<string, unknown> {
  const normalizedDateTime = input.trans_date_trans_time.replace("T", " ");
  return {
    ...input,
    gender: FRAUD_GENDER_MAP[input.gender] ?? input.gender,
    category: FRAUD_CATEGORY_MAP[input.category] ?? input.category,
    trans_date_trans_time:
      normalizedDateTime.length === 16
        ? `${normalizedDateTime}:00`
        : normalizedDateTime,
  };
}

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

export const fraudApiServiceV2: PredictionService<FraudFormDataV2> = {
  async predict(input) {
    const payload = normalizeFraudPayload(input);
    const response = await postPrediction<
      Record<string, unknown>,
      BackendPredictionResponse
    >(endpoint, payload);

    return extractPredictionResult(response);
  },
};
