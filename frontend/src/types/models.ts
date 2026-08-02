export type Prediction = 0 | 1;

export type ModelKind = "loan" | "fraud";

export interface PredictionService<TInput> {
  predict(input: TInput): Promise<Prediction>;
}