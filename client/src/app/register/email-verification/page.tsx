"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import OTPInput from "../../../components/OTPInput"; // Adjust path if needed
import PopUpVerification from "../../../components/popUpVerification";
import styles from "../../../styles/OTPInput.module.css"; // Adjust path if needed

const EmailVerification: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [verificationType, setVerificationType] = useState<"email" | "phone" | "aadhar">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false); // New state to track OTP sent status

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      setError("Email query parameter is missing");
    }
  }, [searchParams]);

  const getAuthToken = () => localStorage.getItem("authToken");

  const sendOtp = async () => {
    setLoading(true);
    const token = getAuthToken();
    setError(""); // Clear any previous errors
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        { field: "email", value: email },
        { withCredentials: true }
      );
      if (response.data.message === "OTP sent successfully.") {
        setLoading(false);
        setOtpSent(true); // Update OTP sent status
        setCountdown(60); // Set countdown for resend button
        startCountdown();
      } else {
        setLoading(false);
        setError(response.data.message || "Failed to send OTP. Please try again.");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  const verifyOtp = async () => {
    // Client-side validation for 6-digit OTP
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    const token = getAuthToken();
    setError(""); // Clear any previous errors
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        { field: "email", value: email, otp },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      if (response.data.verified) {
        setSuccess("Email verified successfully.");
        setVerificationType("email");
        setShowPopup(true); // Show popup for next verification (phone or aadhar)
      } else {
        setError("Incorrect OTP. Please try again."); // Handle incorrect OTP
      }
    } catch (err: any) {
      setError("Verification failed. Please try again.");
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

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleProceed = () => {
    const userId = searchParams.get("userId") || "";
    const phone = searchParams.get("phone") || "";
    const queryParams = new URLSearchParams({userId, phone }).toString();
  
    setShowPopup(false);
    if(!showPopup){
      setLoading(true)
    }
    router.push(`/register/phone-verification?${queryParams}`);
    
  };

  return (
    <div className={styles.wrapper}>
      <img className={styles.Image} src="/illustrations/Email.svg"></img>
  
      <div className={styles.container}>
        <h1 className={styles.title}>Email Verification</h1>
        {email ? (
          <>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputField}
              placeholder="Enter your email"
              readOnly
            />
            {!loading && (
              <button
                onClick={sendOtp}
                disabled={countdown > 0} // Disable button after OTP sent
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
      <span className={styles.tooltip}>sent Otp to Email for enable the button</span>
    ) : null}
  </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
            
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
          verificationType="phone"
        />
      )}
    </div>
  );
};

export default EmailVerification;
