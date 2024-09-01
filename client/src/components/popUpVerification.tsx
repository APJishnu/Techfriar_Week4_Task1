// popUpVerification.tsx
"use client";
import React from "react";
import styles from "../styles/popUpVerification.module.css";

interface PopUpVerificationProps {
  onClose: () => void;
  onProceed: () => void;
  verificationType: "email" | "phone" | "Identity"; // Add a verificationType prop
}

const popUpVerification: React.FC<PopUpVerificationProps> = ({ onClose, onProceed, verificationType }) => {
  return (
    <div className={styles.popupOverlay}>
      {verificationType === 'email' && (
  <p className={styles.text}>
    The User Registration has been successfully completed. For enhanced security, please also verify your Email.
  </p>
)}
      {verificationType === 'phone' && (
  <p className={styles.text}>
    Email verification has been successfully completed. For enhanced security, please also verify your phone number.
  </p>
)}

{verificationType === 'Identity' && (
  <div>
  <p className={styles.text}>
    Phone verification has been successfully completed. For more Detiaks required for our team , and its good to imporve your account security, please also verify your Identity number.
  </p>
  </div>
)}
      <div className={styles.popupContainer}>
      

        <h2 className={styles.popHeading}>Please Verify Your {verificationType.charAt(0).toUpperCase() + verificationType.slice(1)}</h2>
        <p className={styles.popDescription}>A {verificationType} verification is required to proceed. Please verify your {verificationType} to continue.</p>
        <div className={styles.buttonGroup}>
          <button onClick={onProceed} className={styles.proceedButton}>
           Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default popUpVerification;
