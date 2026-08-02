export type LoanFieldType = "number" | "select";

export interface LoanFieldMetadata {
  name: LoanFieldName;
  label: string;
  type: LoanFieldType;
  required: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: readonly string[];
  unit?: string;
  helperText?: string;
  section: LoanSection;
}

export type LoanFieldName =
  // Existing fields
  | "id"
  | "loan_limit"
  | "gender"
  | "approv_in_adv"
  | "loan_type"
  | "loan_purpose"
  | "credit_worthiness"
  | "open_credit"
  | "business_or_commercial"
  | "loan_amount"
  | "rate_of_interest"
  | "interest_rate_spread"
  | "upfront_charges"
  | "term"
  | "neg_ammortization"
  | "interest_only"
  | "lump_sum_payment"

  // New model fields
  | "property_value"
  | "construction_type"
  | "occupancy_type"
  | "secured_by"
  | "total_units"
  | "income"
  | "credit_type"
  | "Credit_Score"
  | "co_applicant_credit_type"
  | "age"
  | "submission_of_application"
  | "LTV"
  | "Region"
  | "Security_Type";

export type LoanSection =
  | "applicant"
  | "property"
  | "credit"
  | "loan"
  | "payment";

export const loanFields: readonly LoanFieldMetadata[] = [
  // ============================================================
  // APPLICANT & LOAN SETUP
  // ============================================================

  {
    name: "id",
    label: "Applicant ID",
    type: "number",
    required: true,
    min: 24890,
    max: 173559,
    section: "applicant",
  },
  {
    name: "loan_limit",
    label: "Loan Limit",
    type: "select",
    required: true,
    options: ["CF", "NCF"],
    section: "applicant",
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    required: true,
    options: ["Male", "Female", "Joint", "Sex Not Available"],
    section: "applicant",
  },
  {
    name: "approv_in_adv",
    label: "Approval Status",
    type: "select",
    required: true,
    options: ["Pre-approved", "Not Pre-approved"],
    section: "applicant",
  },
  {
    name: "loan_type",
    label: "Loan Type",
    type: "select",
    required: true,
    options: ["Loan Type 1", "Loan Type 2", "Loan Type 3"],
    section: "applicant",
  },
  {
    name: "loan_purpose",
    label: "Loan Purpose",
    type: "select",
    required: true,
    options: ["Purpose 1", "Purpose 2", "Purpose 3", "Purpose 4"],
    section: "applicant",
  },

  // ============================================================
  // PROPERTY & OCCUPANCY
  // ============================================================

  {
    name: "property_value",
    label: "Property Value",
    type: "number",
    required: true,
    min: 8000,
    max: 16508000,
    unit: "₹",
    section: "property",
  },
  {
    name: "construction_type",
    label: "Construction Type",
    type: "select",
    required: true,
    options: ["Site Built (SB)", "Manufactured Home (MH)"],
    section: "property",
  },
  {
    name: "occupancy_type",
    label: "Occupancy Type",
    type: "select",
    required: true,
    options: [
      "Primary Residence",
      "Secondary Residence",
      "Investment Residence",
    ],
    section: "property",
  },
  {
    name: "secured_by",
    label: "Secured By",
    type: "select",
    required: true,
    options: ["Home", "Land"],
    section: "property",
  },
  {
    name: "total_units",
    label: "Total Units",
    type: "select",
    required: true,
    options: ["1 Unit", "2 Units", "3 Units", "4 Units"],
    section: "property",
  },

  // ============================================================
  // CREDIT PROFILE
  // ============================================================

  {
    name: "credit_worthiness",
    label: "Credit Worthiness",
    type: "select",
    required: true,
    options: ["Credit Level 1", "Credit Level 2"],
    section: "credit",
  },
  {
    name: "open_credit",
    label: "Open Credit",
    type: "select",
    required: true,
    options: ["Open Credit", "No Open Credit"],
    section: "credit",
  },
  {
    name: "business_or_commercial",
    label: "Business / Commercial",
    type: "select",
    required: true,
    options: ["Business/Commercial", "Non-Business/Commercial"],
    section: "credit",
  },
  {
    name: "income",
    label: "Income",
    type: "number",
    required: true,
    min: 0,
    max: 578580,
    unit: "₹",
    section: "credit",
  },
  {
    name: "credit_type",
    label: "Credit Type",
    type: "select",
    required: true,
    options: ["Experian (EXP)", "Equifax (EQUI)", "CRIF", "CIBIL (CIB)"],
    section: "credit",
  },
  {
    name: "Credit_Score",
    label: "Credit Score",
    type: "number",
    required: true,
    min: 500,
    max: 900,
    step: 1,
    section: "credit",
  },
  {
    name: "co_applicant_credit_type",
    label: "Co-Applicant Credit Type",
    type: "select",
    required: true,
    options: ["CIBIL (CIB)", "Experian (EXP)"],
    section: "credit",
  },
  {
    name: "age",
    label: "Age",
    type: "select",
    required: true,
    options: [
      "Below 25",
      "25–34",
      "35–44",
      "45–54",
      "55–64",
      "65–74",
      "Above 74",
    ],
    section: "credit",
  },

  // ============================================================
  // LOAN & INTEREST
  // ============================================================

  {
    name: "loan_amount",
    label: "Loan Amount",
    type: "number",
    required: true,
    min: 16500,
    max: 3576500,
    unit: "₹",
    section: "loan",
  },
  {
    name: "rate_of_interest",
    label: "Rate of Interest",
    type: "number",
    required: true,
    min: 0,
    max: 8,
    step: 0.01,
    unit: "%",
    section: "loan",
  },
  {
    name: "interest_rate_spread",
    label: "Interest Rate Spread",
    type: "number",
    required: true,
    min: -3.638,
    max: 3.357,
    step: 0.001,
    unit: "%",
    section: "loan",
  },
  {
    name: "upfront_charges",
    label: "Upfront Charges",
    type: "number",
    required: true,
    min: 0,
    max: 60000,
    unit: "₹",
    section: "loan",
  },
  {
    name: "term",
    label: "Loan Term",
    type: "number",
    required: true,
    min: 96,
    max: 360,
    unit: "months",
    section: "loan",
  },
  {
    name: "submission_of_application",
    label: "Submission of Application",
    type: "select",
    required: true,
    options: [
      "Submitted through Institution",
      "Not Submitted through Institution",
    ],
    section: "loan",
  },
  {
    name: "LTV",
    label: "Loan-to-Value (LTV)",
    type: "number",
    required: true,
    min: 0.967478198,
    max: 7831.25,
    step: 0.000001,
    section: "loan",
  },

  // ============================================================
  // PAYMENT & SECURITY
  // ============================================================

  {
    name: "neg_ammortization",
    label: "Negative Amortization",
    type: "select",
    required: true,
    options: ["Negative Amortization", "No Negative Amortization"],
    section: "payment",
  },
  {
    name: "interest_only",
    label: "Interest Only",
    type: "select",
    required: true,
    options: ["Interest Only", "Principal + Interest"],
    section: "payment",
  },
  {
    name: "lump_sum_payment",
    label: "Lump Sum Payment",
    type: "select",
    required: true,
    options: ["Lump Sum Payment", "No Lump Sum Payment"],
    section: "payment",
  },
  {
    name: "Region",
    label: "Region",
    type: "select",
    required: true,
    options: ["South", "North", "Central", "North-East"],
    section: "payment",
  },
  {
    name: "Security_Type",
    label: "Security Type",
    type: "select",
    required: true,
    options: ["Direct Security", "Indirect Security"],
    section: "payment",
  },
];