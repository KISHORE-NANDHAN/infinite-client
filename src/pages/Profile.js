import React, { useState, useEffect, useContext } from 'react';
import '../index.css';
import Cropper from 'react-easy-crop';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import Card from '../components/Card'; // Import your Card component
import Cookies from 'js-cookie';

const storage = getStorage();

function Profile() {
  const { user, setUser, loading } = useContext(UserContext);
  const [editMode, setEditMode] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [updatedData, setUpdatedData] = useState({
    username: '',
    bio: '',
    profilePicture: '',
  });
  const [posts, setPosts] = useState([]); // State for posts
  const [selectedPost, setSelectedPost] = useState(null); // State for selected post
  const sessionToken = Cookies.get("session_token");

  useEffect(() => {
    if (user) {
      setUpdatedData(user);
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3500/getData/posts', {
        params: { id: user._id }, // Send the user ID to fetch posts
        headers: {
          'Authorization': `Bearer ${sessionToken}`, // Add your token if needed
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageSrc(reader.result);
    });
    reader.readAsDataURL(file);
  };

  const uploadCroppedImage = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = imageSrc;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const base64CroppedImage = canvas.toDataURL();

    const storageRef = ref(storage, `profilePictures/${user.username}`);
    await uploadString(storageRef, base64CroppedImage, 'data_url').then(async (snapshot) => {
      const downloadURL = await getDownloadURL(snapshot.ref);
      setUpdatedData({
        ...updatedData,
        profilePicture: downloadURL,
      });
      console.log('Uploaded a cropped image and got the URL:', downloadURL);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await uploadCroppedImage();

    const userId = user._id; // Get the user ID from your user object

    axios.put(`http://localhost:3500/ProfileUpdate/${userId}`, updatedData, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`, // Add your token in headers
      },
    })
    .then(response => {
      setUser(response.data);
      setEditMode(false);
      alert('Profile updated successfully');
    })
    .catch(error => {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    });
  };

  const handleChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="flex ml-0 lg:ml-72 top-0 min-h-screen p-4 lg:p-8">
      <div className="relative p-4 lg:p-8 rounded-lg w-full max-w-6xl shadow-lg">
        <div className="absolute top-4 right-4">
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          )}
        </div>
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

        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name:</label>
              <input
                type="text"
                name="username"
                value={updatedData.username}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Bio:</label>
              <textarea
                name="bio"
                value={updatedData.bio}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Profile Picture:</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {imageSrc && (
                <div className="relative h-60">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                  />
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 w-full"
              >
                Cancel Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-center">
            <p className="text-lg">This is your profile. Edit it to make changes!</p>
          </div>
        )}

        {/* Posts Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Your Posts</h2>
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

        {/* Modal for Selected Post */}
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

export default Profile;
