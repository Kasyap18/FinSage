export type FraudFieldType = "number" | "select";

export interface FraudFieldMetadata {
  name: FraudFieldName;
  label: string;
  type: FraudFieldType;
  required: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: readonly string[];
  unit?: string;
  section: FraudSection;
}

export type FraudFieldName =
  | "User_ID"
  | "Transaction_Amount"
  | "Transaction_Type"
  | "Time_of_Transaction"
  | "Device_Used"
  | "Location"
  | "Previous_Fraudulent_Transactions"
  | "Account_Age"
  | "Number_of_Transactions_Last_24H"
  | "Payment_Method";

export type FraudSection =
  | "user"
  | "transaction"
  | "context"
  | "history";

export const fraudFields: readonly FraudFieldMetadata[] = [
  {
    name: "User_ID",
    label: "User ID",
    type: "number",
    required: true,
    min: 1000,
    max: 4999,
    section: "user",
  },
  {
    name: "Transaction_Amount",
    label: "Transaction Amount",
    type: "number",
    required: true,
    min: 5.03,
    max: 49997.8,
    step: 0.01,
    unit: "₹",
    section: "transaction",
  },
  {
    name: "Transaction_Type",
    label: "Transaction Type",
    type: "select",
    required: true,
    options: [
      "ATM Withdrawal",
      "Bill Payment",
      "POS Payment",
      "Bank Transfer",
      "Online Purchase",
    ],
    section: "transaction",
  },
  {
    name: "Time_of_Transaction",
    label: "Time of Transaction",
    type: "number",
    required: true,
    min: 0,
    max: 23,
    step: 1,
    unit: "hour",
    section: "context",
  },
  {
    name: "Device_Used",
    label: "Device Used",
    type: "select",
    required: true,
    options: ["Mobile", "Desktop", "Tablet", "Unknown Device", "Unknown"],
    section: "context",
  },
  {
    name: "Location",
    label: "Location",
    type: "select",
    required: true,
    options: [
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
    section: "context",
  },
  {
    name: "Previous_Fraudulent_Transactions",
    label: "Previous Fraudulent Transactions",
    type: "number",
    required: true,
    min: 0,
    max: 4,
    step: 1,
    section: "history",
  },
  {
    name: "Account_Age",
    label: "Account Age",
    type: "number",
    required: true,
    min: 1,
    max: 119,
    step: 1,
    unit: "months",
    section: "history",
  },
  {
    name: "Number_of_Transactions_Last_24H",
    label: "Number of Transactions Last 24H",
    type: "number",
    required: true,
    min: 1,
    max: 14,
    step: 1,
    section: "history",
  },
  {
    name: "Payment_Method",
    label: "Payment Method",
    type: "select",
    required: true,
    options: [
      "Credit Card",
      "Debit Card",
      "UPI",
      "Net Banking",
      "Invalid Method",
      "Unknown",
    ],
    section: "transaction",
  },
];
