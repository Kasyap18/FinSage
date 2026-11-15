import type { LoanFormData } from "@/features/loan/loanSchema";
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
      default?: number;
    };

const endpoint = import.meta.env.VITE_LOAN_PREDICT_ENDPOINT ?? "";

function extractPredictionResult(
  response: BackendPredictionResponse,
): PredictionResult {
  if (typeof response === "number") {
    if (response !== 0 && response !== 1) {
      throw new Error(
        "Loan API returned an invalid prediction. Expected binary 0 or 1.",
      );
    }
    return {
      prediction: response,
      probability: response === 1 ? 1 : 0,
      label: response === 1 ? "LOAN DEFAULT" : "NO LOAN DEFAULT",
    };
  }

  const value =
    response.prediction ?? response.result ?? response.default;

  if (value !== 0 && value !== 1) {
    throw new Error(
      "Loan API returned an invalid prediction. Expected binary 0 or 1.",
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
          ? "LOAN DEFAULT"
          : "NO LOAN DEFAULT",
  };
}

export const loanApiService: PredictionService<LoanFormData> = {
  async predict(input) {
    const response = await postPrediction<
      LoanFormData,
      BackendPredictionResponse
    >(endpoint, input);

    return extractPredictionResult(response);
  },
};
