import { z } from "zod";

const numeric = (label: string, min: number, max: number) =>
  z
    .number({
      error: `${label} is required.`,
    })
    .min(min, `${label} must be at least ${min}.`)
    .max(max, `${label} must be at most ${max}.`);

export const fraudSchema = z.object({
  User_ID: numeric("User ID", 1000, 4999),

  Transaction_Amount: numeric(
    "Transaction Amount",
    5.03,
    49997.8,
  ),

  Transaction_Type: z.enum(
    [
      "ATM Withdrawal",
      "Bill Payment",
      "POS Payment",
      "Bank Transfer",
      "Online Purchase",
    ],
    {
      error: "Transaction Type is required.",
    },
  ),

  Time_of_Transaction: numeric(
    "Time of Transaction",
    0,
    23,
  ).refine(
    (value) => Number.isInteger(value),
    "Time of Transaction must be an integer hour from 0 to 23.",
  ),

  Device_Used: z.enum(
    ["Mobile", "Desktop", "Tablet", "Unknown Device", "Unknown"],
    {
      error: "Device Used is required.",
    },
  ),

  Location: z.enum(
    [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Miami",
      "Seattle",
      "Boston",
      "San Francisco",
      "Unknown",
    ],
    {
      error: "Location is required.",
    },
  ),

  Previous_Fraudulent_Transactions: numeric(
    "Previous Fraudulent Transactions",
    0,
    4,
  ).refine(
    (value) => Number.isInteger(value),
    "Previous Fraudulent Transactions must be an integer from 0 to 4.",
  ),

  Account_Age: numeric("Account Age", 1, 119).refine(
    (value) => Number.isInteger(value),
    "Account Age must be an integer from 1 to 119 months.",
  ),

  Number_of_Transactions_Last_24H: numeric(
    "Number of Transactions Last 24H",
    1,
    14,
  ).refine(
    (value) => Number.isInteger(value),
    "Number of Transactions Last 24H must be an integer from 1 to 14.",
  ),

  Payment_Method: z.enum(
    [
      "Credit Card",
      "Debit Card",
      "UPI",
      "Net Banking",
      "Invalid Method",
      "Unknown",
    ],
    {
      error: "Payment Method is required.",
    },
  ),
});

export type FraudFormData = z.infer<typeof fraudSchema>;
