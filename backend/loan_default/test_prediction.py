from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from loan_default.prediction import predict_loan


# 1. Raw dataset format — Low-Risk sample (Expected: NO LOAN DEFAULT / 0)
RAW_NO_DEFAULT_SAMPLE = {
    "ID": 84256,
    "loan_limit": "cf",
    "Gender": "Joint",
    "approv_in_adv": "nopre",
    "loan_type": "type1",
    "loan_purpose": "p3",
    "Credit_Worthiness": "l1",
    "open_credit": "nopc",
    "business_or_commercial": "nob/c",
    "loan_amount": 626500,
    "rate_of_interest": 3.75,
    "Interest_rate_spread": -0.01,
    "Upfront_charges": 661.5,
    "term": 360.0,
    "Neg_ammortization": "not_neg",
    "interest_only": "not_int",
    "lump_sum_payment": "not_lpsm",
    "property_value": 1308000.0,
    "construction_type": "sb",
    "occupancy_type": "pr",
    "Secured_by": "home",
    "total_units": "1U",
    "income": 13080.0,
    "credit_type": "CIB",
    "Credit_Score": 596,
    "co-applicant_credit_type": "EXP",
    "age": "35-44",
    "submission_of_application": "not_inst",
    "LTV": 47.897554,
    "Region": "south",
    "Security_Type": "direct",
    "dtir1": 25.0,
}

# 2. Raw dataset format — High-Risk sample (Expected: LOAN DEFAULT / 1)
RAW_DEFAULT_SAMPLE = {
    "ID": 29211,
    "loan_limit": "ncf",
    "Gender": "Male",
    "approv_in_adv": "nopre",
    "loan_type": "type1",
    "loan_purpose": "p1",
    "Credit_Worthiness": "l1",
    "open_credit": "nopc",
    "business_or_commercial": "nob/c",
    "loan_amount": 3576500,
    "rate_of_interest": 3.99,
    "Interest_rate_spread": 0.3902,
    "Upfront_charges": 2601.625,
    "term": 360.0,
    "Neg_ammortization": "not_neg",
    "interest_only": "not_int",
    "lump_sum_payment": "not_lpsm",
    "property_value": 5208000.0,
    "construction_type": "sb",
    "occupancy_type": "pr",
    "Secured_by": "home",
    "total_units": "1U",
    "income": 119340.0,
    "credit_type": "EXP",
    "Credit_Score": 751,
    "co-applicant_credit_type": "CIB",
    "age": "55-64",
    "submission_of_application": "to_inst",
    "LTV": 68.673195,
    "Region": "North",
    "Security_Type": "direct",
    "dtir1": 25.0,
}

# 3. Frontend UI format — High-Risk sample using exact UI dropdown labels from loanMetadata.ts / loanMetadataV2.ts
FRONTEND_UI_DEFAULT_SAMPLE = {
    "id": 29211,
    "loan_limit": "NCF",
    "gender": "Male",
    "approv_in_adv": "Not Pre-approved",
    "loan_type": "Loan Type 1",
    "loan_purpose": "Purpose 1",
    "property_value": 5208000,
    "construction_type": "Site Built (SB)",
    "occupancy_type": "Primary Residence",
    "secured_by": "Home",
    "total_units": "1 Unit",
    "credit_worthiness": "Credit Level 1",
    "open_credit": "No Open Credit",
    "business_or_commercial": "Non-Business/Commercial",
    "income": 119340,
    "credit_type": "Experian (EXP)",
    "Credit_Score": 751,
    "co_applicant_credit_type": "CIBIL (CIB)",
    "age": "55–64",
    "loan_amount": 3576500,
    "rate_of_interest": 3.99,
    "interest_rate_spread": 0.3902,
    "upfront_charges": 2601.625,
    "term": 360,
    "submission_of_application": "Submitted through Institution",
    "LTV": 68.673195,
    "dtir1": 25,
    "neg_ammortization": "No Negative Amortization",
    "interest_only": "Principal + Interest",
    "lump_sum_payment": "No Lump Sum Payment",
    "Region": "North",
    "Security_Type": "Direct Security",
}


if __name__ == "__main__":
    print("=== Test 1: Raw Dataset Format (Expected: NO LOAN DEFAULT / 0) ===")
    res1 = predict_loan(RAW_NO_DEFAULT_SAMPLE)
    print("Result:", res1)
    assert res1["prediction"] == 0, f"Expected 0, got {res1}"

    print("\n=== Test 2: Raw Dataset Format (Expected: LOAN DEFAULT / 1) ===")
    res2 = predict_loan(RAW_DEFAULT_SAMPLE)
    print("Result:", res2)
    assert res2["prediction"] == 1, f"Expected 1, got {res2}"

    print("\n=== Test 3: Frontend UI Format (Expected: LOAN DEFAULT / 1) ===")
    res3 = predict_loan(FRONTEND_UI_DEFAULT_SAMPLE)
    print("Result:", res3)
    assert res3["prediction"] == 1, f"Expected 1, got {res3}"

    print("\nAll Loan Default model tests passed!")
