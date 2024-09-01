"use client";

import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth'; // Import the useAuth hook
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import axios from 'axios';


const Home: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean);
  const [loading, setLoading] = useState(Boolean);
  console.log(isLoggedIn)
  // Use the useAuth hook to check the login status
  useAuth(setIsLoggedIn, setLoading);

  if (loading) {
    
    return <div>Loading...</div>;
  }

  const handleLogout =  () => {
    axios.get('http://localhost:5000/api/auth/logout',{withCredentials:true,});
    setIsLoggedIn(false);
  };


  return (
    <div className={styles.container}>
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

      {/* Features Section - Only show if the user is logged in */}
      {isLoggedIn && (
        <section className={styles.features}>
          <div className={styles.featureItem}>
            <h2>Feature One</h2>
            <p>Describe your first key feature or service here.</p>
          </div>
          <div className={styles.featureItem}>
            <h2>Feature Two</h2>
            <p>Explain the second feature that sets your website apart.</p>
          </div>
          <div className={styles.featureItem}>
            <h2>Feature Three</h2>
            <p>Highlight another strong point that you offer.</p>
          </div>
        </section>
      )}
    </div>
  );
};
export default Home;
