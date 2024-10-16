import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the GetAllPostsContext
export const GetAllPostsContext = createContext();

export const GetAllPostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 30);

        const todayString = today.toISOString().split('T')[0];
        const lastWeekString = lastWeek.toISOString().split('T')[0];

        const response = await axios.get(`http://localhost:3500/api/getAllPosts?startDate=${lastWeekString}&endDate=${todayString}`);

        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const logout = () => {
    setPosts([]); // Clear all posts on logout
    setError(null); // Clear any errors
  };

  return (
    <GetAllPostsContext.Provider value={{ posts, loading, error, logout }}>
      {children}
    </GetAllPostsContext.Provider>
  );
};
