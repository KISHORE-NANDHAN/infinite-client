import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faPlusSquare, faUserAlt, faBars, faBell } from '@fortawesome/free-solid-svg-icons';
import { DarkModeContext } from '../context/DarkModeContext'; // Import the context

function Navbar() {
  const [showMore, setShowMore] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext); 

  const toggleShowMore = () => {
    setShowMore((prev) => !prev);
  };

  return (
    <div>
      {/* Navbar for larger screens */}
      <nav className={`hidden md:flex w-64 h-full p-6 flex-col justify-between items-center fixed top-0 left-0 z-50 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
        {/* Logo */}
        <img 
          src="https://firebasestorage.googleapis.com/v0/b/infiniteconnect-19162.appspot.com/o/logo.png?alt=media&token=da585e14-f4bd-4a00-ac98-cef73b6ccf54" 
          alt="logo" 
          className="w-full h-20 mb-8"
        />

        {/* Navigation Links */}
        <ul className="space-y-8 flex-grow flex flex-col justify-center items-center">
          <li className="flex items-center justify-center space-x-3">
            <Link to="/app/home" className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faHome} className="text-xl" />
              <span className="hidden sm:block">Home</span>
            </Link>
          </li>
          <li className="flex items-center justify-center space-x-3">
            <Link to="/app/search" className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faSearch} className="text-xl" />
              <span className="hidden sm:block">Search</span>
            </Link>
          </li>
          <li className="flex items-center justify-center space-x-3">
            <Link to="/app/post" className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faPlusSquare} className="text-xl" />
              <span className="hidden sm:block">Post</span>
            </Link>
          </li>
          <li className="flex items-center justify-center space-x-3">
            <Link to="/app/notifications" className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faBell} className="text-xl" />
              <span className="hidden sm:block">Notifications</span>
            </Link>
          </li>
          <li className="flex items-center justify-center space-x-3">
            <Link to="/app/profile" className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faUserAlt} className="text-xl" />
              <span className="hidden sm:block">Profile</span>
            </Link>
          </li>
        </ul>

        {/* More Button */}
        <div className="relative mb-12">
          <button 
            className="flex items-center justify-center space-x-2 w-full"
            onClick={toggleShowMore}
          >
            <FontAwesomeIcon icon={faBars} className="text-xl" />
            <span className="hidden sm:block">More</span>
          </button>

          {showMore && (
            <ul className={`absolute left-0 bottom-full mb-2 rounded-md shadow-lg space-y-2 w-40 z-50 transition-all duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>
              <li className="hover:bg-gray-600 p-2 rounded-md">
                <Link to="/aboutus">About Us</Link>
              </li>
              <li className="hover:bg-gray-600 p-2 rounded-md">
                <Link to="/app/update-user">Update User</Link>
              </li>
              <li className="hover:bg-gray-600 p-2 rounded-md flex justify-between">
                <span>Dark Mode</span>
                <button onClick={toggleDarkMode} className="ml-2 bg-gray-900 text-white p-1 rounded-full">
                  {darkMode ? "Light" : "Dark"}
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* Logout Button */}
        <ul className="space-y-8">
          <li className="flex items-center justify-center space-x-3">
            <Link to="/logout" className="flex items-center space-x-2">
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Navbar for mobile screens */}
      <nav className={`md:hidden fixed bottom-0 w-full p-2 flex justify-around z-50 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
        <Link to="/app/home">
          <FontAwesomeIcon icon={faHome} className="text-2xl" />
        </Link>
        <Link to="/app/search">
          <FontAwesomeIcon icon={faSearch} className="text-2xl" />
        </Link>
        <Link to="/app/post">
          <FontAwesomeIcon icon={faPlusSquare} className="text-2xl" />
        </Link>
        <Link to="/app/notifications">
          <FontAwesomeIcon icon={faBell} className="text-2xl" />
        </Link>
        <Link to="/app/profile">
          <FontAwesomeIcon icon={faUserAlt} className="text-2xl" />
        </Link>
        <button onClick={toggleShowMore}>
          <FontAwesomeIcon icon={faBars} className="text-2xl" />
        </button>

        {showMore && (
          <div className={`absolute bottom-full left-0 w-full p-4 space-y-2 z-50 transition-all duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}`}>
            <ul className="space-y-2 text-center">
              <li className="hover:bg-gray-600 p-2 rounded-md">
                <Link to="/aboutus">About Us</Link>
              </li>
              <li className="hover:bg-gray-600 p-2 rounded-md">
                <Link to="/app/update-user">Update User</Link>
              </li>
              <li className="hover:bg-gray-600 p-2 rounded-md flex justify-between">
                <span>Dark Mode</span>
                <button onClick={toggleDarkMode} className="ml-2 bg-gray-900 text-white p-1 rounded-full">
                  {darkMode ? "Light" : "Dark"}
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
