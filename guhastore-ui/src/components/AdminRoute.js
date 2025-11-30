
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const { user } = useAuth();

    
    if (user && user.role === 'ADMIN') {
        
        return <Outlet />;
    }

    
    return <Navigate to="/" />;
};

export default AdminRoute;
