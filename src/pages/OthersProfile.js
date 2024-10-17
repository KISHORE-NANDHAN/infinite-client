import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import OtherCard from '../components/OtherCard'; // Updated import for OtherCard

function OthersProfile() {
  const { id } = useParams(); // Get the user ID from the URL
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null); // Get user data from state or null
  const [posts, setPosts] = useState([]);
  // Fetch user data if it is not passed through location state
  useEffect(() => {
    if (!user) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:3500/getUsers/${id}`);
          console.log(response.data);
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, [id, user]);

  // Fetch posts of the user
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const userPosts = await axios.get(`http://localhost:3500/getUsers/posts/${id}`);
        setPosts(userPosts.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [id, user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex ml-0 lg:ml-72 top-0 min-h-screen p-4 lg:p-8">
      <div className="relative p-4 lg:p-8 rounded-lg w-full max-w-6xl shadow-lg">
        <div className="flex flex-col lg:flex-row items-center mb-8">
          <img
            src={user.profilePicture || 'https://via.placeholder.com/150'}
            alt={`${user.username}'s profile`}
            className="w-24 h-24 rounded-full mb-4 lg:mb-0 lg:mr-8"
          />
          <div>
            <h2 className="text-2xl font-semibold">{user.username}</h2>
            <h3>{user.bio}</h3>
            <p>Followers: {user.followers.length}</p>
            <p>Following: {user.following.length}</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Posts</h3>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <OtherCard
                key={post._id}
                post={post}
                user={user} // Pass user data as prop
              />
            ))}
          </div>
        ) : (
          <div>No posts available</div>
        )}
      </div>
    </div>
  );
}

export default OthersProfile;
