import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const activeLinkStyle = {
    color: '#3B82F6',
    textDecoration: 'underline',
  };

  return (
    <header className="bg-neutral shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-white hover:text-accent transition-colors">
              Cricet Hub
            </Link>
          </div>
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink
                to="/"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                style={({ isActive }) => isActive ? activeLinkStyle : undefined}
              >
                Home
              </NavLink>
              {/* The Admin link has been removed from the UI */}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;