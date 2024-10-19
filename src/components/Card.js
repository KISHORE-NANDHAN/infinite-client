import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { UserContext } from '../context/UserContext'; // Adjust the path as necessary

function Card({ post, onDelete, onClose }) {
    const { user } = useContext(UserContext);
    const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(post.comments || []);
    const [showDeleteMenu, setShowDeleteMenu] = useState(false);
    const popupRef = useRef();
    const currentUserId = Cookies.get('session_token');

    useEffect(() => {
        setIsLiked(post.likes?.includes(currentUserId) || false);
    }, [post.likes, currentUserId]);

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
        if (!comment.trim()) return;
        try {
            const response = await axios.post(`http://localhost:3500/api/posts/${post._id}/comment`, {
                pfp: user.profilePicture || process.env.REACT_APP_DEFAULT_PFP,
                userId: currentUserId,
                username: user.username || 'Anonymous',
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
            await axios.delete(`http://localhost:3500/api/posts/${post._id}`).then((response)=>{
                if(response.data.message==='Post deleted')
                    onDelete(post._id);
                    setShowDeleteMenu(false);
            });
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('Failed to delete post. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div ref={popupRef} className="bg-white rounded-lg w-11/12 max-w-4xl p-6 relative flex">
                <div className="w-1/2">
                    <div className="flex items-center">
                        <img
                            src={user.profilePicture || '/default-profile.png'}
                            alt="Profile"
                            className="w-8 h-8 bg-gray-300 rounded-full"
                        />
                        <div className="ml-2 flex-grow">
                            <div className="username font-bold">{user.username || 'Anonymous'}</div>
                            <div className="relative">
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
                        {comments.length > 0 ? (
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

                <button onClick={onClose} className="absolute top-2 right-2 text-xl text-gray-600">✖</button>
            </div>
        </div>
    );
}

export default Card;
