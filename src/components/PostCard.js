import React, { useState } from "react";
import axios from 'axios';

const PostCard = ({ post }) => {
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments);

  const userId = 'some-user-id';  // Replace with the actual user ID (from context or props)

  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/posts/${post._id}/like`, { userId });
      setIsLiked(!isLiked);
      setLikeCount(response.data.likes.length);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/posts/${post._id}/comment`, {
        userId,
        username: 'User',  // Replace with the actual username (from context or props)
        text: comment
      });
      setComments(response.data.comments);
      setComment('');  // Clear the comment input field
    } catch (error) {
      console.error('Failed to comment on post:', error);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="header flex items-center justify-between pb-2 border-b border-gray-300 relative">
        <div className="flex items-center">
          <div className="profile-pic w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="ml-2">
            <div className="username font-bold">{post.username}</div>
          </div>
        </div>
      </div>

      <img
        src={post.image}
        alt="Post"
        className="post-image w-full h-72 object-cover rounded-lg my-4"
      />

      <div className="post-actions flex items-center space-x-4 py-2">
        <div className="action-item flex items-center">
          <span
            className={`action-icon cursor-pointer text-xl ${
              isLiked ? "text-red-500" : "text-gray-800"
            }`}
            onClick={handleLike}
          >
            {isLiked ? "❤️" : "♡"}
          </span>
          <span className="like-count text-sm text-gray-500 ml-1">{likeCount}</span>
        </div>
      </div>

      <div className="post-comments">
        <form onSubmit={handleCommentSubmit} className="my-4">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Add a comment..."
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
            Comment
          </button>
        </form>
        <div>
          {comments.map((cmt, index) => (
            <div key={index} className="comment my-2">
              <span className="font-bold">{cmt.username}:</span> {cmt.text}
            </div>
          ))}
        </div>
      </div>

      <div className="post-info text-sm py-2">
        <div className="caption font-semibold">{post.caption}</div>
        <div className="time text-xs text-gray-400 mt-1">
          {new Date(post.time).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
