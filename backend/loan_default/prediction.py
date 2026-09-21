from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model


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
preprocessor = joblib.load(PREPROCESSOR_PATH)

print("Model and preprocessor loaded successfully.")


# ---------------------------------------------------------
# Prediction function
# ---------------------------------------------------------

def predict_loan(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Takes raw loan application data, applies the saved
    preprocessing pipeline, and returns the neural-network
    prediction.
    """

    # Convert JSON payload into a DataFrame
    input_df = pd.DataFrame([payload])

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