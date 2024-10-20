import React, { useState, useEffect, useRef, useContext } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import Toast from '../components/Toast'
import { UserContext } from "../context/UserContext";

const PostCard = ({ post }) => {
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments);
  const [userDetails, setUserDetails] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const popupRef = useRef();
  const dropdownRef = useRef();
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  const currentUserId = Cookies.get('session_token');
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (post.user) {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3500/api/users/${post.user}`);
          setUserDetails(response.data);
          setIsFollowing(response.data.followers.includes(currentUserId));
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      };
      fetchUserDetails();
    }
  }, [post.user, currentUserId]);

  // Toast visibility effect
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Close popup when clicked outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isCommentPopupOpen && popupRef.current && !popupRef.current.contains(e.target)) {
        setIsCommentPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isCommentPopupOpen]);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:3500/api/posts/${post._id}/like`,{ currentUserId} );
      setIsLiked(!isLiked); 
      setLikeCount(response.data.likes.length); 
      sendLikeNotification()
        .then(() => {
          console.log('Notification sent successfully');
        })
        .catch((error) => {
          console.error('Failed to send notification:', error);
        });
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`http://localhost:3500/api/posts/${post._id}/comment`, {
            pfp: user.profilePicture || process.env.REACT_APP_DEFAULT_PFP,
            userId: currentUserId,
            username: user.username || 'Infinite_User',
            text: comment
        });
        setComments(response.data.comments);// Update the comments list
        setComment('');  // Clear the comment input field
        sendCommentNotification()
        .then(() => {
          console.log('Notification sent successfully');
        })
        .catch((error) => {
          console.error('Failed to send notification:', error);
        });
    } catch (error) {
        console.error('Failed to comment on post:', error);
    }
};
const handleEditComment = (commentId, currentText) => {
  setEditCommentId(commentId); // Set the comment to be edited
  setEditCommentText(currentText); // Prefill the current comment text
};

const handleEditCommentSubmit = async (commentId) => {
  try {
    const response = await axios.put(`http://localhost:3500/api/posts/${post._id}/comment/${commentId}`, {
      text: editCommentText,
      userId: currentUserId,
    });
    setComments(response.data.comments); // Update comments with the edited version
    setEditCommentId(null); // Reset the editing state
  } catch (error) {
    console.error('Failed to edit comment:', error);
  }
};

const handleDeleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`http://localhost:3500/api/posts/${post._id}/comment/${commentId}`, {
      data: { userId: currentUserId },
    });
    setComments(response.data.comments); // Update comments after deletion
  } catch (error) {
    console.error('Failed to delete comment:', error);
  }
};
const sendLikeNotification = () => {
  axios
    .post(`http://localhost:3500/api/notifications`, {
      type: 'like',
      actionUserId: currentUserId,  
      userId: post.user, 
      postId: post._id  
    })
    .then(() => {
      console.log('Like notification sent successfully');
    })
    .catch((error) => {
      console.error('Failed to send like notification:', error);
    });
};
// Function to send comment notification
const sendCommentNotification = () => {
  axios
    .post(`http://localhost:3500/api/notifications`, {
      type: 'comment',
      actionUserId: currentUserId,  // The user who commented
      userId: post.user,  // The user who owns the post
      postId: post._id  // The post that was commented on, passing the post ID here
    })
    .then(() => {
      console.log('Comment notification sent successfully');
    })
    .catch((error) => {
      console.error('Failed to send comment notification:', error);
    });
};

