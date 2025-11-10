import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post } from '../types.ts';
import { getPostById, addPost, updatePost } from '../services/blogService.ts';

const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    author: '',
    imageUrl: '',
    excerpt: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      getPostById(id!).then(post => {
        if (post) {
          setPostData({
            title: post.title,
            content: post.content,
            author: post.author,
            imageUrl: post.imageUrl,
            excerpt: post.excerpt,
          });
        }
        setIsLoading(false);
      });
    }
  }, [id, isEditing]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isEditing) {
        await updatePost(id!, postData);
      } else {
        await addPost(postData);
      }
      navigate('/admin');
    } catch (error) {
      console.error("Failed to save post", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && isEditing) {
    return <p>Loading post data...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" name="title" id="title" value={postData.title} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"/>
        </div>
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
          <input type="text" name="author" id="author" value={postData.author} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"/>
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input type="text" name="imageUrl" id="imageUrl" value={postData.imageUrl} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"/>
        </div>
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</label>
          <textarea name="excerpt" id="excerpt" rows={3} value={postData.excerpt} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"/>
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea name="content" id="content" rows={10} value={postData.content} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"/>
        </div>
        <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => navigate('/admin')} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary disabled:bg-gray-400">
              {isLoading ? 'Saving...' : 'Save Post'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default PostEditor;