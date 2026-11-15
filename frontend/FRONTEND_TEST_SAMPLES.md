# Frontend Test Samples (Loan Default & Fraud Detection V1 / V2)

Use the samples below to test every step of the multi-step forms in the frontend UI (`http://localhost:5173`).

---

## 1. Loan Default Detection (`/loan` in both `npm run dev` and `npm run dev2`)

The backend automatically normalizes UI dropdown labels to dataset codes, and defaults `dtir1` if omitted in V1.

### Case A: Low Risk — Expected Result: `NO LOAN DEFAULT` (`prediction: 0`)

| Step | Field Label (`name`) | Value to Enter / Select |
| :--- | :--- | :--- |
| **1. Applicant & Loan Setup** | Applicant ID (`id`) | `84256` |
| | Loan Limit (`loan_limit`) | `CF` |
| | Gender (`gender`) | `Joint` |
| | Approval Status (`approv_in_adv`) | `Not Pre-approved` |
| | Loan Type (`loan_type`) | `Loan Type 1` |
| | Loan Purpose (`loan_purpose`) | `Purpose 3` |
| **2. Property & Occupancy** | Property Value (`property_value`) | `1308000` |
| | Construction Type (`construction_type`) | `Site Built (SB)` |
| | Occupancy Type (`occupancy_type`) | `Primary Residence` |
| | Secured By (`secured_by`) | `Home` |
| | Total Units (`total_units`) | `1 Unit` |
| **3. Credit Profile** | Credit Worthiness (`credit_worthiness`) | `Credit Level 1` |
| | Open Credit (`open_credit`) | `No Open Credit` |
| | Business / Commercial (`business_or_commercial`) | `Non-Business/Commercial` |
| | Income (`income`) | `13080` |
| | Credit Type (`credit_type`) | `CIBIL (CIB)` |
| | Credit Score (`Credit_Score`) | `596` |
| | Co-Applicant Credit Type (`co_applicant_credit_type`) | `Experian (EXP)` |
| | Age (`age`) | `35–44` |
| **4. Loan & Interest** | Loan Amount (`loan_amount`) | `626500` |
| | Rate of Interest (`rate_of_interest`) | `3.75` |
| | Interest Rate Spread (`interest_rate_spread`) | `-0.01` |
| | Upfront Charges (`upfront_charges`) | `661.5` |
| | Loan Term (`term`) | `360` |
| | Submission of Application (`submission_of_application`) | `Not Submitted through Institution` |
| | Loan-to-Value (LTV) (`LTV`) | `47.897554` |
| | Debt-to-Income Ratio (`dtir1`, shown in V2) | `25` |
| **5. Payment & Security** | Negative Amortization (`neg_ammortization`) | `No Negative Amortization` |
| | Interest Only (`interest_only`) | `Principal + Interest` |
| | Lump Sum Payment (`lump_sum_payment`) | `No Lump Sum Payment` |
| | Region (`Region`) | `South` |
| | Security Type (`Security_Type`) | `Direct Security` |

---

### Case B: High Risk — Expected Result: `LOAN DEFAULT` (`prediction: 1`, `probability ≈ 0.703`)

| Step | Field Label (`name`) | Value to Enter / Select |
| :--- | :--- | :--- |
| **1. Applicant & Loan Setup** | Applicant ID (`id`) | `29211` |
| | Loan Limit (`loan_limit`) | `NCF` |
| | Gender (`gender`) | `Male` |
| | Approval Status (`approv_in_adv`) | `Not Pre-approved` |
| | Loan Type (`loan_type`) | `Loan Type 1` |
| | Loan Purpose (`loan_purpose`) | `Purpose 1` |
| **2. Property & Occupancy** | Property Value (`property_value`) | `5208000` |
| | Construction Type (`construction_type`) | `Site Built (SB)` |
| | Occupancy Type (`occupancy_type`) | `Primary Residence` |
| | Secured By (`secured_by`) | `Home` |
| | Total Units (`total_units`) | `1 Unit` |
| **3. Credit Profile** | Credit Worthiness (`credit_worthiness`) | `Credit Level 1` |
| | Open Credit (`open_credit`) | `No Open Credit` |
| | Business / Commercial (`business_or_commercial`) | `Non-Business/Commercial` |
| | Income (`income`) | `119340` |
| | Credit Type (`credit_type`) | `Experian (EXP)` |
| | Credit Score (`Credit_Score`) | `751` |
| | Co-Applicant Credit Type (`co_applicant_credit_type`) | `CIBIL (CIB)` |
| | Age (`age`) | `55–64` |
| **4. Loan & Interest** | Loan Amount (`loan_amount`) | `3576500` |
| | Rate of Interest (`rate_of_interest`) | `3.99` |
| | Interest Rate Spread (`interest_rate_spread`) | `0.39` |
| | Upfront Charges (`upfront_charges`) | `2601.63` |
| | Loan Term (`term`) | `360` |
| | Submission of Application (`submission_of_application`) | `Submitted through Institution` |
| | Loan-to-Value (LTV) (`LTV`) | `68.673195` |
| | Debt-to-Income Ratio (`dtir1`, shown in V2) | `25` |
| **5. Payment & Security** | Negative Amortization (`neg_ammortization`) | `No Negative Amortization` |
| | Interest Only (`interest_only`) | `Principal + Interest` |
| | Lump Sum Payment (`lump_sum_payment`) | `No Lump Sum Payment` |
| | Region (`Region`) | `North` |
| | Security Type (`Security_Type`) | `Direct Security` |

