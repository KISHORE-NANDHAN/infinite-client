import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

// Create the context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const sessionToken = Cookies.get('session_token');

    if (sessionToken) {
      // Fetch user data with the token
      axios.get('http://localhost:3500/getData/user', { params: { id: sessionToken } })
        .then(response => {
          console.log(response.data); // Debugging: Check response
          setUser(response.data); 
          setCurrentUser(response.data);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setUser(null);  
        })
        .finally(() => {
          setLoading(false); // Loading finished
        });
    } else {
      setLoading(false); // No token, loading finished
    }
  }, []);

  // Function to logout
  const logout = () => {
    Cookies.remove('session_token'); // Remove the cookie
    setUser(null); // Clear user data
  };

  return (
    <UserContext.Provider value={{ user, setUser,currentUser,setCurrentUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};
