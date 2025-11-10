
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post } from '../types';
import { getPostById } from '../services/blogService';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        setLoading(true);
        const fetchedPost = await getPostById(id);
        setPost(fetchedPost || null);
        setLoading(false);
      };
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Post not found</h2>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto bg-white p-6 sm:p-8 lg:p-12 rounded-lg shadow-xl">
      <img className="w-full h-64 md:h-96 object-cover rounded-md mb-8" src={post.imageUrl} alt={post.title} />
      <h1 className="text-4xl md:text-5xl font-extrabold text-neutral mb-4 leading-tight">{post.title}</h1>
      <p className="text-gray-500 mb-8">
        By <span className="font-semibold">{post.author}</span> on {new Date(post.date).toLocaleDateString()}
      </p>
      <div className="prose lg:prose-xl max-w-none text-gray-800 whitespace-pre-wrap">
        {post.content}
      </div>
       <div className="mt-12 border-t pt-8">
            <Link to="/" className="text-primary hover:text-secondary font-semibold transition-colors">
                &larr; Back to all articles
            </Link>
        </div>
    </article>
  );
};

export default PostDetail;
