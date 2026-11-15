from pathlib import Path
from typing import Any
import warnings

import joblib
import numpy as np
import pandas as pd
import sklearn.compose._column_transformer as _ct
from sklearn.exceptions import InconsistentVersionWarning
from sklearn.impute import SimpleImputer
from tensorflow.keras.models import load_model


# Forward-compatibility shims for preprocessors pickled with scikit-learn 1.6.x
# when unpickled and run under scikit-learn 1.7+ / 1.9+:
# 1. `_RemainderColsList` was removed from `sklearn.compose._column_transformer`.
# 2. `SimpleImputer.transform` in 1.9+ expects `self._fill_dtype`, whereas 1.6.x
#    only stored `self._fit_dtype`.
if not hasattr(_ct, "_RemainderColsList"):
    class _RemainderColsList(list):
        pass

    _ct._RemainderColsList = _RemainderColsList

if not hasattr(SimpleImputer, "_fill_dtype"):
    SimpleImputer._fill_dtype = property(
        lambda self: self.__dict__.get(
            "_fill_dtype",
            getattr(self, "_fit_dtype", getattr(self.statistics_, "dtype", object)),
        ),
        lambda self, val: self.__dict__.__setitem__("_fill_dtype", val),
    )


def _patch_loaded_preprocessor(ct: Any) -> None:
    """Ensure all sub-estimators inside ColumnTransformer have 1.9+ attributes."""
    for _, trans, _ in getattr(ct, "transformers_", []):
        steps = getattr(trans, "steps", [])
        for _, step in steps:
            if isinstance(step, SimpleImputer) and "_fill_dtype" not in step.__dict__:
                step._fill_dtype = getattr(
                    step, "_fit_dtype", getattr(step.statistics_, "dtype", object)
                )


# ---------------------------------------------------------
# Paths
# ---------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "models" / "loan_default_nn.keras"
PREPROCESSOR_PATH = BASE_DIR / "models" / "preprocessor.pkl"


# ---------------------------------------------------------
# Load model and preprocessor
# ---------------------------------------------------------

print("Loading loan default model...")
model = load_model(MODEL_PATH)

print("Loading preprocessor...")
with warnings.catch_warnings():
    warnings.simplefilter("ignore", InconsistentVersionWarning)
    preprocessor = joblib.load(PREPROCESSOR_PATH)
    _patch_loaded_preprocessor(preprocessor)

print("Model and preprocessor loaded successfully.")


# ---------------------------------------------------------
# Frontend UI -> Dataset Normalization
# ---------------------------------------------------------

KEY_ALIASES: dict[str, str] = {
    "id": "ID",
    "gender": "Gender",
    "credit_worthiness": "Credit_Worthiness",
    "interest_rate_spread": "Interest_rate_spread",
    "upfront_charges": "Upfront_charges",
    "neg_ammortization": "Neg_ammortization",
    "secured_by": "Secured_by",
    "credit_score": "Credit_Score",
    "co_applicant_credit_type": "co-applicant_credit_type",
    "ltv": "LTV",
    "region": "Region",
    "security_type": "Security_Type",
}

VALUE_MAPPINGS: dict[str, dict[str, str]] = {
    "loan_limit": {
        "CF": "cf",
        "NCF": "ncf",
    },
    "approv_in_adv": {
        "Pre-approved": "pre",
        "Not Pre-approved": "nopre",
    },
    "loan_type": {
        "Loan Type 1": "type1",
        "Loan Type 2": "type2",
        "Loan Type 3": "type3",
    },
    "loan_purpose": {
        "Purpose 1": "p1",
        "Purpose 2": "p2",
        "Purpose 3": "p3",
        "Purpose 4": "p4",
    },
    "Credit_Worthiness": {
        "Credit Level 1": "l1",
        "Credit Level 2": "l2",
    },
    "open_credit": {
        "Open Credit": "opc",
        "No Open Credit": "nopc",
    },
    "business_or_commercial": {
        "Business/Commercial": "b/c",
        "Non-Business/Commercial": "nob/c",
    },
    "Neg_ammortization": {
        "Negative Amortization": "neg_amm",
        "No Negative Amortization": "not_neg",
    },
    "interest_only": {
        "Interest Only": "int_only",
        "Principal + Interest": "not_int",
    },
    "lump_sum_payment": {
        "Lump Sum Payment": "lpsm",
        "No Lump Sum Payment": "not_lpsm",
        "not_lps": "not_lpsm",
    },
    "construction_type": {
        "Site Built (SB)": "sb",
        "Manufactured Home (MH)": "mh",
    },
    "occupancy_type": {
        "Primary Residence": "pr",
        "Secondary Residence": "sr",
        "Investment Residence": "ir",
    },
    "Secured_by": {
        "Home": "home",
        "Land": "land",
    },
    "total_units": {
        "1 Unit": "1U",
        "2 Units": "2U",
        "3 Units": "3U",
        "4 Units": "4U",
    },
    "credit_type": {
        "Experian (EXP)": "EXP",
        "Equifax (EQUI)": "EQUI",
        "CRIF": "CRIF",
        "CIBIL (CIB)": "CIB",
    },
    "co-applicant_credit_type": {
        "CIBIL (CIB)": "CIB",
        "Experian (EXP)": "EXP",
    },
    "age": {
        "Below 25": "<25",
        "25–34": "25-34",
        "35–44": "35-44",
        "45–54": "45-54",
        "55–64": "55-64",
        "65–74": "65-74",
        "Above 74": ">74",
    },
    "submission_of_application": {
        "Submitted through Institution": "to_inst",
        "Not Submitted through Institution": "not_inst",
    },
    "Region": {
        "South": "south",
        "North": "North",
        "Central": "central",
        "North-East": "North-East",
    },
    "Security_Type": {
        "Direct Security": "direct",
        "Indirect Security": "Indriect",
        "indirect": "Indriect",
    },
}


