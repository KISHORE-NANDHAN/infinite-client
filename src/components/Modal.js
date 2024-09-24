// Modal.js
import React from 'react';

const Modal = ({ post, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{post.username}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            &times;
          </button>
        </div>
        <img
          src={post.imageurl}
          alt="Post"
          className="w-full h-72 object-cover rounded-lg mb-4"
        />
        <p className="text-sm">{post.caption}</p>
        <div className="text-xs text-gray-400 mt-1">
          {new Date(post.time).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default Modal;
