import os
import joblib
import numpy as np
import pandas as pd
from xgboost import XGBClassifier
from pathlib import Path

# ============================================================
# LOAD MODEL
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"

MODEL_PATH = MODEL_DIR / "model.xgb.json"
PREPROCESSING_PATH = MODEL_DIR / "preprocessing.pkl"

prep = joblib.load(PREPROCESSING_PATH)

model = XGBClassifier()
model.load_model(MODEL_PATH)


# ============================================================
# LOAD SAVED PREPROCESSING
# ============================================================

card_stats = prep["card_stats"]
merchant_frequency = prep["merchant_frequency"]
city_frequency = prep["city_frequency"]

categorical_features = prep["categorical_features"]
category_mappings = prep["category_mappings"]

train_medians = prep["train_medians"]

feature_columns = prep["feature_columns"]
encoded_feature_columns = prep["encoded_feature_columns"]

threshold = prep["threshold"]


# ============================================================
# HAVERSINE DISTANCE
# ============================================================

def haversine_distance(
    lat1,
    lon1,
    lat2,
    lon2
):

    lat1 = np.radians(lat1)
    lon1 = np.radians(lon1)

    lat2 = np.radians(lat2)
    lon2 = np.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        np.sin(dlat / 2) ** 2
        +
        np.cos(lat1)
        * np.cos(lat2)
        * np.sin(dlon / 2) ** 2
    )

    c = 2 * np.arcsin(
        np.sqrt(a)
    )

    return 6371 * c


# ============================================================
# FEATURE ENGINEERING
# ============================================================

def create_features(dataframe):

    dataframe = dataframe.copy()

    # Date
    dataframe["trans_date_trans_time"] = pd.to_datetime(
        dataframe["trans_date_trans_time"]
    )

    dataframe["trans_hour"] = (
        dataframe["trans_date_trans_time"].dt.hour
    )

    dataframe["trans_day"] = (
        dataframe["trans_date_trans_time"].dt.day
    )

    dataframe["trans_month"] = (
        dataframe["trans_date_trans_time"].dt.month
    )

    dataframe["trans_dayofweek"] = (
        dataframe["trans_date_trans_time"].dt.dayofweek
    )

    dataframe["trans_dayofyear"] = (
        dataframe["trans_date_trans_time"].dt.dayofyear
    )

    dataframe["is_weekend"] = (
        dataframe["trans_dayofweek"] >= 5
    ).astype("int8")

    dataframe["is_night"] = (
        (dataframe["trans_hour"] < 6)
        |
        (dataframe["trans_hour"] >= 22)
    ).astype("int8")

    # Age
    dataframe["dob"] = pd.to_datetime(
        dataframe["dob"]
    )

    dataframe["customer_age"] = (
        dataframe["trans_date_trans_time"]
        - dataframe["dob"]
    ).dt.days / 365.25

    # Distance
    dataframe["distance_km"] = haversine_distance(
        dataframe["lat"],
        dataframe["long"],
        dataframe["merch_lat"],
        dataframe["merch_long"]
    )

    # Log amount
    dataframe["log_amount"] = np.log1p(
        dataframe["amt"]
    )

    return dataframe


# ============================================================
# BEHAVIOR FEATURES
# ============================================================

def apply_behavior_features(dataframe):

    dataframe = dataframe.copy()

    # Card statistics
    dataframe = dataframe.join(
        card_stats,
        on="cc_num"
    )

    # Merchant frequency
    dataframe["merchant_frequency"] = (
        dataframe["merchant"]
        .map(merchant_frequency)
        .fillna(0)
    )

    # City frequency
    dataframe["city_frequency"] = (
        dataframe["city"]
        .map(city_frequency)
        .fillna(0)
    )

    # Remove columns not used by model
    columns_to_drop = [
        "is_fraud",
        "trans_num",
        "trans_date_trans_time",
        "dob",
        "first",
        "last",
        "street",
        "cc_num"
    ]

    dataframe = dataframe.drop(
        columns=[
            column
            for column in columns_to_drop
            if column in dataframe.columns
        ]
    )

    return dataframe


# ============================================================
# PREPARE DATA
# ============================================================

