"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "../../../styles/financial-verification.module.css"; // Adjust the path if necessary

const FinancialVerification: React.FC = () => {
  const router = useRouter();
  const [bankAccountNumber, setBankAccountNumber] = useState<string>("");
  const [ifscCode, setIfscCode] = useState<string>("");
  const [gstNumber, setGstNumber] = useState<string>("");

  const [bankVerified, setBankVerified] = useState<boolean>(false);
  const [gstVerified, setGstVerified] = useState<boolean>(false);

  const [bankLoading, setBankLoading] = useState<boolean>(false);
  const [gstLoading, setGstLoading] = useState<boolean>(false);

  const [bankError, setBankError] = useState<string | null>(null);
  const [gstError, setGstError] = useState<string | null>(null);

  const [bankSuccess, setBankSuccess] = useState<string | null>(null);
  const [gstSuccess, setGstSuccess] = useState<string | null>(null);
  const [userId, setUserParams] = useState<string>("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      setUserParams(searchParams.get("userId") || "");
    }
  }, []);

  // Regular expressions for validation
  const bankAccountNumberRegex = /^[0-9]{9,18}$/; // Adjust as needed
  const ifscCodeRegex = /^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/; // Adjust as needed
  const gstNumberRegex = /^[A-Z0-9]{15}$/; // Adjust as needed

  const validateBankDetails = (): boolean => {
    if (!bankAccountNumber || !ifscCode) {
      setBankError("Please enter both bank account number and IFSC code.");
      return false;
    }
    if (!bankAccountNumberRegex.test(bankAccountNumber)) {
      setBankError("Invalid bank account number.");
      return false;
    }
    if (!ifscCodeRegex.test(ifscCode)) {
      setBankError("Invalid IFSC code.");
      return false;
    }
    setBankError(null);
    return true;
  };

  const validateGstNumber = (): boolean => {
    if (!gstNumber) {
      setGstError("Please enter your GST number.");
      return false;
    }
    if (!gstNumberRegex.test(gstNumber)) {
      setGstError("Invalid GST number.");
      return false;
    }
    setGstError(null);
    return true;
  };

  // Function to verify bank details
  const verifyBankDetails = async () => {
    if (!validateBankDetails()) return;

    setBankLoading(true);
    setBankSuccess(null);

    try {
      const postResponse = await axios.post("http://localhost:5000/api/auth/verify-bank", {
        bankAccountNumber,
        ifscCode,
        userId,
      });

      if (postResponse.data.success) {
        const requestId = postResponse.data.requestId;
        const bankAccountNumber = postResponse.data.bankAccountNumber;

        // Simulate checking the bank verification status after a delay
        setTimeout(async () => {
          try {
            const getResponse = await axios.get("http://localhost:5000/api/auth/check-bank-status", {
              params: { requestId, userId, bankAccountNumber }
            });

            if (getResponse.data.success) {
              setBankVerified(true);
              console.log(getResponse.data.success)
              setBankSuccess("Bank details verified successfully.");
            } else {
              setBankError(getResponse.data.message || "Bank verification failed.");
            }
          } catch (error) {
            setBankError("Failed to check bank verification status.");
          } finally {
            setBankLoading(false);
          }
        }, 5000); // Adjust delay as needed

      } else {
        setBankError(postResponse.data.message || "Bank verification failed.");
        setBankLoading(false);
      }
    } catch (error) {
      setBankError("An error occurred while verifying the bank account.");
      setBankLoading(false);
    }
  };

  // Function to verify GST number
  const verifyGst = async () => {
    if (!validateGstNumber()) return;

    setGstLoading(true);
    setGstSuccess(null);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-gst", {
        gstNumber, userId,
      });

      if (response.data.success) {
        setGstVerified(true);
        setGstSuccess("GST number verified successfully.");
      } else {
        setGstError(response.data.message || "GST verification failed.");
      }
    } catch (error) {
      setGstError("An error occurred while verifying the GST number.");
    } finally {
      setGstLoading(false);
    }
  };

  const proceedToNextStep = () => {
    router.push(`/register/address-lookup?userId=${userId}`); // Navigate to the address lookup page
  };

  return (
    <div className={styles.wrapper}>
      <img className={styles.Image} src="/illustrations/financial.svg"></img>
      <div className={styles.container}>
        <h1 className={styles.title}>Financial Verification</h1>

        {/* Bank Verification */}
        <div className={styles.inputGroup}>
          <div className={styles.inputWithButton}>
            <div className={styles.inputWithOutButton}>
              <input
                type="text"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                className={styles.inputField}
                placeholder="Enter your Bank Account Number"
                disabled={bankVerified || bankLoading}
              />
              <input
                type="text"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value)}
                className={styles.inputField}
                placeholder="Enter your IFSC Code"
                disabled={bankVerified || bankLoading}
              />
            </div>
            <div>
              <button
                onClick={verifyBankDetails}
                className={`${styles.verifyButton} ${bankVerified ? styles.verifiedButton : ''}`}
                disabled={bankVerified || bankLoading}
              >
                {bankLoading ? "Verifying..." : bankVerified ? "Verified" : "Verify"}
              </button>
            </div>
          </div>
          {bankError && <p className={styles.errorMessage}>{bankError}</p>}
        </div>

        {/* GST Verification */}
        <div className={styles.inputGroup}>
          <div className={styles.inputWithButton}>
            <input
              type="text"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value)}
              className={styles.inputField}
              placeholder="Enter your GST Number"
              disabled={gstVerified || gstLoading}
            />
            <button
              onClick={verifyGst}
              className={`${styles.verifyButton} ${gstVerified ? styles.verifiedButton : ''}`}
              disabled={gstVerified || gstLoading}
            >
              {gstLoading ? "Verifying..." : gstVerified ? "Verified" : "Verify"}
            </button>
          </div>
          {gstError && <p className={styles.errorMessage}>{gstError}</p>}
          {bankSuccess && gstSuccess && <p className={styles.successMessage}>Successfully verified</p>}
        </div>

        {/* Next Step Button */}
        <div className={styles.buttonDiv}>
  <div className={styles.tooltipWrapper}>
    <button
      className={`${styles.submitButton} ${bankVerified &&gstVerified ? styles.activeSubmitButton : ""}`}
      onClick={proceedToNextStep}
      disabled={!bankVerified || !gstVerified}
    >
      Proceed to Next Step
    </button>
    {!bankVerified || !gstVerified ? (
      <span className={styles.tooltip}>Verify both items to enable the button</span>
    ) : null}
  </div>
</div>
      </div>
    </div>
  );
};

export default FinancialVerification;
