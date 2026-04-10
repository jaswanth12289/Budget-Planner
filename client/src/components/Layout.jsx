import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative w-full">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-light-bg dark:bg-dark-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
