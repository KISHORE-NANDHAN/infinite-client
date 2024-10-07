import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Create the PostContext
export const PostContext = createContext();

// Create the PostProvider component
export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sessionToken = Cookies.get('session_token');

  useEffect(() => {
    if (!sessionToken) {
      setError('No session token found. Please log in.');
      setLoading(false);
      return;
    }

    axios.get('http://localhost:3500/getData/posts', { params: { id: sessionToken } })
      .then(response => {
        console.log('Fetched posts:', response.data);
        setPosts(response.data);
      })
      .catch(err => {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sessionToken]);

  const addPost = async (newPost) => {
    try {
      const response = await axios.post('http://localhost:3500/createPost', newPost, {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      setPosts(prevPosts => [...prevPosts, response.data]);
    } catch (err) {
      console.error('Error adding post:', err);
      setError('Failed to add post');
    }
  };

  const logout = () => {
    Cookies.remove('session_token'); // Clear the cookie
    setPosts([]); // Clear the posts on logout
    setError(null); // Clear any errors
  };

  return (
    <PostContext.Provider value={{ posts, loading, error, setPosts, addPost, logout }}>
      {children}
    </PostContext.Provider>
  );
};
