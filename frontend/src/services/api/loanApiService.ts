import type { LoanFormData } from "@/features/loan/loanSchema";
import type { PredictionService } from "@/types/models";
import { postPrediction } from "@/services/api/apiClient";

type BackendPredictionResponse =
  | number
  | {
      prediction?: number;
      result?: number;
      fraudulent?: number;
      default?: number;
    };

const endpoint = import.meta.env.VITE_LOAN_PREDICT_ENDPOINT ?? "";

function extractPrediction(response: BackendPredictionResponse): 0 | 1 {
  const value =
    typeof response === "number"
      ? response
      : response.prediction ??
        response.result ??
        response.default;

  if (value !== 0 && value !== 1) {
    throw new Error(
      "Loan API returned an invalid prediction. Expected binary 0 or 1.",
    );
  }

  return value;
}

export const loanApiService: PredictionService<LoanFormData> = {
  async predict(input) {
    const response = await postPrediction<
      LoanFormData,
      BackendPredictionResponse
    >(endpoint, input);

    return extractPrediction(response);
  },
};
