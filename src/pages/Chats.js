import React, { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { UserContext } from '../context/UserContext'; // Adjust the path as necessary
import axios from 'axios';

// Initialize Socket.IO connection
const socket = io('http://localhost:3000');

function Chats() {
  const { user } = useContext(UserContext); // Assuming UserContext provides followers, following, and user info
  const { followers, following } = user;

  const [activeChat, setActiveChat] = useState(null); // Current chat with a user
  const [message, setMessage] = useState(''); // Message input
  const [chat, setChat] = useState([]); // All chat messages
  const [users, setUsers] = useState([]); // Fetched users to chat with

  // Fetch chat messages from the server when the active chat changes
  useEffect(() => {
    if (activeChat) {
      socket.emit('join room', { roomId: activeChat._id, username: user.username });
      socket.on('receive message', ({ name, message }) => {
        setChat((prevChat) => [...prevChat, { name, message }]);
      });
    }

    return () => {
      if (activeChat) {
        socket.emit('leave room', activeChat._id);
        socket.off('receive message');
      }
    };
  }, [activeChat, user.username]);

  // Fetch followers and following users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.post('http://localhost:3500/fetchUsers', {
          ids: [...followers, ...following],
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [followers, following]);

  // Handle user click to select active chat
  const handleUserClick = (user) => {
    setActiveChat(user);
    setChat([]); // Reset chat when changing users
  };

  // Send message to the server
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && activeChat) {
      socket.emit('chat message', { roomId: activeChat._id, name: user.username, message });
      setChat((prevChat) => [...prevChat, { name: user.username, message }]);
      setMessage(''); // Clear input after sending
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="w-3/4 lg:w-2/3 xl:w-1/2 flex shadow-lg border rounded-lg">
        {/* Chat Window */}
        <div className="w-3/4 p-4">
          <h2 className="text-xl font-semibold mb-2">Chat Window</h2>
          {activeChat ? (
            <div>
              <h3 className="text-lg mb-4">Chatting with: {activeChat.username}</h3>
              <div className="messages h-64 overflow-y-auto border p-2 mb-4">
                {chat.map((msg, index) => (
                  <div key={index} className="mb-2">
                    <strong>{msg.name}:</strong> {msg.message}
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow p-2 border rounded mr-2"
                />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded">
                  Send
                </button>
              </form>
            </div>
          ) : (
            <p>Select a user to start chatting.</p>
          )}
        </div>

        {/* Followers and Following List */}
        <div className="w-1/4 border-l border-gray-300 p-4">
          <h2 className="text-xl font-semibold">Followers</h2>
          <ul className="mb-4">
            {users.filter(user => followers.includes(user._id)).map((user) => (
              <li
                key={user._id}
                onClick={() => handleUserClick(user)}
                className="cursor-pointer hover:bg-gray-200 p-2 flex items-center"
              >
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="inline w-8 h-8 rounded-full mr-2"
                />
                {user.username}
              </li>
            ))}
          </ul>
          <h2 className="text-xl font-semibold">Following</h2>
          <ul>
            {users.filter(user => following.includes(user._id)).map((user) => (
              <li
                key={user._id}
                onClick={() => handleUserClick(user)}
                className="cursor-pointer hover:bg-gray-200 p-2 flex items-center"
              >
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="inline w-8 h-8 rounded-full mr-2"
                />
                {user.username}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Chats;
