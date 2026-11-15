import type { Prediction } from "@/types/models";

export function mockPrediction(): Promise<Prediction> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(Math.random() >= 0.5 ? 1 : 0);
    }, 900);
  });
}