import axios from "axios";

/**
 * Backend details are intentionally isolated here.
 * The FastAPI URL, methods, schemas, and error mapping will be supplied later.
 */
export const apiClient = axios.create({
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});