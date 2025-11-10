
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral text-white mt-auto">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {new Date().getFullYear()} Cricet Hub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