def normalize_loan_payload(payload: dict[str, Any]) -> dict[str, Any]:
    normalized: dict[str, Any] = {}

    for key, value in payload.items():
        canonical_key = KEY_ALIASES.get(key, key)
        if canonical_key in VALUE_MAPPINGS and isinstance(value, str):
            normalized[canonical_key] = VALUE_MAPPINGS[canonical_key].get(
                value, value
            )
        else:
            normalized[canonical_key] = value

    if "dtir1" not in normalized:
        normalized["dtir1"] = np.nan

    return normalized


NUMERIC_COLUMNS: tuple[str, ...] = (
    "ID",
    "loan_amount",
    "rate_of_interest",
    "Interest_rate_spread",
    "Upfront_charges",
    "term",
    "property_value",
    "income",
    "Credit_Score",
    "LTV",
    "dtir1",
)

CATEGORICAL_COLUMNS: tuple[str, ...] = (
    "loan_limit",
    "Gender",
    "approv_in_adv",
    "loan_type",
    "loan_purpose",
    "Credit_Worthiness",
    "open_credit",
    "business_or_commercial",
    "Neg_ammortization",
    "interest_only",
    "lump_sum_payment",
    "construction_type",
    "occupancy_type",
    "Secured_by",
    "total_units",
    "credit_type",
    "co-applicant_credit_type",
    "age",
    "submission_of_application",
    "Region",
    "Security_Type",
)


# ---------------------------------------------------------
# Prediction function
# ---------------------------------------------------------

def predict_loan(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Takes raw or UI-formatted loan application data, applies the saved
    preprocessing pipeline, and returns the neural-network
    prediction.
    """

    normalized_payload = normalize_loan_payload(payload)

    # Convert JSON payload into a DataFrame
    input_df = pd.DataFrame([normalized_payload])

    # Ensure numeric columns have float64 dtype and categorical columns have
    # object dtype (Pandas 3.0 defaults to StringDtype, which conflicts with
    # scikit-learn preprocessors fitted on object dtype in Pandas 2.x).
    for col in NUMERIC_COLUMNS:
        if col in input_df.columns:
            input_df[col] = pd.to_numeric(input_df[col], errors="coerce").astype("float64")

    for col in CATEGORICAL_COLUMNS:
        if col in input_df.columns:
            input_df[col] = input_df[col].astype(object)

    # Apply the exact preprocessing pipeline used during training
    processed_data = preprocessor.transform(input_df)

    # Convert sparse matrix to dense matrix if required
    if hasattr(processed_data, "toarray"):
        processed_data = processed_data.toarray()

    # Convert to the datatype expected by TensorFlow
    processed_data = np.asarray(
        processed_data,
        dtype=np.float32
    )

    # Model prediction
    probability = float(
        model.predict(
            processed_data,
            verbose=0
        )[0][0]
    )

    # Binary classification using the same 0.5 threshold
    prediction = int(probability >= 0.5)

    # Keep labels generic because the exact semantic meaning
    # of Status=0 and Status=1 should come from the dataset definition.
    if prediction == 1:
        label = "LOAN DEFAULT"
    else:
        label = "NO LOAN DEFAULT"

    # Debug information
    print("Processed shape:", processed_data.shape)
    print("Prediction probability:", probability)
    print("Prediction class:", prediction)

    return {
        "probability": round(probability, 6),
        "prediction": prediction,
        "label": label
    }
