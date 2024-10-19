import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons'; 
import Cookies from 'js-cookie';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = Cookies.get('session_token');
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:3500/api/notifications/${userId}`);  // Fetch notifications by userId
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`http://localhost:3500/api/notifications/mark-read/${notificationId}`);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:3500/api/notifications/${notificationId}`);
      setNotifications((prev) => prev.filter((notification) => notification._id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading notifications...</div>;
  }

  if (!notifications.length) {
    return <div className="text-center mt-8">No notifications available</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`flex items-center p-4 shadow-md rounded-lg transition duration-300 ease-in-out 
              ${notification.isRead ? 'bg-gray-100' : 'bg-white'} 
              hover:opacity-90`}
          >
            <div className="w-12 h-12">
              <img
                className="rounded-full object-cover w-full h-full"
                src={notification.actionUser.profilePicture || '/default-avatar.png'}
                alt={`${notification.actionUser.username}'s profile`}
              />
            </div>

            <div className="ml-4 flex-1">
              <p className="text-sm font-medium">
                <span className="text-indigo-600">{notification.actionUser.username}</span>
                {notification.type === 'like' && ' liked your post.'}
                {notification.type === 'comment' && ' commented on your post.'}
                {notification.type === 'follow' && ' started following you.'}
              </p>

              {notification.post && (
                <div className="mt-2">
                  <img
                    src={notification.post.image || '/default-post-image.jpg'}
                    alt="Post thumbnail"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">{new Date(notification.createdAt).toLocaleString()}</p>
            </div>

            {/* Mark as Read button */}
            {!notification.isRead && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering parent click event
                  markAsRead(notification._id);
                }}
                className="ml-4 text-green-500 hover:text-green-700 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faCheck} size="lg" />
              </button>
            )}

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering parent click event
                deleteNotification(notification._id);
              }}
              className="ml-4 text-red-500 hover:text-red-700 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faTrash} size="lg" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
