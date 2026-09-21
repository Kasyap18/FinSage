from prediction import predict_loan


sample = {
    "ID": 10001,
    "loan_limit": "cf",
    "Gender": "Male",
    "approv_in_adv": "nopre",
    "loan_type": "type1",
    "loan_purpose": "p1",
    "Credit_Worthiness": "l1",
    "open_credit": "nopc",
    "business_or_commercial": "nob/c",
    "loan_amount": 200000,
    "rate_of_interest": 4.5,
    "Interest_rate_spread": 0.5,
    "Upfront_charges": 3000,
    "term": 360,
    "Neg_ammortization": "not_neg",
    "interest_only": "not_int",
    "lump_sum_payment": "not_lps",
    "property_value": 250000,
    "construction_type": "sb",
    "occupancy_type": "pr",
    "Secured_by": "home",
    "total_units": "1U",
    "income": 60000,
    "credit_type": "EXP",
    "Credit_Score": 750,
    "co-applicant_credit_type": "EXP",
    "age": "35-44",
    "submission_of_application": "to_inst",
    "LTV": 80.0,
    "Region": "North",
    "Security_Type": "direct",
    "dtir1": 30,
}


prediction = predict_loan(sample)

print("\nFinal prediction:", prediction)