const sendFollowNotification = () => {
  return new Promise((resolve, reject) => {
    axios
      .post(`http://localhost:3500/api/notifications`, {
        type: 'follow',
        actionUserId: currentUserId, 
        userId: post.user, 
        postId: null 
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};



const toggleFollow = async () => {
  try {
    const response = await axios.post(`http://localhost:3500/api/users/${post.user}/follow`, { currentUserId });

    if (response.data.message === 'User followed successfully') {
      setToastMessage(`You have successfully followed ${userDetails.username}`);
      setToastType('success');

      sendFollowNotification()
        .then(() => {
          console.log('Notification sent successfully');
        })
        .catch((error) => {
          console.error('Failed to send notification:', error);
        });
    } else if (response.data.message === 'User unfollowed successfully') {
      setToastMessage(`You have successfully unfollowed ${userDetails.username}`);
      setToastType('success');
    } else if (response.data.message === 'You cannot follow yourself') {
      setToastMessage("Can't follow or unfollow yourself");
      setToastType('error');
    }

    setIsFollowing(!isFollowing); 
  } catch (error) {
    console.error("Failed to toggle follow:", error);
  }
};


  return (
    <div className="max-w-[531px] overflow-hidden mx-auto p-4 bg-white rounded-lg shadow-md relative">
      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} type={toastType} />}

      {/* Header Section */}
      <div className="header flex items-center justify-between pb-2 border-b border-gray-300">
        <div className="flex items-center">
          <img
            src={userDetails?.profilePicture || '/default-profile.png'}
            alt="Profile"
            className="profile-pic w-8 h-8 rounded-full"
          />
          <div className="ml-2">
            <a href={`/app/OthersProfile/${post.user}`}>
            <div className="username font-bold">{userDetails?.username || 'Loading...'}</div></a>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Follow/Unfollow Button */}
          <button
            className={`follow-btn text-sm px-3 py-1 rounded ${isFollowing ? 'bg-gray-200' : 'bg-blue-500 text-white'}`}
            onClick={toggleFollow}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>

          {/* Dropdown with Download Option */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-gray-600 text-xl">⋮</button>
            {isDropdownOpen && (
              <div className="dropdown absolute right-0 mt-2 w-24 bg-white shadow-lg rounded-lg">
                <a href={post.image} download={`${userDetails?.name || 'post'}-image.jpg`} className="block w-full px-4 py-2 text-sm hover:bg-gray-200">
                  Download
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post Image */}
      <img
        src={post.image}
        alt="Post"
        className="post-image w-full h-fit object-cover rounded-lg my-4"
      />

      {/* Like & Comment Section */}
      <div className="post-actions flex items-center space-x-4 py-2">
        <div className="action-item flex items-center">
          <span
            className={`action-icon cursor-pointer text-xl ${isLiked ? "text-red-500" : "text-gray-800"}`}
            onClick={handleLike}
          >
            {isLiked ? "❤️" : "♡"}
          </span>
          <span className="like-count text-sm text-gray-500 ml-1">{likeCount}</span>
        </div>
        <button onClick={() => setIsCommentPopupOpen(true)} className="text-gray-600">
          💬 {comments.length}
        </button>
      </div>

      {/* Caption & Time */}
      <div className="post-info text-sm py-2">
        <div className="caption font-semibold">{post.caption}</div>
        <div className="time text-xs text-gray-400 mt-1">
          {new Date(post.time).toLocaleString()}
        </div>
      </div>

      {/* Comment Popup */}
      {isCommentPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div ref={popupRef} className="bg-white rounded-lg w-11/12 max-w-4xl p-6 relative flex">
            {/* Post Section */}
            <div className="w-1/2">
              <div className="flex items-center">
                <img
                  src={userDetails.profilePicture || '/default-profile.png'}
                  alt="Profile"
                  className="w-8 h-8 bg-gray-300 rounded-full"
                />
                
                <div className="ml-2">
                  <div className="username font-bold">{userDetails.username || 'Anonymous'}</div>
                </div>
              </div>
              <img
                src={post.image}
                alt="Post"
                className="w-full  object-contain rounded-lg mb-4"
              />
              <div className="text-sm">
                <h2 className="font-semibold mb-2">{userDetails?.name}</h2>
                <p>{post.caption}</p>
                <p className="text-gray-400 text-xs">{new Date(post.time).toLocaleString()}</p>
                <p className="font-semibold">❤️ {likeCount}</p> {/* Likes Count */}
              </div>
            </div>

            {/* Comment Section */}
            <div className="w-1/2 pl-6">
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        <div className="comments max-h-60 overflow-y-auto mb-4">
          {comments.map((comment, index) => (
            <div key={index} className="comment-item py-2 flex items-start">
            <img
              src={comment.pfp || '/default-profile.png'}
              alt="Commenter"
              className="w-6 h-6 rounded-full mr-2"
            />
            <div className="comment-content">
              <div className="flex items-center">
                <span className="font-semibold mr-2">{comment.username}</span>
                <span className="text-xs text-gray-400">{new Date(comment.time).toLocaleString()}</span>
              </div>
              {editCommentId === comment._id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="w-full px-2 py-1 border rounded"
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                  />
                  <button
                    onClick={() => handleEditCommentSubmit(comment._id)}
                    className="text-blue-500 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditCommentId(null)}
                    className="text-gray-500 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-sm">{comment.text}</p>
              )}
              {currentUserId === comment.userId && (
                <div className="flex items-center space-x-2 mt-1 text-xs">
                  <button
                    onClick={() => handleEditComment(comment._id, comment.text)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          className="w-full px-3 py-1 border rounded-lg"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded-lg"
        >
          Post
        </button>
      </form>
    </div>
  </div>
</div>
)}
</div>
);
};

export default PostCard;