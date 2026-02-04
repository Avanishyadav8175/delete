import React from 'react';

import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';
import logo2 from '../assets/logo2.png';
import { Home, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const showUserIcon = location.pathname === '/unlock-card' || 
                       location.pathname === '/congratulations' || 
                       location.pathname === '/final-congratulations';

  return (
     <div className="app-container">
      {/* Header */}
      <header className="bg-[#ae265f] p-3 flex items-center justify-between">
        <div className="absolute left-4 flex space-x-1">
         
        </div>
    <div className="flex items-center">
          <Home
            size={28}
            className="cursor-pointer text-white hover:text-gray-200"
          />
        </div>

      <div className="flex items-center justify-center">
          <img src={logo2} alt="Logo" className="h-10 w-10 object-contain" />
          
        </div>

        <div className="flex items-center space-x-4">
          <User
            size={28}
            className="cursor-pointer text-white hover:text-gray-200"
          />
        </div>


        {showUserIcon && (
          <div className="absolute right-4">
            <User className="text-white" size={24} />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;