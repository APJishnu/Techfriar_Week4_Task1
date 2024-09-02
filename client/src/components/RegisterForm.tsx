"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PopUpVerification from "./popUpVerification"; // Import the popup component
import styles from "../styles/RegisterForm.module.css";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
    general: "",
  });

  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    phone: false,
    dob: false,
    password: false,
  });

  const [verificationType, setVerificationType] = useState<"email" | "phone">("email"); // Updated types
  const [success, setSuccess] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false); // State to handle popup visibility
  const [userId, setUserId] = useState("")
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({ ...formData, [name]: value });

    // Mark the field as touched
    if (!touchedFields[name as keyof typeof touchedFields]) {
      setTouchedFields({ ...touchedFields, [name]: true });
    }




    // Validate the field irgb(17, 25, 135)
    let errorMessage = "";
    switch (name) {
      case "email":
        errorMessage = touchedFields.email && !validateEmail(value) ? "Please enter a valid email." : "";
        break;
      case "phone":
        errorMessage = touchedFields.phone && !validatePhone(value) ? "Please enter a valid phone number." : "";
        break;
      case "name":
        errorMessage = touchedFields.name && !value ? "Please fill in your name." : "";
        break;
      case "dob":
        errorMessage = touchedFields.dob && !value ? "Please fill in your date of birth." : "";
        break;
      case "password":
        errorMessage = touchedFields.password && !value ? "Please fill in your password." : "";
        break;
    }

    setErrors({ ...errors, [name]: errorMessage });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(null);

    // Perform a final validation before submitting
    const newErrors = {
      general: ""
    };

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.message === "User registered successfully") {
        setSuccess("Registration successful");
        setUserId(response.data.userId)
        setVerificationType("email");
        setShowPopup(true); // Show the popup when registration is successful
      } else {
        // Handle backend-specific errors
        const backendErrors = response.data.errors || {};
        setErrors({
          ...newErrors,
          ...backendErrors, // Merge backend errors into state
        });
      }
    } catch (err: any) {
      // Handle unexpected errors
    }
  };

  // Validation functions
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  const handleProceed = () => {
    const queryParams = new URLSearchParams({
      userId: userId,
      email: formData.email,
      phone: formData.phone,
    }).toString();

    setShowPopup(false); // Hide the popup

    router.push(`/register/email-verification?${queryParams}`);
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Just close the popup if the user decides not to proceed
  };

  return (
    <>
      <div className={styles.sectionMain}>
        <div className={styles.wrapper}>
          <img className={styles.Image} src="/illustrations/Register.svg"></img>
          <div className={styles.container}>
            <h1 className={styles.title}>Register</h1>

            <form onSubmit={handleSubmit}>
              <div className={styles.secondContainer}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                  {errors.name && <p className={styles.errorMessage}>{errors.name}</p>}
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                  {errors.email && <p className={styles.errorMessage}>{errors.email}</p>}
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                  {errors.phone && <p className={styles.errorMessage}>{errors.phone}</p>}
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>DOB:</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                  {errors.dob && <p className={styles.errorMessage}>{errors.dob}</p>}
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                  {errors.password && <p className={styles.errorMessage}>{errors.password}</p>}
                </div>
              </div>
              <div className={styles.buttonDiv}>
                <button type="submit" className={styles.submitButton}>
                  Register
                </button>
              </div>
              {success && <p className={styles.successMessage}>{success}</p>}
              {errors.general && <p className={styles.errorMessage}>{errors.general}</p>}
            </form>

          </div>

          {/* Conditionally render the popup */}
          {showPopup && (
            <PopUpVerification
              onClose={handleClosePopup}
              onProceed={handleProceed}
              verificationType={verificationType} // Dynamic verification type
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
