
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    
    <div className="flex bg-gray-50 min-h-screen">
      
      {}
      <AdminSidebar /> 

      {}
      {}
      {}
      <main className="flex-grow p-6 md:p-8">
        
        {}
        {}
        <Outlet /> 
        
      </main>
    </div>
  );
};

export default AdminLayout;
