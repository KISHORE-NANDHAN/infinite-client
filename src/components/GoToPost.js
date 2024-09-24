import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faCalendarAlt, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../context/UserContext';

const GoToPost = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleNavigation = () => {
    navigate('/app/post'); // Navigate to the desired path
  };

  const username = user?.username || process.env.REACT_APP_DEFAULT_USER; // Fallback to 'Guest' if username is not available
  const profilePicture = user?.ProfilePicture || process.env.REACT_DEFAULT_PFP; // Fallback to default profile picture

  return (
    <div className="w-3/5 mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <h1>{username}</h1>
        <img 
          src={profilePicture} 
          alt="Profile" 
          className="w-10 h-10 mr-3 rounded-full" 
        />
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none cursor-pointer"
          placeholder="Start a post"
          onClick={handleNavigation}
        />
      </div>
      <div className="flex justify-around">
        <div
          className="flex flex-col items-center cursor-pointer transform transition-transform duration-200 hover:scale-105"
          onClick={handleNavigation}
        >
          <FontAwesomeIcon icon={faCamera} className="text-blue-500 w-6 h-6 mb-1" />
          <span className="text-sm text-gray-600">Media</span>
        </div>
        <div
          className="flex flex-col items-center cursor-pointer transform transition-transform duration-200 hover:scale-105"
          onClick={handleNavigation}
        >
          <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500 w-6 h-6 mb-1" />
          <span className="text-sm text-gray-600">Event</span>
        </div>
        <div
          className="flex flex-col items-center cursor-pointer transform transition-transform duration-200 hover:scale-105"
          onClick={handleNavigation}
        >
          <FontAwesomeIcon icon={faNewspaper} className="text-red-500 w-6 h-6 mb-1" />
          <span className="text-sm text-gray-600">Write article</span>
        </div>
      </div>
    </div>
  );
};

export default GoToPost;
