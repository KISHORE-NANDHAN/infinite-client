import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaSnowflake } from 'react-icons/fa';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showFreezeModal, setShowFreezeModal] = useState(false); // Modal state
  const [freezeUserId, setFreezeUserId] = useState(null); // Store userId for freezing
  const [freezeReason, setFreezeReason] = useState(''); // Freeze reason
  const [freezeDuration, setFreezeDuration] = useState(''); // Freeze duration

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3500/api/AdminPowers/getAllUsers');
      setUsers(response.data);
      setFilteredUsers(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3500/api/AdminPowers/delete/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      setFilteredUsers(filteredUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue)
    );
    setFilteredUsers(filtered);
  };

  // Open freeze modal
  const openFreezeModal = (userId) => {
    setFreezeUserId(userId);
    setShowFreezeModal(true);
  };

  // Handle freezing the user account
  const freezeUser = async () => {
    try {
      const freezeData = {
        userId: freezeUserId,
        freezeReason,
        duration: parseInt(freezeDuration, 10)
      };
      await axios.post('http://localhost:3500/api/AdminPowers/freezeUser', freezeData);
      setShowFreezeModal(false); // Close modal
      alert('User has been frozen successfully');
    } catch (error) {
      console.error('Failed to freeze user', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="Search by username or email"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div>
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="flex justify-between items-center p-4 mb-2 bg-gray-100 rounded-md shadow-md"
          >
            <div className='flex items-start'>
              <img src={user.profilePicture} alt='profilepic' className='rounded-full w-10 h-10'/>
              <a href={`/AdOthersProfile/${user._id}`}>
                <p className="p-3 font-semibold">Username: {user.username}</p>
              </a>
            </div>
            <div className="flex space-x-4">
              <button
                className="text-red-500 hover:text-red-700 flex items-center"
                onClick={() => deleteUser(user._id)}
              >
                <FaTrash className="mr-2" /> Delete
              </button>
              <button
                className="text-blue-500 hover:text-blue-700 flex items-center"
                onClick={() => openFreezeModal(user._id)}
              >
                <FaSnowflake className="mr-2" /> Freeze
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <p className="text-gray-500">No users found</p>
      )}

      {/* Freeze Modal */}
      {showFreezeModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl mb-4">Freeze User Account</h2>
            <div className="mb-4">
              <label>Freeze Reason</label>
              <select
                className="w-full p-2 border rounded-md"
                value={freezeReason}
                onChange={(e) => setFreezeReason(e.target.value)}
              >
                <option value="">Select Reason</option>
                <option value="policy_violation">Policy Violation</option>
                <option value="suspicious_activity">Suspicious Activity</option>
                <option value="user_request">User Request</option>
                <option value="inactivity">Inactivity</option>
                <option value="legal_compliance">Legal Compliance</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="mb-4">
              <label>Freeze Duration (hours)</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={freezeDuration}
                onChange={(e) => setFreezeDuration(e.target.value)}
                placeholder="Enter duration in hours"
              />
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={freezeUser}>
              Confirm Freeze
            </button>
            <button
              className="bg-gray-300 text-black px-4 py-2 rounded-md ml-4"
              onClick={() => setShowFreezeModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
