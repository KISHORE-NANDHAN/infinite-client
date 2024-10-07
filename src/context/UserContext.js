import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

// Create the context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Store user data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const sessionToken = Cookies.get('session_token');

    if (sessionToken) {
      // Fetch user data with the token
      axios.get('http://localhost:3500/getData/user', { params: { id: sessionToken } })
        .then(response => {
          console.log(response.data);
          setUser(response.data); 
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setUser(null);  
        })
        .finally(() => {
          setLoading(false); 
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Function to logout
  const logout = () => {
    Cookies.remove('session_token'); // Remove the cookie
    setUser(null); // Clear user data
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};
