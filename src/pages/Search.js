import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../components/Toast'; // Adjust the path as necessary

function Search() {
  const [searchValue, setSearchValue] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const navigate = useNavigate();

  // Fetch users for the datalist based on search value
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get('http://localhost:3500/getUsers', {
          params: { q: searchValue } // Send the search query as a parameter
        });
        setUsers(response.data); // Set the fetched users
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (searchValue.length >= 4) {
      fetchUsers();
    } else {
      setUsers([]); // Reset users if searchValue is less than 4 characters
    }
  }, [searchValue]); // Run effect when searchValue changes

  const handleSearchInput = (e) => {
    setSearchValue(e.target.value);

    // Filter users based on search input
    if (e.target.value.length >= 4) {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  };

  const handleUserSelect = (user) => {
    // Navigate to the user's profile directly when a user is selected from the filtered list
    navigate(`/app/OthersProfile`, { state: { user } });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Check if there's an exact match in the filtered users
    const selectedUser = filteredUsers.find((user) => user.username.toLowerCase() === searchValue.toLowerCase());
    if (selectedUser) {
      navigate(`/app/OthersProfile`, { state: { user: selectedUser } });
    } else {
      setToastMessage('User not found!');
      setToastType('error'); // Set toast type to error
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-semibold mb-4">Search User</h1>
      <form className="flex items-center max-w-lg mx-auto" onSubmit={handleSearch}>
        <label htmlFor="voice-search" className="sr-only">Search</label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.15 5.6h.01m3.337 1.913h.01m-6.979 0h.01M5.541 11h.01M15 15h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 2.043 11.89 9.1 9.1 0 0 0 7.2 19.1a8.62 8.62 0 0 0 3.769.9A2.013 2.013 0 0 0 13 18v-.857A2.034 2.034 0 0 1 15 15Z" />
            </svg>
          </div>
          <input
            type="text"
            id="voice-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for users..."
            value={searchValue}
            onChange={handleSearchInput}
            required
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg className="w-4 h-4 me-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>Search
        </button>
      </form>

      {loading && <div className="mt-4">Loading...</div>} {/* Loading indicator */}

      {filteredUsers.length > 0 && (
        <ul className="w-full max-w-md mt-4 border border-gray-300 rounded">
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              onClick={() => handleUserSelect(user)} // Call the new function to handle user selection
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center"
            >
              <img src={user.profilePicture || 'default-pfp-url'} alt={user.username} className="w-10 h-10 rounded-full mr-2" /> {/* User Profile Picture */}
              {user.username}
            </li>
          ))}
        </ul>
      )}

      <Toast message={toastMessage} type={toastType} duration={3000} /> {/* Toast notification */}
    </div>
  );
}

export default Search;
