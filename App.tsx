
import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './components/AdminDashboard';
import PostEditor from './components/PostEditor';

const MainLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);


const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PostList />} />
          <Route path="post/:id" element={<PostDetail />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="new" element={<PostEditor />} />
          <Route path="edit/:id" element={<PostEditor />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
