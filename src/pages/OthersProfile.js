import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card'; // Ensure you import the Card component if used

function OthersProfile() {
  const { id } = useParams(); // Get the user ID from the URL
  const location = useLocation();
  const [user, setUser] = useState(location.state.user); // Get user data from state
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  console.log(user)

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const userPosts = await axios.get(`http://localhost:3500/getUsers/posts/${user._id}`);
        setPosts(userPosts.data);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    // Fetch posts only if user data is available
    if (user) {
      fetchUserPosts();
    }
  }, [id, user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  return (
    <div className="flex ml-0 lg:ml-72 top-0 min-h-screen p-4 lg:p-8">
      <div className="relative p-4 lg:p-8 rounded-lg w-full max-w-6xl shadow-lg">
        <div className="flex flex-col lg:flex-row items-center mb-8">
          <img
            src={user.profilePicture || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-40 h-40 rounded-full mr-0 lg:mr-8 mb-4 lg:mb-0"
          />
          <div>
            <h1 className="text-4xl font-semibold">{user.username}</h1>
            <p className="text-gray-600 text-lg mt-2">{user.bio}</p>
            <div className="flex mt-2">
              <div className="mr-4">
                <p><strong>Followers:</strong> {user.followers.length}</p>
              </div>
              <div>
                <p><strong>Following:</strong> {user.following.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Posts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {posts.map((post) => (
              <img
                key={post._id}
                src={post.image}
                alt={post.caption}
                className="w-full h-64 object-cover rounded-lg cursor-pointer"
                onClick={() => handlePostClick(post)}
              />
            ))}
          </div>
        </div>

        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg max-w-lg h-auto w-full">
              <Card post={selectedPost} />
              <button
                onClick={handleCloseModal}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OthersProfile;
