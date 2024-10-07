import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { UserContext } from '../context/UserContext'; // Adjust the import based on your file structure
import { PostContext } from '../context/PostContext'; // Adjust the import based on your file structure
import { GetAllPostsContext } from '../context/GetAllPostsContext'; // Adjust the import based on your file structure

const Logout = () => {
  const navigate = useNavigate();
  const { logout: userLogout } = useContext(UserContext);
  const { logout: postLogout } = useContext(PostContext);
  const { logout: getAllPostsLogout } = useContext(GetAllPostsContext);

  useEffect(() => {
    // Remove the session cookie
    Cookies.remove('session_token');

    // Clear any user-related data from localStorage
    localStorage.removeItem('userDetails');

    // Call the logout functions to clear context states
    userLogout();
    postLogout();
    getAllPostsLogout();

    // Redirect to the login page after logout
    navigate('/');
  }, [navigate, userLogout, postLogout, getAllPostsLogout]);

  return (
    <div>
      Logging out...
    </div>
  );
};

export default Logout;
