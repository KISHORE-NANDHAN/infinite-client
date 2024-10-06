import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';

const PostCard = ({ post }) => {
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments);
  const [userDetails, setUserDetails] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isCommentPopupOpen, setIsCommentPopupOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const popupRef = useRef();
  const dropdownRef = useRef();

  // Fetch user details based on post.user (userId)
  useEffect(() => {
    if (post.user) {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:3500/users/${post.user}`);
          setUserDetails(response.data);
          setIsFollowing(response.data.isFollowing); // Example field for follow status
        } catch (error) {
          console.error("Failed to fetch user details:", error);
        }
      };
      fetchUserDetails();
    }
  }, [post.user]);

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
      const response = await axios.post(`http://localhost:3500/api/posts/${post._id}/like`, { userId: 'some-user-id' });
      setIsLiked(!isLiked);
      setLikeCount(response.data.likes.length);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3500/api/posts/${post._id}/comment`, {
        userId: 'some-user-id',
        username: userDetails?.name || 'User',
        text: comment
      });
      setComments(response.data.comments);
      setComment('');  // Clear the comment input field
    } catch (error) {
      console.error('Failed to comment on post:', error);
    }
  };

  const toggleFollow = async () => {
    try {
      const response = await axios.post(`http://localhost:3500/api/users/${post.user}/follow`, { userId: 'some-user-id' });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = post.image; // Assuming image URL is in post.image
    link.download = `${userDetails?.name || 'post'}-image.jpg`;
    link.click();
  };

  return (
    <div className="max-w-[531px] overflow-hidden mx-auto p-4 bg-white rounded-lg shadow-md relative">
      {/* Header Section */}
      <div className="header flex items-center justify-between pb-2 border-b border-gray-300">
        <div className="flex items-center">
          <img
            src={userDetails?.profilePicture || '/default-profile.png'}
            alt="Profile"
            className="profile-pic w-8 h-8 rounded-full"
          />
          <div className="ml-2">
            <div className="username font-bold">{userDetails?.name || 'Loading...'}</div>
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
              <h3 className="text-lg font-semibold mb-4">Comments</h3>
              <div className="comment-list space-y-4 h-64 overflow-y-auto">
                {comments.map((comment, idx) => (
                  <div key={idx} className="comment-item flex items-start">
                    <img
                      src={comment.user.profilePicture || '/default-profile.png'}
                      alt="User"
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <div>
                      <div className="comment-user font-semibold">{comment.username}</div>
                      <div className="comment-text text-sm">{comment.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="comment-form mt-4 flex items-center space-x-2">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                  Post
                </button>
              </form>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsCommentPopupOpen(false)}
              className="absolute top-4 right-4 text-2xl text-gray-600"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
