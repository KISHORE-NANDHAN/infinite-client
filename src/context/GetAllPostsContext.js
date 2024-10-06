import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the GetAllPostsContext
export const GetAllPostsContext = createContext();

export const GetAllPostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Get the current date and the date of the last week
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        // Format the dates to ISO strings
        const todayString = today.toISOString().split('T')[0];
        const lastWeekString = lastWeek.toISOString().split('T')[0];

        // Fetch posts from today to last week
        const response = await axios.get(`http://localhost:3500/api/getAllPosts?startDate=${lastWeekString}&endDate=${todayString}`);

        // Set the posts in the state
        setPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <GetAllPostsContext.Provider value={{ posts, loading }}>
      {children}
    </GetAllPostsContext.Provider>
  );
};
