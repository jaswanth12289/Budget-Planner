import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, LogOut, Hexagon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useContext(AuthContext);

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Transactions', path: '/transactions', icon: Receipt },
    { name: 'Budgets', path: '/budgets', icon: PieChart },
  ];

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="hidden md:flex flex-col w-72 bg-white/70 dark:bg-[#121214]/80 backdrop-blur-2xl border-r border-gray-100 dark:border-white/5 relative shadow-[8px_0_30px_rgb(0,0,0,0.02)] dark:shadow-[8px_0_30px_rgb(0,0,0,0.2)]"
    >
      <div className="h-20 flex items-center px-8 border-b border-gray-100 dark:border-white/5 gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
          <Hexagon className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 tracking-tight">SmartBudget</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-8">
        <nav className="space-y-2 px-5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative flex items-center px-4 py-3.5 text-sm font-bold rounded-xl transition-all group overflow-hidden
                  ${isActive 
                    ? 'text-white shadow-md shadow-blue-500/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`mr-4 h-5 w-5 transition-colors z-10 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                <span className="z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-6 border-t border-gray-100 dark:border-white/5">
        <button
          onClick={logout}
          className="group flex w-full items-center px-4 py-3.5 text-sm font-bold rounded-xl text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
        >
          <LogOut className="mr-4 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
          Logout
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
