import React, { useState, useEffect } from 'react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

// In a real-world scenario, never store credentials on the client-side.
// For this static site, we store a HASH of the password, not the password itself.
// This is the SHA-256 hash of "IPLBlog@7"
const MOCK_PASSWORD_HASH = '2c8c227878fd0ab9508820c7370868453cb118a8027735a78e8741544a45b630';
const SECRET_PHRASE = 'cricadmin';

// Helper function to compute SHA-256 hash
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}


const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [inputSequence, setInputSequence] = useState('');

  useEffect(() => {
    if (showLoginForm) return;

    let timeoutId: number;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.length > 1) {
        setInputSequence('');
        return;
      }
      
      const newSequence = (inputSequence + event.key.toLowerCase()).slice(-SECRET_PHRASE.length);
      setInputSequence(newSequence);
      
      if (newSequence === SECRET_PHRASE) {
        setShowLoginForm(true);
      }

      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setInputSequence('');
      }, 2000);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [inputSequence, showLoginForm]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const inputHash = await sha256(password);
    
    if (inputHash === MOCK_PASSWORD_HASH) {
      setError('');
      onLogin(true);
    } else {
      setError('Incorrect password.');
      onLogin(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {showLoginForm ? (
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md transition-opacity duration-500 ease-in-out opacity-100">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Admin Login</h2>
          <p className="text-center text-gray-500 mb-6">Enter the administrator password to continue.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
                autoFocus
              />
            </div>
            {error && <p className="text-error text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Login
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center text-gray-500">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl">Page Not Found</p>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;