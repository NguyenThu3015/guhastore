
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const CustomerRoute = () => {
    const { user } = useAuth();

    
    if (user && user.role === 'CUSTOMER') {
        
        return <Outlet />;
    }
    
    
    return <Navigate to="/" />;
};

export default CustomerRoute;
