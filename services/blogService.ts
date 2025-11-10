import { posts as mockPosts } from '../data/posts.ts';
import { Post } from '../types.ts';

// This is a mock service. In a real application, these functions would
// make API calls to a backend server to fetch, create, update, and delete posts.

let posts: Post[] = [...mockPosts];

export const getPosts = async (): Promise<Post[]> => {
  // Simulate network delay
  await new Promise(res => setTimeout(res, 200));
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getPostById = async (id: string): Promise<Post | undefined> => {
  await new Promise(res => setTimeout(res, 200));
  return posts.find(post => post.id === id);
};

export const addPost = async (postData: Omit<Post, 'id' | 'date'>): Promise<Post> => {
  await new Promise(res => setTimeout(res, 200));
  const newPost: Post = {
    ...postData,
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
  };
  posts.push(newPost);
  return newPost;
};

export const updatePost = async (id: string, postData: Partial<Omit<Post, 'id' | 'date'>>): Promise<Post | undefined> => {
  await new Promise(res => setTimeout(res, 200));
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex > -1) {
    posts[postIndex] = { ...posts[postIndex], ...postData };
    return posts[postIndex];
  }
  return undefined;
};

export const deletePost = async (id: string): Promise<boolean> => {
  await new Promise(res => setTimeout(res, 200));
  const initialLength = posts.length;
  posts = posts.filter(p => p.id !== id);
  return posts.length < initialLength;
};