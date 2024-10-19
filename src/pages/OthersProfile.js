import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import OtherCard from '../components/OtherCard'; // Updated import for OtherCard
import { UserContext } from '../context/UserContext'; // Import UserContext to get logged-in user data
import Cookies from 'js-cookie';
function OthersProfile() {
  const { id } = useParams(); 
  const location = useLocation();
  const { currentUser } = useContext(UserContext); // Get logged-in user context
  const [user, setUser] = useState(location.state?.user || null); // Get user data from state or null
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false); // Track follow status
  const [loading, setLoading] = useState(true); // Loading state for follow action

  const currentUserId = Cookies.get('session_token');
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3500/api/users/${id}`);
        console.log(response.data);
        setUser(response.data);

        if (currentUser.following.includes(id)) {
          setIsFollowing(true);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (!user) {
      fetchUserData();
    } else {
      setLoading(false); // Already have user data
    }
  }, [id, user, currentUser]);

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

  // Handle follow/unfollow action
  const handleFollowToggle = async () => {
    try {
      setLoading(true);
      if (isFollowing) {
        // Unfollow action
        await axios.post(`http://localhost:3500/api/users/${currentUserId}/follow`, {
          followerId: user._id,
        });
      } else {
        // Follow action
        await axios.post(`http://localhost:3500/api/users/${currentUserId}/follow`, {
          followerId: user._id,
        });
      }
      setIsFollowing(!isFollowing); // Toggle the follow state
      setLoading(false);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      setLoading(false);
    }
  };

  if (!user || loading) {
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

            {/* Follow/Unfollow Button */}
            {currentUserId !== user._id && (
              <button
                onClick={handleFollowToggle}
                className={`mt-4 px-4 py-2 rounded-md text-white ${isFollowing ? 'bg-red-500' : 'bg-blue-500'}`}
                disabled={loading}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Posts</h3>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <OtherCard key={post._id} post={post} user={user} /> // Pass user data as prop
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
