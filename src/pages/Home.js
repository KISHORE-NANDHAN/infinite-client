import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Home = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const cookie = Cookies.get('session_token');
  console.log(cookie);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');  // Navigate to login if user is not authenticated
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <div>Loading...</div>;  // Show loading state
  }

  return (
    <div>
      Welcome, {user?.username}! {cookie}
    </div>
  );
};

export default Home;
