import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext'; // Adjust the path as necessary

function Card({ post }) {
    const { user ,setUser, loading} = useContext(UserContext); // Get user context

    return (
        <div className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md">
            <div className="header flex items-center justify-between pb-2 border-b border-gray-300">
                <div className="flex items-center">
                    <img
                        src={user.ProfilePicture} // Use a default image if none is provided
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
            />
            <h3 className="text-xl font-semibold">{post.caption}</h3>
            <p className="text-gray-500 text-sm mt-1">
                {new Date(post.createdAt).toLocaleString()}
            </p>
        </div>
    );
}

export default Card;
