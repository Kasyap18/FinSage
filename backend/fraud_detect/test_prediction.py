from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fraud_detect.inference.fraud_predict import predict_fraud


# 1. Genuine transaction sample (Expected: NOT FRAUD / 0)
NOT_FRAUD_SAMPLE = {
    "trans_date_trans_time": "2019-01-01 00:00:00",
    "cc_num": 1234567890123456,
    "merchant": "fraud_Rippin, Kub and Mann",
    "category": "misc_net",
    "amt": 100.5,
    "first": "John",
    "last": "Doe",
    "gender": "M",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": 10001,
    "lat": 40.7128,
    "long": -74.0060,
    "city_pop": 100000,
    "job": "Engineer",
    "dob": "1985-01-01",
    "trans_num": "abc123",
    "unix_time": 1546300800,
    "merch_lat": 40.7130,
    "merch_long": -74.0050,
}

# 2. Fraudulent transaction sample (Expected: FRAUD / 1)
FRAUD_SAMPLE = {
    "trans_date_trans_time": "2019-01-02 01:06:00",
    "cc_num": 4610000000000,
    "merchant": "fraud_Rutherford-Mertz",
    "category": "grocery_pos",
    "amt": 281.06,
    "first": "Jason",
    "last": "Murphy",
    "gender": "M",
    "street": "542 Steve Curve Suite 011",
    "city": "Collettsville",
    "state": "NC",
    "zip": 28611,
    "lat": 35.9946,
    "long": -81.7266,
    "city_pop": 885,
    "job": "Soil scientist",
    "dob": "1988-09-15",
    "trans_num": "e8a81877ae9a0a7f883e15cb39dc4022",
    "unix_time": 1330000000,
    "merch_lat": 36.43012,
    "merch_long": -81.1795,
}


if __name__ == "__main__":
    print("=== Test 1: Genuine Transaction (Expected: NOT FRAUD / 0) ===")
    res1 = predict_fraud(NOT_FRAUD_SAMPLE)
    print("Result:", res1)
    assert res1["prediction"] == 0, f"Expected 0, got {res1}"

    print("\n=== Test 2: Fraudulent Transaction (Expected: FRAUD / 1) ===")
    res2 = predict_fraud(FRAUD_SAMPLE)
    print("Result:", res2)
    assert res2["prediction"] == 1, f"Expected 1, got {res2}"

    print("\nAll Fraud Detection model tests passed!")

