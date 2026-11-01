export type FraudFieldType =
  | "number"
  | "select"
  | "text"
  | "date"
  | "datetime-local";

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
  placeholder?: string;
  helperText?: string;
  section: FraudSection;
}

export type FraudFieldName =
  | "trans_date_trans_time"
  | "cc_num"
  | "merchant"
  | "category"
  | "amt"
  | "first"
  | "last"
  | "gender"
  | "street"
  | "city"
  | "state"
  | "zip"
  | "lat"
  | "long"
  | "city_pop"
  | "job"
  | "dob"
  | "trans_num"
  | "unix_time"
  | "merch_lat"
  | "merch_long";

export type FraudSection =
  | "user"
  | "transaction"
  | "context"
  | "history";

export const FRAUD_CATEGORIES = [
  "Entertainment",
  "Food & Dining",
  "Gas & Transport",
  "Grocery (Online)",
  "Grocery (POS)",
  "Health & Fitness",
  "Home",
  "Kids & Pets",
  "Miscellaneous (Online)",
  "Miscellaneous (POS)",
  "Personal Care",
  "Shopping (Online)",
  "Shopping (POS)",
  "Travel",
] as const;

export const FRAUD_CATEGORY_MAP: Record<string, string> = {
  Entertainment: "entertainment",
  "Food & Dining": "food_dining",
  "Gas & Transport": "gas_transport",
  "Grocery (Online)": "grocery_net",
  "Grocery (POS)": "grocery_pos",
  "Health & Fitness": "health_fitness",
  Home: "home",
  "Kids & Pets": "kids_pets",
  "Miscellaneous (Online)": "misc_net",
  "Miscellaneous (POS)": "misc_pos",
  "Personal Care": "personal_care",
  "Shopping (Online)": "shopping_net",
  "Shopping (POS)": "shopping_pos",
  Travel: "travel",
};

export const FRAUD_GENDERS = ["Male", "Female"] as const;

export const FRAUD_GENDER_MAP: Record<string, string> = {
  Male: "M",
  Female: "F",
  M: "M",
  F: "F",
};

export const FRAUD_STATES = [
  "AK",
  "AL",
  "AR",
  "AZ",
  "CA",
  "CO",
  "CT",
  "DC",
  "DE",
  "FL",
  "GA",
  "HI",
  "IA",
  "ID",
  "IL",
  "IN",
  "KS",
  "KY",
  "LA",
  "MA",
  "MD",
  "ME",
  "MI",
  "MN",
  "MO",
  "MS",
  "MT",
  "NC",
  "ND",
  "NE",
  "NH",
  "NJ",
  "NM",
  "NV",
  "NY",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VA",
  "VT",
  "WA",
  "WI",
  "WV",
  "WY",
] as const;

export const fraudFields: readonly FraudFieldMetadata[] = [
  // ============================================================
  // USER & CARDHOLDER DETAILS
  // ============================================================
  {
    name: "first",
    label: "First Name",
    type: "text",
    required: true,
    placeholder: "e.g. John",
    section: "user",
  },
  {
    name: "last",
    label: "Last Name",
    type: "text",
    required: true,
    placeholder: "e.g. Doe",
    section: "user",
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    required: true,
    options: FRAUD_GENDERS,
    section: "user",
  },
  {
    name: "dob",
    label: "Date of Birth",
    type: "date",
    required: true,
    placeholder: "YYYY-MM-DD",
    helperText: "Used with transaction timestamp to calculate customer age.",
    section: "user",
  },
  {
    name: "job",
    label: "Occupation / Job",
    type: "text",
    required: true,
    placeholder: "e.g. Engineer",
    section: "user",
  },
  {
    name: "cc_num",
    label: "Credit Card Number",
    type: "number",
    required: true,
    min: 10000000000,
    max: 9999999999999999000,
    step: 1,
    helperText: "Used to join historical card behavior statistics.",
    section: "user",
  },

  // ============================================================
  // TRANSACTION DETAILS
  // ============================================================
  {
    name: "trans_num",
    label: "Transaction ID",
    type: "text",
    required: true,
    placeholder: "e.g. e8a81877ae9a0a7f883e15cb39dc4022",
    section: "transaction",
  },
  {
    name: "trans_date_trans_time",
    label: "Transaction Date & Time",
    type: "datetime-local",
    required: true,
    placeholder: "YYYY-MM-DD HH:mm:ss",
    helperText: "Used to derive hour, day, month, weekend, and night indicators.",
    section: "transaction",
  },
  {
    name: "unix_time",
    label: "Unix Timestamp",
    type: "number",
    required: true,
    min: 1000000000,
    max: 2500000000,
    step: 1,
    unit: "sec",
    section: "transaction",
  },
  {
    name: "amt",
    label: "Transaction Amount",
    type: "number",
    required: true,
    min: 0.01,
    max: 100000,
    step: 0.01,
    unit: "$",
    section: "transaction",
  },
  {
    name: "category",
    label: "Merchant Category",
    type: "select",
    required: true,
    options: FRAUD_CATEGORIES,
    section: "transaction",
  },
  {
    name: "merchant",
    label: "Merchant Name",
    type: "text",
    required: true,
    placeholder: "e.g. fraud_Rippin, Kub and Mann",
    helperText: "Encoded and mapped to historical merchant frequency.",
    section: "transaction",
  },

  // ============================================================
  // CUSTOMER LOCATION & CONTEXT
  // ============================================================
  {
    name: "street",
    label: "Street Address",
    type: "text",
    required: true,
    placeholder: "e.g. 123 Main St",
    section: "context",
  },
  {
    name: "city",
    label: "City",
    type: "text",
    required: true,
    placeholder: "e.g. New York",
    helperText: "Encoded and mapped to historical city frequency.",
    section: "context",
  },
  {
    name: "state",
    label: "State",
    type: "select",
    required: true,
    options: FRAUD_STATES,
    section: "context",
  },
  {
    name: "zip",
    label: "ZIP Code",
    type: "number",
    required: true,
    min: 1000,
    max: 99999,
    step: 1,
    section: "context",
  },
  {
    name: "city_pop",
    label: "City Population",
    type: "number",
    required: true,
    min: 1,
    max: 10000000,
    step: 1,
    section: "context",
  },
  {
    name: "lat",
    label: "Customer Latitude",
    type: "number",
    required: true,
    min: -90,
    max: 90,
    step: 0.0001,
    unit: "°",
    section: "context",
  },
  {
    name: "long",
    label: "Customer Longitude",
    type: "number",
    required: true,
    min: -180,
    max: 180,
    step: 0.0001,
    unit: "°",
    section: "context",
  },

  // ============================================================
  // MERCHANT LOCATION & DISTANCE
  // ============================================================
  {
    name: "merch_lat",
    label: "Merchant Latitude",
    type: "number",
    required: true,
    min: -90,
    max: 90,
    step: 0.0001,
    unit: "°",
    helperText: "Used with customer coordinates to compute Haversine distance (km).",
    section: "history",
  },
  {
    name: "merch_long",
    label: "Merchant Longitude",
    type: "number",
    required: true,
    min: -180,
    max: 180,
    step: 0.0001,
    unit: "°",
    helperText: "Used with customer coordinates to compute Haversine distance (km).",
    section: "history",
  },
];

export const fraudFieldsV2 = fraudFields;
