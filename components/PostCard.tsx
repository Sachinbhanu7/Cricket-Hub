import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types.ts';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <Link to={`/post/${post.id}`} className="block">
        <img className="w-full h-48 object-cover" src={post.imageUrl} alt={post.title} />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-neutral hover:text-primary">{post.title}</h2>
          <p className="text-gray-500 text-sm mb-4">By {post.author} on {new Date(post.date).toLocaleDateString()}</p>
          <p className="text-gray-700 leading-relaxed">{post.excerpt}</p>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;