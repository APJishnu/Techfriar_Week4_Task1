"use client";
// src/app/PhoneVerification/PhoneVerification.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import OTPInput from "../../../components/OTPInput"; // Adjust path if needed
import styles from "../../../styles/OTPInput.module.css"; // Adjust path if needed
import PopUpVerification from "@/components/popUpVerification";

const PhoneVerification: React.FC = () => {
  const [verificationType, setVerificationType] = useState<"email" | "phone" | "Identity">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false); // New state to track OTP sent status

  const searchParams = new URLSearchParams(window.location.search);

  useEffect(() => {
    const phoneParams = searchParams.get("phone") || "";
    setPhoneNumber(phoneParams); 
  }, []); 

  const sendOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/send-otp", 
        { field: "phone", value: phoneNumber },
        { withCredentials: true }
      );
      if (response.data.message === "OTP sent successfully.") {
        setLoading(false);
        setOtpSent(true); // Update OTP sent status
        setCountdown(60);
        startCountdown();
      } else {
        setLoading(false);
        setError(response.data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err: any) {
      setLoading(false);
      console.error("Error sending OTP:", err.response?.data);
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { field: "phone", value: phoneNumber, otp },
        { withCredentials: true }
      );
      if (response.data.verified) {
        setSuccess("Phone number verified successfully.");
        setVerificationType("phone");
        setShowPopup(true); 
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      console.error("Error verifying OTP:", err.response?.data);
      setError(err.response?.data?.message || "OTP verification failed. Please try again.");
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleProceed = () => {
    const userId = searchParams.get("userId") || "";
    const queryParams = new URLSearchParams({ userId,phone: phoneNumber }).toString();
    setShowPopup(false);
    router.push(`/register/identity-verification?${queryParams}`);
  };

  return (
    <div className={styles.wrapper}>
      <img className={styles.Image} src="/illustrations/Phone.svg"></img>
      <div className={styles.container}>
        <h1 className={styles.title}>Phone Verification</h1>
        {phoneNumber ? (
          <>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.inputField}
              placeholder="Enter your phone number"
              readOnly
            />
            {!loading && (
              <button
                onClick={sendOtp}
                disabled={countdown > 0 } 
                className={`${styles.sendButton} ${otpSent ? styles.activeSendButton : ""}`}
              >
                {countdown > 0 ? `Resend OTP (${countdown})` : "Send OTP"}
              </button>
            )}
            {loading && (
              <div className={styles.spinnerDiv}>
                <div className={styles.loadingSpinner}></div>
              </div>
            )}
            <OTPInput length={6} onChange={(otp) => setOtp(otp)} />
            <div className={styles.tooltipWrapper}>
    <button
      className={`${styles.verifyButton} ${otpSent ? styles.activeSubmitButton : ""}`}
      onClick={verifyOtp}
      disabled={!otpSent}
    >
      verify OTP
    </button>
    {!otpSent? (
      <span className={styles.tooltip}>sent Otp to phone for enable the button</span>
    ) : null}
  </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}
          </>
        ) : (
          <div className={styles.loadingContainer}>
          <div className={styles.spinnerDiv}>
            <div className={styles.loadingSpinner}></div>
          </div>
          <p className={styles.loadingText}>wait...</p>
        </div>
        )}
      </div>
      {showPopup && (
        <PopUpVerification
          onClose={handleClosePopup}
          onProceed={handleProceed}
          verificationType="Identity"
        />
      )}
    </div>
  );
};

export default PhoneVerification;
