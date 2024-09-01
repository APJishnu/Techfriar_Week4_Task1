"use client";

import { useEffect } from 'react';
import axios from 'axios';

const useAuth = (
  setIsLoggedIn: (value: boolean) => void,
  setLoading: (value: boolean) => void
) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/check-loggin'); // Use HTTP
        setIsLoggedIn(response.data.loggedIn);
        setLoading(response.data.loading);
      } catch (error) {
        console.error('Error checking authentication status', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setIsLoggedIn, setLoading]);
};

export default useAuth;
