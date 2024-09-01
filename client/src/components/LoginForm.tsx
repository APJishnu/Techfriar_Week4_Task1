"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "../styles/LoginForm.module.css";

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({
        emailOrPhone: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        emailOrPhone: "",
        password: "",
        general: "",
    });

    const [touchedFields, setTouchedFields] = useState({
        emailOrPhone: false,
        password: false,
    });

    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Update form data
        setFormData({ ...formData, [name]: value });

        // Mark the field as touched
        if (!touchedFields[name as keyof typeof touchedFields]) {
            setTouchedFields({ ...touchedFields, [name]: true });
        }

        // Validate the field
        let errorMessage = "";
        if (name === "emailOrPhone") {
            errorMessage = touchedFields.emailOrPhone && !validateEmailOrPhone(value)
                ? "Please enter a valid email or phone number."
                : "";
        } else if (name === "password") {
            errorMessage = touchedFields.password && !value
                ? "Please fill in your password."
                : "";
        }

        setErrors({ ...errors, [name]: errorMessage });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSuccess(null);  // Reset success message

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials:true,
            });

            // Handle successful login
            if (response.data.message === "Login successful") {
                setSuccess("Login successful");
                router.push("/");
            } else {
                // Handle backend errors if any
                const backendErrors = response.data.errors || {};
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    ...backendErrors,
                }));
            }
        } catch (err: any) {
            // Handle unexpected errors
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    general: "An unexpected error occurred during login. Please try again later.",
                }));
            }
        }
    };


    // Validation function
    const validateEmailOrPhone = (value: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^[0-9]{10}$/.test(value);

    return (
        <div className={styles.sectionMain}>
            <div className={styles.wrapper}>
                <img className={styles.Image} src="/illustrations/Login.svg"></img>
                <div className={styles.container}>
                    <h1 className={styles.title}>Login</h1>

                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Email or Phone:</label>
                            <input
                                type="text"
                                name="emailOrPhone"
                                value={formData.emailOrPhone}
                                onChange={handleChange}
                                className={styles.inputField}
                            />
                            {errors.emailOrPhone && <p className={styles.errorMessage}>{errors.emailOrPhone}</p>}
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

                        <div className={styles.buttonDiv}>
                            <button type="submit" className={styles.submitButton}>
                                Login
                            </button>
                        </div>

                        {/* Display success or general error messages */}
                        {errors.general && <p className={styles.errorMessage}>{errors.general}</p>}
                    </form>

                </div>
            </div>
        </div>
    );
};

export default LoginForm;
