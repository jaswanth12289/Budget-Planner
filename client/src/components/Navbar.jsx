import React, { useContext, useEffect, useState } from 'react';
import { Moon, Sun, Hexagon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-[#121214]/80 backdrop-blur-xl px-4 md:px-6">
      
      {/* Mobile Brand Logo */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md shadow-blue-500/20">
          <Hexagon className="h-4 w-4 text-white" />
        </div>
        <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 tracking-tight">SmartBudget</h1>
      </div>
      <div className="flex-1 flex justify-end items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
            {user?.name}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
