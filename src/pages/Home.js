import React, { useContext } from 'react';
import { GetAllPostsContext } from '../context/GetAllPostsContext'; // Adjust the path according to your folder structure
import PostCard from '../components/PostCard';
import GoToPost from '../components/GoToPost';

const Home = () => {
  const { posts, loading } = useContext(GetAllPostsContext);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="flex overflow-hidden flex-col md:flex-row object-cover">
      <div className="flex-grow md:ml-60">
        <GoToPost />
        <div>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <div>No posts available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
