"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

import styles from "../../../styles/address-lookup.module.css"; // Adjust the path if necessary

const AddressLookup: React.FC = () => {
    const [pincode, setPincode] = useState<string>("");
    const [address, setAddress] = useState<{
        place: string;
        district: string;
        state: string;
        country: string;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [userId, setUserParams] = useState<string>("");

    // Extract phone number from URL params
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            setUserParams(searchParams.get("userId") || "");
        }
    }, []);

    // Function to verify the pincode as the user types
    const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputPincode = e.target.value;

        // Regular expression for a valid pincode: must be exactly 6 digits
        const pinCodePattern = /^[0-9]{0,6}$/;

        if (pinCodePattern.test(inputPincode)) {
            setPincode(inputPincode);
            setError(null); // Clear any existing errors

            // Trigger API call only when pincode is exactly 6 digits
            if (inputPincode.length === 6) {
                setLoading(true);
                setAddress(null); // Reset address before API call

                try {
                    const response = await axios.post("http://localhost:5000/api/auth/verify-pincode", {
                        pincode: inputPincode,
                        userId,
                    });

                    if (response.data.success) {
                        const { address } = response.data;
                        const addressArray = address.split(",");
                        setAddress({
                            place: addressArray[0],
                            district: addressArray[1].trim(),
                            state: addressArray[2].trim(),
                            country: addressArray[3].trim(),
                        });

                        toast.success("Address lookup successful!");
                    } else {
                        setError(response.data.message || "Pincode verification failed.");
                    }
                } catch (error) {
                    setError("An error occurred while verifying the PIN code.");
                } finally {
                    setLoading(false);
                }
            } else {
                // Clear address if pincode length is not 6
                setAddress(null);
            }
        } else {
            // Set an error if the input is not valid (e.g., more than 6 digits or non-numeric characters)
            setError("Pincode must be exactly 6 digits.");
            setPincode(inputPincode.slice(0, 6)); // Enforce maximum 6 digits
            setAddress(null); // Reset address
        }
    };



    // Function to handle the KYC verification process
    const handleKycVerification = async () => {
        if (address) {
            try {
                // Make Axios call to save address or proceed with KYC verification
                const response = await axios.post("http://localhost:5000/api/auth/add-address", {
                    pincode,
                    userId,
                    place: address.place,
                    district: address.district,
                    state: address.state,
                    country: address.country,
                });

                if (response.data.success) {
                    toast.success("KYC verification successful!");

                } else {
                    toast.error("KYC verification failed. Please try again.");
                }
            } catch (error) {
                toast.error("An error occurred while proceeding with KYC.");
            }
        } else {
            toast.error("Please complete the address lookup first.");
        }
    };

    return (
        <div className={styles.wrapper}>
            <img className={styles.Image} src="/illustrations/addressLookup.svg"></img>
            <div className={styles.container}>
                <h1 className={styles.title}>Address Lookup</h1>
                <p className={styles.description}>Please Enter 6 Digit pincode for address lookup.</p>

                {/* Pincode Verification */}
                <div className={styles.inputGroup}>
                    <div className={styles.inputWithButton}>
                        <input
                            type="text"
                            value={pincode}
                            onChange={handlePincodeChange}
                            className={styles.pinInputField}
                            placeholder="Enter your PIN code"
                            maxLength={6} // Enforce max length at the input level
                            disabled={loading}
                        />
                        {loading && <div className={styles.loadingSpinner}></div>}
                    </div>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                </div>

                {/* Address Fields */}
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        className={styles.inputField}
                        placeholder="Place"
                        value={address?.place || ""}
                        readOnly
                    />
                    <input
                        type="text"
                        className={styles.inputField}
                        placeholder="District"
                        value={address?.district || ""}
                        readOnly
                    />
                    <input
                        type="text"
                        className={styles.inputField}
                        placeholder="State"
                        value={address?.state || ""}
                        readOnly
                    />
                    <input
                        type="text"
                        className={styles.inputField}
                        placeholder="Country"
                        value={address?.country || ""}
                        readOnly
                    />
                </div>

                {/* KYC Verification Button */}
                {address && (
                     <button className={styles.kycButton} onClick={handleKycVerification}>
                     Proceed with KYC Verification
                 </button>
                )}

            </div>
            {/* Toast Container */}
            <ToastContainer
                className={styles.customToastContainer}
                autoClose={5000}
                pauseOnHover
                draggable
                style={{
                    position: 'absolute',  // Use absolute positioning
                    top: '87%',           // Adjust the top position
                    left: '35%',
                    margin: '0',           // Adjust the margin as needed
                  }} // Inline style for margin
            />
        </div>

    );
};

export default AddressLookup;
