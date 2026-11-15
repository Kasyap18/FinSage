const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function postPrediction<TInput, TResult>(
  endpoint: string,
  input: TInput,
): Promise<TResult> {
  if (!API_BASE_URL) {
    throw new ApiError(
      "VITE_API_BASE_URL is not configured. Add it to your .env.local file.",
      0,
    );
  }

  if (!endpoint) {
    throw new ApiError(
      "Prediction endpoint is not configured. Add the endpoint to .env.local.",
      0,
    );
  }

  const url = `${API_BASE_URL}/${endpoint.replace(/^\/+/, "")}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(input),
    });
  } catch {
    throw new ApiError(
      "Unable to reach the prediction server. Please check that the FastAPI backend is running.",
      0,
    );
  }

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const detail =
      typeof body === "object" &&
      body !== null &&
      "detail" in body &&
      typeof body.detail === "string"
        ? body.detail
        : `Prediction request failed with status ${response.status}.`;

    throw new ApiError(detail, response.status, body);
  }

  return body as TResult;
}
