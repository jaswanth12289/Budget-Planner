import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart } from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const Layout = () => {
  const { pathname } = useLocation();
  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Budgets', path: '/budgets', icon: PieChart },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0a0a0b]">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col relative w-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar />
        
        {/* Main Content Area - Note the extra padding at bottom on mobile for the navbar */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50 dark:bg-[#0a0a0b] pb-24 md:pb-6 relative z-10">
          <Outlet />
        </main>

        {/* Premium Mobile Bottom Navigation Bar (Hidden on Desktop) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 w-full z-50 bg-white/90 dark:bg-[#121214]/90 backdrop-blur-2xl border-t border-gray-200 dark:border-white/10 shadow-[0_-8px_30px_rgb(0,0,0,0.1)] dark:shadow-[0_-8px_30px_rgb(0,0,0,0.6)]">
          <div className="flex justify-around items-center h-[72px] px-2 pb-safe">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="flex flex-col items-center justify-center w-full h-full relative group"
                >
                  <motion.div 
                    whileTap={{ scale: 0.9 }}
                    className={`relative p-2 rounded-xl transition-colors ${isActive ? 'bg-blue-50 dark:bg-blue-500/10' : ''}`}
                  >
                    <Icon className={`h-6 w-6 relative z-10 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                  </motion.div>
                  <span className={`text-[10px] font-bold mt-1 transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                    {link.name}
                  </span>
                  
                  {/* Animated Active Indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="mobileActiveIndicator" 
                      className="absolute top-0 w-12 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 rounded-b-full shadow-[0_2px_8px_rgba(37,99,235,0.4)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