def prepare_data(dataframe):

    dataframe = create_features(dataframe)

    dataframe = apply_behavior_features(dataframe)

    # --------------------------------------------------------
    # Clean feature names
    # --------------------------------------------------------

    cleaned_columns = []

    for column in dataframe.columns:

        column = str(column)

        column = column.replace("[", "_")
        column = column.replace("]", "_")
        column = column.replace("<", "_")
        column = column.replace(">", "_")

        cleaned_columns.append(column)

    dataframe.columns = cleaned_columns

    # --------------------------------------------------------
    # Make sure all training features exist
    # --------------------------------------------------------

    for column in feature_columns:

        if column not in dataframe.columns:

            dataframe[column] = np.nan

    # --------------------------------------------------------
    # Keep only training features
    # --------------------------------------------------------

    dataframe = dataframe[
        feature_columns
    ].copy()

    # --------------------------------------------------------
    # Encode categorical features
    # --------------------------------------------------------

    for column in categorical_features:

        mapping = category_mappings[column]

        dataframe[column] = (
            dataframe[column]
            .astype(str)
            .map(mapping)
            .fillna(-1)
        )

    # --------------------------------------------------------
    # Convert everything to numeric
    # --------------------------------------------------------

    for column in dataframe.columns:

        dataframe[column] = pd.to_numeric(
            dataframe[column],
            errors="coerce"
        )

    # --------------------------------------------------------
    # Replace infinity
    # --------------------------------------------------------

    dataframe = dataframe.replace(
        [np.inf, -np.inf],
        np.nan
    )

    # --------------------------------------------------------
    # Fill missing values
    # --------------------------------------------------------

    for column in dataframe.columns:

        if column in train_medians.index:

            dataframe[column] = (
                dataframe[column]
                .fillna(train_medians[column])
            )

        else:

            dataframe[column] = (
                dataframe[column]
                .fillna(0)
            )

    # --------------------------------------------------------
    # Exact training feature order
    # --------------------------------------------------------

    dataframe = dataframe[
        encoded_feature_columns
    ]

    return dataframe


# ============================================================
# UI LABEL -> DATASET CODE NORMALIZATION
# ============================================================

GENDER_UI_MAP = {
    "Male": "M",
    "Female": "F",
    "Male (M)": "M",
    "Female (F)": "F",
    "M": "M",
    "F": "F",
}

CATEGORY_UI_MAP = {
    "Entertainment": "entertainment",
    "Food & Dining": "food_dining",
    "Gas & Transport": "gas_transport",
    "Grocery (Online)": "grocery_net",
    "Grocery (POS)": "grocery_pos",
    "Health & Fitness": "health_fitness",
    "Home": "home",
    "Kids & Pets": "kids_pets",
    "Miscellaneous (Online)": "misc_net",
    "Misc (Online)": "misc_net",
    "Miscellaneous (POS)": "misc_pos",
    "Misc (POS)": "misc_pos",
    "Personal Care": "personal_care",
    "Shopping (Online)": "shopping_net",
    "Shopping (POS)": "shopping_pos",
    "Travel": "travel",
}


def normalize_fraud_payload(data: dict) -> dict:
    normalized = dict(data)
    if "gender" in normalized and isinstance(normalized["gender"], str):
        normalized["gender"] = GENDER_UI_MAP.get(
            normalized["gender"], normalized["gender"]
        )
    if "category" in normalized and isinstance(normalized["category"], str):
        normalized["category"] = CATEGORY_UI_MAP.get(
            normalized["category"], normalized["category"]
        )
    if "trans_date_trans_time" in normalized and isinstance(
        normalized["trans_date_trans_time"], str
    ):
        dt_str = normalized["trans_date_trans_time"].replace("T", " ")
        if len(dt_str) == 16:
            dt_str = f"{dt_str}:00"
        normalized["trans_date_trans_time"] = dt_str
    return normalized


# ============================================================
# PREDICTION FUNCTION
# ============================================================

def predict_fraud(data):

    """
    Input:
        data: Python dictionary containing one transaction.

    Output:
        Dictionary containing fraud probability,
        prediction and label.
    """

    normalized_data = normalize_fraud_payload(data)

    # Convert JSON/dictionary to DataFrame
    dataframe = pd.DataFrame([normalized_data])

    # Apply preprocessing
    prepared_data = prepare_data(
        dataframe
    )

    # Fraud probability
    probability = float(
        model.predict_proba(
            prepared_data
        )[0, 1]
    )

    # Apply saved threshold
    prediction = int(
        probability >= threshold
    )

    # Label
    if prediction == 1:
        label = "FRAUD"
    else:
        label = "NOT FRAUD"

    # Return JSON-compatible dictionary
    return {
        "probability": round(
            probability,
            6
        ),
        "prediction": prediction,
        "label": label
    }