---

## 2. Fraud Detection V2 (`/fraud` when running `npm run dev2`)

Uses the 21 raw transaction attributes required by the trained XGBoost model (`backend/fraud_detect/models/model.xgb.json`, threshold `0.66`).

### Case A: Genuine Transaction — Expected Result: `NOT FRAUD` (`prediction: 0`)

| Step | Field Label (`name`) | Value to Enter / Select |
| :--- | :--- | :--- |
| **1. Cardholder Info** | First Name (`first`) | `John` |
| | Last Name (`last`) | `Doe` |
| | Gender (`gender`) | `Male` |
| | Date of Birth (`dob`) | `1985-01-01` |
| | Occupation / Job (`job`) | `Engineer` |
| | Credit Card Number (`cc_num`) | `1234567890123456` |
| **2. Transaction Details** | Transaction ID (`trans_num`) | `abc123` |
| | Transaction Date & Time (`trans_date_trans_time`) | `2019-01-01T00:00` |
| | Unix Timestamp (`unix_time`) | `1546300800` |
| | Transaction Amount ($) (`amt`) | `100.5` |
| | Merchant Category (`category`) | `Miscellaneous (Online)` |
| | Merchant Name (`merchant`) | `fraud_Rippin, Kub and Mann` |
| **3. Cardholder Location** | Street Address (`street`) | `123 Main St` |
| | City (`city`) | `New York` |
| | State (`state`) | `NY` |
| | ZIP Code (`zip`) | `10001` |
| | City Population (`city_pop`) | `100000` |
| | Customer Latitude (`lat`) | `40.7128` |
| | Customer Longitude (`long`) | `-74.006` |
| **4. Merchant Coordinates** | Merchant Latitude (`merch_lat`) | `40.713` |
| | Merchant Longitude (`merch_long`) | `-74.005` |

---

### Case B: Fraudulent Transaction — Expected Result: `FRAUD` (`prediction: 1`)

| Step | Field Label (`name`) | Value to Enter / Select |
| :--- | :--- | :--- |
| **1. Cardholder Info** | First Name (`first`) | `Jason` |
| | Last Name (`last`) | `Murphy` |
| | Gender (`gender`) | `Male` |
| | Date of Birth (`dob`) | `1988-09-15` |
| | Occupation / Job (`job`) | `Soil scientist` |
| | Credit Card Number (`cc_num`) | `4610000000000` |
| **2. Transaction Details** | Transaction ID (`trans_num`) | `e8a81877ae9a0a7f883e15cb39dc4022` |
| | Transaction Date & Time (`trans_date_trans_time`) | `2019-01-02T01:06` |
| | Unix Timestamp (`unix_time`) | `1330000000` |
| | Transaction Amount ($) (`amt`) | `281.06` |
| | Merchant Category (`category`) | `Grocery (POS)` |
| | Merchant Name (`merchant`) | `fraud_Rutherford-Mertz` |
| **3. Cardholder Location** | Street Address (`street`) | `542 Steve Curve Suite 011` |
| | City (`city`) | `Collettsville` |
| | State (`state`) | `NC` |
| | ZIP Code (`zip`) | `28611` |
| | City Population (`city_pop`) | `885` |
| | Customer Latitude (`lat`) | `35.9946` |
| | Customer Longitude (`long`) | `-81.7266` |
| **4. Merchant Coordinates** | Merchant Latitude (`merch_lat`) | `36.43012` |
| | Merchant Longitude (`merch_long`) | `-81.1795` |

---

## 3. Fraud Detection V1 (`/fraud` when running `npm run dev` with `VITE_USE_MOCK=true`)

| Step | Field Label (`name`) | Genuine (`0`) | High-Risk (`1`) |
| :--- | :--- | :--- | :--- |
| **1. User Profile** | User ID (`user_id`) | `1024` | `9981` |
| | Account Age (Days) (`account_age_days`) | `730` | `5` |
| | Average Transaction Amount ($) (`avg_transaction_amount`) | `85.50` | `40.00` |
| **2. Transaction Details** | Transaction Amount ($) (`transaction_amount`) | `92.00` | `8500.00` |
| | Transaction Type (`transaction_type`) | `Online Purchase` | `Wire Transfer` |
| | Merchant Category (`merchant_category`) | `Retail & Shopping` | `Cryptocurrency` |
| | Transaction Hour (0-23) (`transaction_hour`) | `14` | `3` |
| **3. Context & Location** | Device Type (`device_type`) | `Mobile App` | `Web Browser` |
| | Location Match (`location_match`) | `Yes - Matches Billing` | `No - Different Location` |
| | Foreign Transaction (`is_foreign_transaction`) | `No - Domestic` | `Yes - International` |
| | Distance from Home (km) (`distance_from_home_km`) | `4.5` | `4200` |
| **4. Risk & Velocity** | Failed Login Attempts (24h) (`failed_login_attempts`) | `0` | `6` |
| | Transactions in Last 24h (`tx_count_last_24h`) | `2` | `18` |
| | Card Present (`card_present`) | `No - Card Not Present (CNP)` | `No - Card Not Present (CNP)` |
| | High Risk Country (`high_risk_country`) | `No` | `Yes` |
| | Previous Fraud Flag (`previous_fraud_flag`) | `No` | `Yes` |
