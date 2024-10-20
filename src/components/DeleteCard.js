import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { UserContext } from '../context/UserContext.js';

function DeleteCard({ post, user, onDelete }) {
    const { currentUser } = useContext(UserContext);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(post.comments || []);
    const popupRef = useRef();
    const currentUserId = Cookies.get('session_token');

    useEffect(() => {
        setIsLiked(post.likes?.includes(currentUserId) || false);
    }, [post.likes, currentUserId]);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (isPopupOpen && popupRef.current && !popupRef.current.contains(e.target)) {
                setIsPopupOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isPopupOpen]);

    const handleLike = async () => {
        try {
            const response = await axios.post(`http://localhost:3500/api/posts/${post._id}/like`, { currentUserId });
            setIsLiked(!isLiked);
            setLikeCount(response.data.likes.length);
        } catch (error) {
            console.error('Failed to like post:', error);
            alert('Failed to like post. Please try again.');
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return; // Prevent submitting empty comments
        try {
            const response = await axios.post(`http://localhost:3500/api/posts/${post._id}/comment`, {
                pfp: currentUser.profilePicture || process.env.REACT_APP_DEFAULT_PFP,
                userId: currentUserId,
                username: currentUser.username || 'Anonymous',
                text: comment,
            });
            setComments(response.data.comments);
            setComment('');
        } catch (error) {
            console.error('Failed to comment on post:', error);
            alert('Failed to comment on post. Please try again.');
        }
    };

    const handleDeletePost = async () => {
        try {
            await axios.delete(`http://localhost:3500/api/posts/${post._id}`).then((response) => {
                if (response.data.message === 'Post deleted') {
                    onDelete(post._id); 
                    setIsPopupOpen(false); 
                }
            });
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('Failed to delete post. Please try again.');
        }
    };

    return (
        <>
            <div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md cursor-pointer" onClick={() => setIsPopupOpen(true)}>
                <div className="header flex items-center justify-between pb-2 border-b border-gray-300">
                    <div className="flex items-center">
                        <img
                            src={user.profilePicture || '/default-profile.png'}
                            alt="Profile"
                            className="w-8 h-8 bg-gray-300 rounded-full"
                        />
                        <div className="ml-2">
                            <div className="username font-bold">{user.username || 'Anonymous'}</div>
                        </div>
                    </div>
                </div>

                <img
                    src={post.image}
                    alt={post.caption}
                    className="post-image w-full h-fit object-cover rounded-lg my-4"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/default-image.png'; }} // Fallback image
                />
                <h3 className="text-xl font-semibold">{post.caption}</h3>
                <p className="text-gray-500 text-sm mt-1">
                    {new Date(post.createdAt).toLocaleString()}
                </p>
            </div>

            {isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div ref={popupRef} className="bg-white rounded-lg w-11/12 max-w-4xl p-6 relative flex">
                        <div className="w-1/2">
                            <div className="flex items-center">
                                <img
                                    src={user.profilePicture || '/default-profile.png'}
                                    alt="Profile"
                                    className="w-8 h-8 bg-gray-300 rounded-full"
                                />
                                <div className="ml-2">
                                    <div className="username font-bold">{user.username || 'Anonymous'}</div>
                                </div>
                                <div className="ml-2 flex-grow">
                            <div className="absolute ">
                                <button 
                                    onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                                    className="text-gray-500 focus:outline-none"
                                >
                                    &#x22EE;
                                </button>
                                {showDeleteMenu && (
                                    <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
                                        <button 
                                            onClick={handleDeletePost}
                                            className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                                        >
                                            Delete Post
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                            </div>
                            <img
                                src={post.image}
                                alt="Post"
                                className="w-full object-contain rounded-lg mb-4"
                            />
                            <div className="text-sm">
                                <h2 className="font-semibold mb-2">{user.username}</h2>
                                <p>{post.caption}</p>
                                <p className="text-gray-400 text-xs">{new Date(post.createdAt).toLocaleString()}</p>
                                <p className="font-semibold">❤️ {likeCount}</p>
                                <button onClick={handleLike} className={`mt-2 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
                                    {isLiked ? '❤️ Liked' : '🤍 Like'}
                                </button>
                            </div>
                        </div>

                        <div className="w-1/2 pl-6">
                            <h3 className="text-lg font-semibold mb-2">Comments</h3>
                            <div className="comments max-h-60 overflow-y-auto mb-4">
                                {comments && comments.length > 0 ? (
                                    comments.map((comment, index) => (
                                        <div key={index} className="comment py-2 border-b border-gray-200 flex items-center">
                                            <img
                                                src={comment.pfp}
                                                alt="Profile"
                                                className="w-8 h-8 bg-gray-300 rounded-full"
                                            />
                                            <div className="ml-2">
                                                <strong>{comment.username || 'Anonymous'}</strong>: {comment.text}
                                                <br />
                                                <p className="text-gray-400 text-xs">
                                                    {new Date(comment.time).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div>No comments yet.</div>
                                )}
                            </div>
                            <form onSubmit={handleCommentSubmit} className="flex">
                                <input
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="flex-grow border border-gray-300 rounded-lg p-2 mr-2"
                                    placeholder="Add a comment..."
                                />
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Post</button>
                            </form>
                        </div>

                        <div className="absolute bottom-4 right-4">
                            <button onClick={handleDeletePost} className="text-red-500 bg-white border border-red-500 rounded px-4 py-2 hover:bg-red-500 hover:text-white">
                                Delete Post
                            </button>
                        </div>

                        <button onClick={() => setIsPopupOpen(false)} className="absolute top-2 right-2 text-xl text-gray-600">✖</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default DeleteCard;
