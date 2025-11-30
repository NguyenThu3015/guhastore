import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Nên dùng useLocation thay vì window.location
import { useAuth } from '../context/AuthContext';

import ProfileUpdateForm from './ProfileUpdateForm';
import ChangePasswordForm from './ChangePasswordForm';
import OrderHistoryPage from './OrderHistoryPage'; 

const ProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Sử dụng hook của router để lấy path chuẩn hơn
    const currentPath = location.pathname; 
    
    // Xác định tab đang active dựa trên URL
    const getInitialTab = () => {
        if (currentPath.endsWith('/orders')) return 'orders';
        if (currentPath.endsWith('/password')) return 'password';
        return 'profile'; 
    };

    const [activeTab, setActiveTab] = useState(getInitialTab());
    
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const NavItem = ({ tabName, label, path }) => (
        <button
            onClick={() => {
                setActiveTab(tabName);
                navigate(path); 
            }}
            className={`w-full text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors
                ${activeTab === tabName 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'}`
            }
        >
            {label}
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileUpdateForm />;
            case 'password':
                return <ChangePasswordForm />;
            case 'orders':
                return <OrderHistoryPage />; 
            default:
                return <ProfileUpdateForm />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-5xl mx-auto flex gap-8 px-4">
                {/* Sidebar */}
                <aside className="w-1/4 flex-shrink-0">
                    <div className="bg-white p-4 rounded-xl shadow-md sticky top-24">
                        <div className="text-center mb-4 pb-4 border-b">
                             <h3 className="text-lg font-bold text-gray-800">{user?.fullName || 'Khách hàng'}</h3>
                             <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <nav className="space-y-2">
                           <NavItem tabName="profile" label="Thông tin tài khoản" path="/profile" />
                           <NavItem tabName="password" label="Đổi mật khẩu" path="/profile/password" />
                           <NavItem tabName="orders" label="Lịch sử đơn hàng" path="/profile/orders" />
                           
                           <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50">
                               Đăng xuất
                           </button>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="w-3/4">
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            {activeTab === 'profile' && 'Thông tin tài khoản'}
                            {activeTab === 'password' && 'Đổi mật khẩu'}
                            {activeTab === 'orders' && 'Lịch sử đơn hàng'}
                        </h2>
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;