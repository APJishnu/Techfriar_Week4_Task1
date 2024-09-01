"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Logout: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await axios.post('https://localhost:5000/api/auth/logout'); // Call the backend logout route
        router.push('/login'); // Redirect to login page after logout
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };

    logoutUser();
  }, [router]);

  return <div>Logging out...</div>;
};

export default Logout;
