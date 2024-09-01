"use client";

import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import useAuth from '../hooks/useAuth'; // Import the custom hook

const Home: React.FC = () => {
  const { isLoggedIn, user, loading } = useAuth(); // Use the custom hook

  const handleLogout =  () => {
     axios.get('http://localhost:5000/api/auth/logout', { withCredentials: true });
    window.location.reload(); // Refresh the page to update the UI
  };

  if (loading) {
    return <div className={styles.loadingSpinner}></div>;
  }

  return (
    <div className={styles.wrapper}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1>Welcome to Our Website</h1>
        <p>Your one-stop solution for all your needs!</p>
        <div className={styles.heroButtons}>
          {!isLoggedIn ? (
            <>
              <Link href='/register'>
                <span className={styles.button}>Register</span>
              </Link>
              <Link href='/login'>
                <span className={styles.button}>Login</span>
              </Link>
            </>
          ) : (
            <>
              <button onClick={handleLogout} className={styles.button}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Features Section - Display form with fields from schema */}
      {isLoggedIn && (
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.title}>User Details</h2>
            <p className={styles.description}>Please fill in the details below.</p>
            <form className={styles.userForm}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" className={styles.inputField} defaultValue={user?.name || ''} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" className={styles.inputField} defaultValue={user?.email || ''} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="phone">Phone:</label>
                <input type="text" id="phone" name="phone" className={styles.inputField} defaultValue={user?.phone || ''} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="dob">Date of Birth:</label>
                <input type="date" id="dob" name="dob" className={styles.inputField} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="aadhaarNumber">Aadhaar Number:</label>
                <input type="text" id="aadhaarNumber" name="aadhaarNumber" className={styles.inputField} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="panNumber">PAN Number:</label>
                <input type="text" id="panNumber" name="panNumber" className={styles.inputField} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="bankAccountNumber">Bank Account Number:</label>
                <input type="text" id="bankAccountNumber" name="bankAccountNumber" className={styles.inputField} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="gstNumber">GST Number:</label>
                <input type="text" id="gstNumber" name="gstNumber" className={styles.inputField} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="addressPincode">Pincode:</label>
                <input type="text" id="addressPincode" name="addressPincode" className={styles.inputField} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="addressPlace">Place:</label>
                <input type="text" id="addressPlace" name="addressPlace" className={styles.inputField} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="addressDistrict">District:</label>
                <input type="text" id="addressDistrict" name="addressDistrict" className={styles.inputField} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="addressState">State:</label>
                <input type="text" id="addressState" name="addressState" className={styles.inputField} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="addressCountry">Country:</label>
                <input type="text" id="addressCountry" name="addressCountry" className={styles.inputField} />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="registrationCompletedAt">Registration Completed At:</label>
                <input type="date" id="registrationCompletedAt" name="registrationCompletedAt" className={styles.inputField} />
              </div>
              <div className={styles.buttonDiv}>
              <button type="submit" className={styles.kycButton}>Submit</button>
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
