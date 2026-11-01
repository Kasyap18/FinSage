export type Prediction = 0 | 1;

export type ModelKind = "loan" | "fraud";

export interface PredictionResult {
  prediction: Prediction;
  probability?: number;
  label?: string;
}

export type PredictionOutput = Prediction | PredictionResult;

export interface PredictionService<TInput> {
  predict(input: TInput): Promise<PredictionResult>;
}
