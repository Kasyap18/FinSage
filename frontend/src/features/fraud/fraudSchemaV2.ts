import { z } from "zod";
import {
  FRAUD_CATEGORIES,
  FRAUD_GENDERS,
  FRAUD_STATES,
} from "./fraudMetadataV2";

const numeric = (label: string, min: number, max: number) =>
  z
    .number({
      error: `${label} is required.`,
    })
    .min(min, `${label} must be at least ${min}.`)
    .max(max, `${label} must be at most ${max}.`);

const textField = (label: string) =>
  z
    .string({
      error: `${label} is required.`,
    })
    .trim()
    .min(1, `${label} is required.`);

const dateStringField = (label: string) =>
  textField(label).refine(
    (value) => !Number.isNaN(Date.parse(value)),
    `${label} must be a valid date or timestamp.`,
  );

export const fraudSchemaV2 = z.object({
  // ============================================================
  // USER & CARDHOLDER DETAILS
  // ============================================================
  first: textField("First Name"),

  last: textField("Last Name"),

  gender: z.enum(FRAUD_GENDERS, {
    error: "Gender is required.",
  }),

  dob: dateStringField("Date of Birth"),

  job: textField("Occupation / Job"),

  cc_num: numeric(
    "Credit Card Number",
    10000000000,
    9999999999999999000,
  ).refine(
    (value) => Number.isInteger(value),
    "Credit Card Number must be an integer.",
  ),

  // ============================================================
  // TRANSACTION DETAILS
  // ============================================================
  trans_num: textField("Transaction ID"),

  trans_date_trans_time: dateStringField("Transaction Date & Time"),

  unix_time: numeric(
    "Unix Timestamp",
    1000000000,
    2500000000,
  ).refine(
    (value) => Number.isInteger(value),
    "Unix Timestamp must be an integer.",
  ),

  amt: numeric("Transaction Amount", 0.01, 100000),

  category: z.enum(FRAUD_CATEGORIES, {
    error: "Merchant Category is required.",
  }),

  merchant: textField("Merchant Name"),

  // ============================================================
  // CUSTOMER LOCATION & CONTEXT
  // ============================================================
  street: textField("Street Address"),

  city: textField("City"),

  state: z.enum(FRAUD_STATES, {
    error: "State is required.",
  }),

  zip: numeric("ZIP Code", 1000, 99999).refine(
    (value) => Number.isInteger(value),
    "ZIP Code must be an integer.",
  ),

  city_pop: numeric("City Population", 1, 10000000).refine(
    (value) => Number.isInteger(value),
    "City Population must be an integer.",
  ),

  lat: numeric("Customer Latitude", -90, 90),

  long: numeric("Customer Longitude", -180, 180),

  // ============================================================
  // MERCHANT LOCATION & DISTANCE
  // ============================================================
  merch_lat: numeric("Merchant Latitude", -90, 90),

  merch_long: numeric("Merchant Longitude", -180, 180),
});

export const fraudSchema = fraudSchemaV2;

export type FraudFormDataV2 = z.infer<typeof fraudSchemaV2>;
export type FraudFormData = FraudFormDataV2;

