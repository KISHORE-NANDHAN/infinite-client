import React, { useState, useEffect, useContext } from 'react';
import '../index.css';
import Cropper from 'react-easy-crop';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import axios from 'axios';
import { UserContext } from '../context/UserContext';

// Firebase storage setup
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

  useEffect(() => {
    if (user) {
      setUpdatedData(user);
    }
  }, [user]);

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

    axios.put('http://localhost:3500/user-profile', updatedData)
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="flex ml-72 top-0 min-h-screen">
      <div className="relative p-8 rounded-lg w-full max-w-6xl shadow-lg">
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
        <div className="flex items-center mb-8">
          <img
            src={user.profilePicture || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-40 h-40 rounded-full mr-8"
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
      </div>
    </div>
  );
}

export default Profile;
