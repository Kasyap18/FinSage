import { z } from "zod";

const numberField = (label: string, min: number, max: number) =>
  z
    .number({
      error: `${label} is required.`,
    })
    .min(min, `${label} must be at least ${min}.`)
    .max(max, `${label} must be at most ${max}.`);

export const loanSchema = z.object({
  // ============================================================
  // EXISTING APPLICANT FIELDS
  // ============================================================

  id: numberField("Applicant ID", 24890, 173559),

  loan_limit: z.enum(["CF", "NCF"], {
    error: "Loan Limit is required.",
  }),

  gender: z.enum(["Male", "Female", "Joint", "Sex Not Available"], {
    error: "Gender is required.",
  }),

  approv_in_adv: z.enum(["Pre-approved", "Not Pre-approved"], {
    error: "Approval Status is required.",
  }),

  loan_type: z.enum(["Loan Type 1", "Loan Type 2", "Loan Type 3"], {
    error: "Loan Type is required.",
  }),

  loan_purpose: z.enum(
    ["Purpose 1", "Purpose 2", "Purpose 3", "Purpose 4"],
    {
      error: "Loan Purpose is required.",
    },
  ),

  // ============================================================
  // NEW PROPERTY FIELDS
  // ============================================================

  property_value: numberField("Property Value", 8000, 16508000),

  construction_type: z.enum(["Site Built (SB)", "Manufactured Home (MH)"], {
    error: "Construction Type is required.",
  }),

  occupancy_type: z.enum(
    [
      "Primary Residence",
      "Secondary Residence",
      "Investment Residence",
    ],
    {
      error: "Occupancy Type is required.",
    },
  ),

  secured_by: z.enum(["Home", "Land"], {
    error: "Secured By is required.",
  }),

  total_units: z.enum(["1 Unit", "2 Units", "3 Units", "4 Units"], {
    error: "Total Units is required.",
  }),

  // ============================================================
  // CREDIT PROFILE
  // ============================================================

  credit_worthiness: z.enum(["Credit Level 1", "Credit Level 2"], {
    error: "Credit Worthiness is required.",
  }),

  open_credit: z.enum(["Open Credit", "No Open Credit"], {
    error: "Open Credit is required.",
  }),

  business_or_commercial: z.enum(
    ["Business/Commercial", "Non-Business/Commercial"],
    {
      error: "Business / Commercial is required.",
    },
  ),

  income: numberField("Income", 0, 578580),

  credit_type: z.enum(
    ["Experian (EXP)", "Equifax (EQUI)", "CRIF", "CIBIL (CIB)"],
    {
      error: "Credit Type is required.",
    },
  ),

  Credit_Score: numberField("Credit Score", 500, 900),

  co_applicant_credit_type: z.enum(["CIBIL (CIB)", "Experian (EXP)"], {
    error: "Co-Applicant Credit Type is required.",
  }),

  age: z.enum(
    [
      "Below 25",
      "25–34",
      "35–44",
      "45–54",
      "55–64",
      "65–74",
      "Above 74",
    ],
    {
      error: "Age is required.",
    },
  ),

  // ============================================================
  // LOAN & INTEREST
  // ============================================================

  loan_amount: numberField("Loan Amount", 16500, 3576500),

  rate_of_interest: numberField("Rate of Interest", 0, 8),

  interest_rate_spread: numberField(
    "Interest Rate Spread",
    -3.638,
    3.357,
  ),

  upfront_charges: numberField("Upfront Charges", 0, 60000),

  term: numberField("Loan Term", 96, 360),

  submission_of_application: z.enum(
    [
      "Submitted through Institution",
      "Not Submitted through Institution",
    ],
    {
      error: "Submission of Application is required.",
    },
  ),

  LTV: numberField("Loan-to-Value (LTV)", 0.967478198, 7831.25),

  // ============================================================
  // PAYMENT & SECURITY
  // ============================================================

  neg_ammortization: z.enum(
    ["Negative Amortization", "No Negative Amortization"],
    {
      error: "Negative Amortization is required.",
    },
  ),

  interest_only: z.enum(["Interest Only", "Principal + Interest"], {
    error: "Interest Only is required.",
  }),

  lump_sum_payment: z.enum(
    ["Lump Sum Payment", "No Lump Sum Payment"],
    {
      error: "Lump Sum Payment is required.",
    },
  ),

  Region: z.enum(["South", "North", "Central", "North-East"], {
    error: "Region is required.",
  }),

  Security_Type: z.enum(["Direct Security", "Indirect Security"], {
    error: "Security Type is required.",
  }),
});

export type LoanFormData = z.infer<typeof loanSchema>;