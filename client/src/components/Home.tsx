"use client";

import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import axios from 'axios';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import { useState } from 'react';
const Home: React.FC = () => {
  const { isLoggedIn, user, loading } = useAuth(); // Use the custom hook
  const [photo, setPhoto] = useState(user?.photo || '');


  const handleLogout = () => {
    axios.get('http://localhost:5000/api/auth/logout', { withCredentials: true });
    window.location.reload(); // Refresh the page to update the UI
  };

  if (loading) {

    return <div className={styles.loadingSpinDiv}><div className={styles.loadingSpinner}></div></div>;
  }



  const handleRemovePhoto = async () => {
    try {
      const response = await fetch('/remove-profilePhoto', {
        method: 'POST',
      });
      if (response.ok) {
        console.log('Profile photo removed successfully');
        setPhoto('/illustations/userProfile.svg'); // Update the photo state to default
      } else {
        console.error('Error removing profile photo');
      }
    } catch (error) {
      console.error('Error removing profile photo:', error);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <img className={styles.Image} src="/illustrations/HeroSection.svg"></img>
        <div className={styles.HeroSectionContentDiv}>
          <h1>Welcome to Our Website</h1>
          {isLoggedIn ? (<p>Your one-stop solution for all your needs!</p>) : (<p>Please Login or register for Start with your Profile</p>)}

          <div className={styles.heroButtons}>
            {!isLoggedIn ? (
              <>
                <Link href='/register'
                  className={styles.button}>Register
                </Link>
                <Link href='/login'
                  className={styles.button}>Login
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
      </div>

      {/* Features Section - Display form with fields from schema */}
      {isLoggedIn && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.userCard}>
              <div className={styles.userProfile}>
                <div className={styles.profilePhoto}>
                  <img
                    src={photo ? `${photo}` : '/illustrations/userProfile.svg'}
                    alt="Profile Photo"
                    className={styles.profilePicture}
                  />
                </div>
                <h6 className={styles.userName}>
                  {user?.firstname} {user?.lastname}
                </h6>
                {photo && (
                  <button onClick={handleRemovePhoto} className={styles.removePhotoBtn}>
                    Remove Photo
                  </button>
                )}
              </div>
              <div className={styles.userDetails}>
                <h6 className={styles.infoTitle}>User Details</h6>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Name:</span>
                    <span className={styles.detailValue}>{user?.name || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Email:</span>
                    <span className={styles.detailValue}>{user?.email || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Phone:</span>
                    <span className={styles.detailValue}>{user?.phone || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Date of Birth:</span>
                    <span className={styles.detailValue}>{user?.dob || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Aadhaar Number:</span>
                    <span className={styles.detailValue}>{user?.aadhaarNumber || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>PAN Number:</span>
                    <span className={styles.detailValue}>{user?.panNumber || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Bank Account Number:</span>
                    <span className={styles.detailValue}>{user?.bankAccountNumber || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>GST Number:</span>
                    <span className={styles.detailValue}>{user?.gstNumber || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Pincode:</span>
                    <span className={styles.detailValue}>{user?.addressPincode || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Place:</span>
                    <span className={styles.detailValue}>{user?.addressPlace || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>District:</span>
                    <span className={styles.detailValue}>{user?.addressDistrict || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>State:</span>
                    <span className={styles.detailValue}>{user?.addressState || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Country:</span>
                    <span className={styles.detailValue}>{user?.addressCountry || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Registration Completed At:</span>
                    <span className={styles.detailValue}>{user?.registrationCompletedAt || 'N/A'}</span>
                  </div>
                </div>
                <div className={styles.buttonDiv}>
                  <a href="/edit-profile" className={styles.editButton}>Edit Profile</a>
                </div>

              </div>
            </div>
          </div>
        </section>

      )}
    </div>
  );
};

export default Home;
