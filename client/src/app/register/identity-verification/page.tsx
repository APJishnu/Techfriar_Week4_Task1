"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "../../../styles/identity-verification.module.css"; // Adjust path if needed

const IdentityVerification: React.FC = () => {
  const router = useRouter();
  
  const [aadharNumber, setAadharNumber] = useState<string>("");
  const [panNumber, setPanNumber] = useState<string>("");
  const [aadharVerified, setAadharVerified] = useState<boolean>(false);
  const [panVerified, setPanVerified] = useState<boolean>(false);
  const [aadharError, setAadharError] = useState<string | null>(null);
  const [panError, setPanError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [aadharLoading, setAadharLoading] = useState<boolean>(false);
  const [panLoading, setPanLoading] = useState<boolean>(false);
  const [userId,setUserId] = useState("")
  //666479517256
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const userIdParams = searchParams.get("userId") || "";
    setUserId(userIdParams); // Set phone number from query params
  }, []);

  const validateAadhar = (aadhar: string): boolean => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };

  const validatePan = (pan: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan);
  };

  const verifyAadhar = async () => {
    if (!aadharNumber) {
      setAadharError("Aadhar number cannot be empty.");
      return;
    }

    if (!validateAadhar(aadharNumber)) {
      setAadharError("Invalid Aadhar number. Must be exactly 12 digits.");
      return;
    }

    setAadharLoading(true);
    setAadharError(null);
    setSuccess(null);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-aadhar", {
        aadharNumber,
        userId,
      });
      if (response.data.verified) {
        setAadharVerified(true);
        setSuccess("Aadhar verified successfully.");
      } else {
        setAadharError("Aadhar verification failed.");
      }
    } catch (err) {
      setAadharError("Aadhar verification failed. Please try again.");
    } finally {
      setAadharLoading(false);
    }
  };

  const verifyPan = async () => {
    if (!panNumber) {
      setPanError("PAN number cannot be empty.");
      return;
    }

    if (!validatePan(panNumber)) {
      setPanError("Invalid PAN number. Must be 10 characters (5 letters, 4 digits, 1 letter).");
      return;
    }

    setPanLoading(true);
    setPanError(null);
    setSuccess(null);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-pan", { panNumber, userId });
      if (response.data.verified) {
        setPanVerified(true);
        setSuccess("PAN verified successfully.");
      } else {
        setPanError("PAN verification failed.");
      }
    } catch (err) {
      setPanError("PAN verification failed. Please try again.");
    } finally {
      setPanLoading(false);
    }
  };

  const queryParams = new URLSearchParams({ userId: userId }).toString();

  return (
    <div className={styles.wrapper}>
      <img className={styles.Image} src="/illustrations/identity.svg"></img>
      <div className={styles.container}>
        <h1 className={styles.title}>Identity Verification</h1>

        {/* Aadhar Verification */}
        <div className={styles.inputGroup}>
          <div className={styles.inputWithButton}>
            <input
              type="text"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
              className={styles.inputField}
              placeholder="Enter your Aadhar number"
              disabled={aadharVerified || aadharLoading}
            />
            <button
              onClick={verifyAadhar}
              className={`${styles.verifyButton} ${aadharVerified ? styles.verifiedButton : ""}`}
              disabled={aadharVerified || aadharLoading}
            >
              {aadharLoading ? "Verifying..." : aadharVerified ? "Verified" : "Verify"}
            </button>
          </div>
          {aadharError && <p className={styles.errorMessage}>{aadharError}</p>}
        </div>

        {/* PAN Verification */}
        <div className={styles.inputGroup}>
          <div className={styles.inputWithButton}>
            <input
              type="text"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value)}
              className={styles.inputField}
              placeholder="Enter your PAN number"
              disabled={panVerified || panLoading}
            />
            <button
              onClick={verifyPan}
              className={`${styles.verifyButton} ${panVerified ? styles.verifiedButton : ""}`}
              disabled={panVerified || panLoading}
            >
              {panLoading ? "Verifying..." : panVerified ? "Verified" : "Verify"}
            </button>
          </div>
          {panError && <p className={styles.errorMessage}>{panError}</p>}
        </div>

        {/* Proceed Button */}
        <div className={styles.buttonDiv}>
          <div className={styles.tooltipWrapper}>
            <button
              className={`${styles.submitButton} ${aadharVerified && panVerified ? styles.activeSubmitButton : ""}`}
              onClick={() => router.push(`/register/financial-verification?${queryParams}`)}
              disabled={!aadharVerified || !panVerified}
            >
              Proceed to Next Step
            </button>
            {!aadharVerified || !panVerified ? (
              <span className={styles.tooltip}>Verify both items to enable the button</span>
            ) : null}
          </div>
        </div>

      </div>
    </div>
  );
};

export default IdentityVerification;
