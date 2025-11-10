import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Outlet, Link, NavLink, useParams, useNavigate } from 'react-router-dom';

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, orderBy, limit, startAfter, endBefore, limitToLast } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// --- Firebase Config & Initialization ---
const firebaseConfig = {
  apiKey: "AIzaSyAKwOw7H40psr-DrGpaZaNmNJK9jRxhNLU",
  authDomain: "crickethub-1c169.firebaseapp.com",
  projectId: "crickethub-1c169",
  storageBucket: "crickethub-1c169.appspot.com",
  messagingSenderId: "377931902841",
  appId: "1:377931902841:web:f228dbaf437e426f8149a8",
  measurementId: "G-422P4QG1NB"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const postsCollectionRef = collection(db, 'posts');

// --- Blog Service (Firebase Implementation) ---
const getPosts = async () => {
    const q = query(postsCollectionRef, orderBy('date', 'desc'));
    const data = await getDocs(q);
    return data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

const getPostById = async (id) => {
    const postDoc = doc(db, 'posts', id);
    const docSnap = await getDoc(postDoc);
    return docSnap.exists() ? { ...docSnap.data(), id: docSnap.id } : undefined;
};

const addPost = async (postData) => {
    const newPost = { ...postData, date: new Date().toISOString() };
    const docRef = await addDoc(postsCollectionRef, newPost);
    return { ...newPost, id: docRef.id };
};

const updatePost = async (id, postData) => {
    const postDoc = doc(db, 'posts', id);
    await updateDoc(postDoc, postData);
    return { ...postData, id };
};

const deletePost = async (id) => {
    const postDoc = doc(db, 'posts', id);
    await deleteDoc(postDoc);
    return true;
};


// --- Components ---
const AdPlaceholder = ({ label, width = '100%', height = '90px' }) => {
  // This component is hidden by default via CSS in the <head>.
  // To make it visible for development, find the ".ad-placeholder" rule 
  // and change "display: none" to "display: flex".
  return (
    <div
      className="ad-placeholder my-8 items-center justify-center bg-gray-200 border-2 border-dashed border-gray-400"
      style={{ width, minHeight: height }}
      aria-hidden="true" // Hide from screen readers as it's not visible
    >
      <span className="text-gray-500 font-medium">{label}</span>
    </div>
  );
};

const Header = () => {
  const activeLinkStyle = { color:'#3B82F6', textDecoration:'underline' };
  return (
    <header className="bg-neutral shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-accent transition-colors">Cricket Hub</Link>
        <nav className="hidden md:block">
          <NavLink to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium" style={({isActive})=>isActive?activeLinkStyle:undefined}>Home</NavLink>
        </nav>
      </div>
    </header>
  );
};

const Footer = () => (<footer className="bg-neutral text-white mt-auto"><div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">&copy; {new Date().getFullYear()} Cricket Hub. All rights reserved.</div></footer>);

// FIX: Changed component signature to avoid prop type inference issue with React's special `key` prop.
const PostCard = (props) => {
  const { post } = props;
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

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [firstDoc, setFirstDoc] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [isLastPage, setIsLastPage] = useState(false);
  const POSTS_PER_PAGE = 6;

  const fetchPosts = useCallback(async (direction, cursor) => {
    setLoading(true);
    window.scrollTo(0, 0); // Scroll to top on page change for better UX
    let q;
    if (direction === 'next') {
      q = cursor
        ? query(postsCollectionRef, orderBy('date', 'desc'), startAfter(cursor), limit(POSTS_PER_PAGE))
        : query(postsCollectionRef, orderBy('date', 'desc'), limit(POSTS_PER_PAGE));
    } else { // 'prev'
      q = query(postsCollectionRef, orderBy('date', 'desc'), endBefore(cursor), limitToLast(POSTS_PER_PAGE));
    }

    try {
        const docSnap = await getDocs(q);
        if (!docSnap.empty) {
          const newPosts = docSnap.docs.map(d => ({ ...d.data(), id: d.id }));
          setPosts(newPosts);
          setFirstDoc(docSnap.docs[0]);
          setLastDoc(docSnap.docs[docSnap.docs.length - 1]);
          
          if (direction === 'next') {
             const nextCheckQuery = query(postsCollectionRef, orderBy('date', 'desc'), startAfter(docSnap.docs[docSnap.docs.length - 1]), limit(1));
             const nextCheckSnap = await getDocs(nextCheckQuery);
             setIsLastPage(nextCheckSnap.empty);
          } else {
             setIsLastPage(false);
          }
        }
    } catch(err) {
        console.error("Failed to fetch posts:", err);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts('next', null);
  }, [fetchPosts]);

  const handleNext = () => {
    if (!isLastPage) {
      setPage(p => p + 1);
      fetchPosts('next', lastDoc);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage(p => p - 1);
      fetchPosts('prev', firstDoc);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div></div>;

  const postsWithAds = posts.reduce((acc, post, index) => {
    acc.push(<PostCard key={post.id} post={post}/>);
    if ((index + 1) % 3 === 0 && index < posts.length - 1) {
      const adNumber = Math.floor(index / 3) + 1 + ((page - 1) * (POSTS_PER_PAGE / 3));
      acc.push(
        <div key={`ad-wrapper-${index}`} className="md:col-span-2 lg:col-span-3">
          <AdPlaceholder label={`In-feed Ad #${adNumber}`} />
        </div>
      );
    }
    return acc;
  }, []);

  return (
    <div>
      <AdPlaceholder label="Homepage Top Banner" />
      <h1 className="text-4xl font-extrabold text-center mb-12 text-neutral">Latest Articles</h1>
      {posts.length > 0 ? (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{postsWithAds}</div>
          <div className="mt-12 flex justify-center items-center space-x-4">
            <button onClick={handlePrev} disabled={page === 1 || loading} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-75 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
              &larr; Previous
            </button>
            <span className="text-lg font-semibold text-neutral">Page {page}</span>
            <button onClick={handleNext} disabled={isLastPage || loading} className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-75 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
              Next &rarr;
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 text-xl">No articles found.</p>
      )}
    </div>
  );
};

const PostDetail = () => {
  const {id}=useParams(); const [post,setPost]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{ if(id){ const fetchPost=async()=>{ setLoading(true); const data=await getPostById(id); setPost(data||null); setLoading(false); }; fetchPost(); } },[id]);
  if(loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div></div>;
  if(!post) return <div className="text-center py-10"><h2 className="text-2xl font-bold">Post not found</h2><Link to="/" className="text-primary hover:underline mt-4 inline-block">Back to Home</Link></div>;
  return (
    <article className="max-w-4xl mx-auto bg-white p-6 sm:p-8 lg:p-12 rounded-lg shadow-xl">
      <img className="w-full h-64 md:h-96 object-cover rounded-md mb-8" src={post.imageUrl} alt={post.title} />
      <h1 className="text-4xl md:text-5xl font-extrabold text-neutral mb-4 leading-tight">{post.title}</h1>
      <p className="text-gray-500 mb-8">By <span className="font-semibold">{post.author}</span> on {new Date(post.date).toLocaleDateString()}</p>
      
      <AdPlaceholder label="Article Top Banner" />

      <div className="prose lg:prose-xl max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: post.content }}></div>
      
      <AdPlaceholder label="Article Bottom Banner" />

      <div className="mt-12 border-t pt-8"><Link to="/" className="text-primary hover:text-secondary font-semibold transition-colors">&larr; Back to all articles</Link></div>
    </article>
  );
};

// --- Admin Login ---
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [seq, setSeq] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(()=>{
    if(showLogin) return;
    let timeoutId;
    const handleKeyDown=(e)=>{
      if(e.key.length>1){ setSeq(''); return; }
      const newSeq = (seq+e.key.toLowerCase()).slice(-10);
      setSeq(newSeq);
      if(newSeq==='cricadmin'){ setShowLogin(true); }
      clearTimeout(timeoutId);
      timeoutId=window.setTimeout(()=>setSeq(''),2000);
    };
    window.addEventListener('keydown',handleKeyDown);
    return ()=>{ window.removeEventListener('keydown',handleKeyDown); clearTimeout(timeoutId); };
  },[seq,showLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged in AdminLayout will handle the redirect
    } catch (err) {
      console.error(err);
      let friendlyError = "Failed to sign in. Please check your email and password.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          friendlyError = "Invalid email or password.";
      } else if (err.code === 'auth/invalid-email') {
          friendlyError = "Please enter a valid email address.";
      }
      setError(friendlyError);
    } finally {
        setLoading(false);
    }
  };

  return showLogin?(
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" autoFocus />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
          </div>
          {error && <p className="text-error text-sm mb-4">{error}</p>}
          <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary disabled:bg-gray-400">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  ):(
    <div className="text-center text-gray-500">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl">Page Not Found</p>
    </div>
  );
};

// --- Admin Layout & Dashboard ---
const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).catch(error => console.error("Logout failed", error));
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <button onClick={handleLogout} className="bg-error text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">Logout</button>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"><Outlet/></main>
    </div>
  );
};

const AdminDashboard = () => {
  const [posts,setPosts]=useState([]); const [loading,setLoading]=useState(true);
  const fetchPosts=useCallback(async()=>{ setLoading(true); const data=await getPosts(); setPosts(data); setLoading(false); },[]);
  useEffect(()=>{ fetchPosts(); },[fetchPosts]);
  const handleDelete=async(id)=>{ if(window.confirm('Are you sure you want to delete this post?')){ await deletePost(id); fetchPosts(); } };
  if(loading) return <p>Loading posts...</p>;
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Manage Posts</h2>
        <Link to="/admin/new" className="bg-success text-white px-4 py-2 rounded-md hover:bg-green-700">+ New Post</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map(p=>(
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(p.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Link to={`/admin/edit/${p.id}`} className="text-accent hover:text-secondary">Edit</Link>
                  <button onClick={()=>handleDelete(p.id)} className="text-error hover:text-red-700">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(id);
  const quillRef = useRef(null);
  const quillInstanceRef = useRef(null);

  useEffect(() => {
    if (quillRef.current && !quillInstanceRef.current) {
// FIX: Use window.Quill to reference the editor library from the global scope.
      quillInstanceRef.current = new window.Quill(quillRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean']
          ]
        },
        placeholder: 'Start writing your story here...',
      });
    }

    const quill = quillInstanceRef.current;
    if (quill) {
      if (isEditing) {
        setLoading(true);
        getPostById(id).then(post => {
          if (post) {
            setTitle(post.title || '');
            quill.root.innerHTML = post.content || '';
          }
        }).catch(err => {
          console.error(err);
        }).finally(() => {
          setLoading(false);
        });
      } else {
        setTitle('');
        quill.root.innerHTML = '';
      }
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required.');
      return;
    }
    setLoading(true);

    const finalContent = quillInstanceRef.current ? quillInstanceRef.current.root.innerHTML : '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = finalContent;
    const images = tempDiv.querySelectorAll('img');
    
    let firstImageUrl = null;
    if (images.length > 0) {
        firstImageUrl = images[0].src;
    }

    const textContent = tempDiv.textContent || "";
    const excerpt = textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');
    const imageUrl = firstImageUrl || `https://picsum.photos/seed/${title.trim().replace(/\s+/g, '-') || 'post'}/800/400`;

    const postData = {
      title,
      content: finalContent,
      author: 'Admin',
      excerpt,
      imageUrl,
    };

    try {
      if (isEditing) {
        await updatePost(id, postData);
      } else {
        await addPost(postData);
      }
      navigate('/admin');
    } catch (err) {
      console.error("Failed to save post:", err);
      let friendlyError = `An error occurred while saving the post. Please check your Firestore rules. Error: ${err.message}`;
      if (err.code === 'resource-exhausted' || (err.message && err.message.toLowerCase().includes('too large'))) {
          friendlyError = 'Failed to save post. The content, including images, is too large. Firestore documents have a 1MB size limit. Please try using smaller or fewer images.';
      }
      alert(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md relative">
      {loading && isEditing && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex justify-center items-center z-10 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      <h2 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title-input" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <div ref={quillRef} style={{ height: '400px', backgroundColor: 'white' }} className="mt-1" />
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-2 rounded-md hover:bg-secondary disabled:bg-gray-400 transition-colors">
            {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Publish Post')}
          </button>
        </div>
      </form>
    </div>
  );
};


// --- App ---
const App = () => (
  <HashRouter>
    <Header/>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
      <Routes>
        <Route path="/" element={<PostList/>}/>
        <Route path="/post/:id" element={<PostDetail/>}/>
        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<AdminDashboard/>}/>
          <Route path="new" element={<PostEditor/>}/>
          <Route path="edit/:id" element={<PostEditor/>}/>
        </Route>
        <Route path="*" element={<div className="text-center py-20 text-gray-500"><h1 className="text-4xl font-bold mb-4">404</h1><p>Page Not Found</p></div>}/>
      </Routes>
    </div>
    <Footer/>
  </HashRouter>
);


const rootElem = document.getElementById('root');
const FlexRoot = () => <div className="flex flex-col min-h-screen"><App /></div>;
const root = ReactDOM.createRoot(rootElem);
root.render(<FlexRoot/>);