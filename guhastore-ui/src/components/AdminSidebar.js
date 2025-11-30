import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { RiDashboardLine, RiShoppingBag3Line, RiFileList3Line, RiCoupon3Line, RiArchiveLine, RiBillLine, RiTeamLine, RiArticleLine, RiLogoutCircleRLine,RiBarChartLine } from 'react-icons/ri';

const AdminSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const navLinkClass = ({ isActive }) => 
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive ? 'bg-indigo-700 text-white' : 'text-gray-700 hover:bg-gray-100'
        }`;

    return (
        <aside className="w-64 flex-shrink-0 bg-white h-screen sticky top-0 flex flex-col p-4 shadow-lg">
            <div className="text-center py-4 border-b mb-4">
                <h2 className="text-xl font-bold text-indigo-600">Admin Panel</h2>
                <p className="text-xs text-gray-500">Chào, {user?.fullName}</p>
            </div>
            <nav className="flex-grow space-y-2">
                <NavLink to="/admin" end className={navLinkClass}><RiDashboardLine /> Dashboard</NavLink>
                <NavLink to="/admin/products" className={navLinkClass}><RiShoppingBag3Line /> Sản phẩm</NavLink>
                <NavLink to="/admin/catalog" className={navLinkClass}><RiShoppingBag3Line /> Quản lý Catalog</NavLink>
                <NavLink to="/admin/orders" className={navLinkClass}><RiFileList3Line /> Quản lý Đơn hàng</NavLink>
                
                <NavLink to="/admin/inventory" className={navLinkClass}><RiArchiveLine /> Kho & Nhập hàng</NavLink>
                
                <NavLink to="/admin/articles" className={navLinkClass}><RiArticleLine /> Quản lý Bài viết</NavLink>
                <NavLink to="/admin/users" className={navLinkClass}><RiTeamLine /> Quản lý Người dùng</NavLink>
                <NavLink to="/admin/statistics" className={navLinkClass}><RiBarChartLine /> Thống kê & Báo cáo</NavLink>
            </nav>
            <div className="pt-4 border-t mt-4">
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <RiLogoutCircleRLine /> Đăng xuất
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;