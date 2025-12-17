import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { 
    RiDashboardLine, 
    RiShoppingBag3Line, 
    RiFileList3Line, 
    RiArchiveLine, 
    RiTeamLine, 
    RiArticleLine, 
    RiLogoutCircleRLine, 
    RiBarChartLine,
    RiListCheck // Icon cho Catalog
} from 'react-icons/ri';

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

    // --- CẤU HÌNH MENU VÀ PHÂN QUYỀN ---
    const menuConfig = [
        {
            path: '/admin',
            label: 'Dashboard',
            icon: <RiDashboardLine />,
            roles: ['ADMIN'], // Cả 2 đều thấy
            end: true
        },
        {
            path: '/admin/products',
            label: 'Sản phẩm',
            icon: <RiShoppingBag3Line />,
            roles: ['ADMIN', 'EMPLOYEE'] // Cả 2 đều thấy
        },
        {
            path: '/admin/catalog', // Đã sửa lại path cho đúng với router (thường là categories)
            label: 'Quản lý Catalog',
            icon: <RiListCheck />,
            roles: ['ADMIN', 'EMPLOYEE'] // Cả 2 đều thấy
        },
        {
            path: '/admin/orders',
            label: 'Quản lý Đơn hàng',
            icon: <RiFileList3Line />,
            roles: ['ADMIN', 'EMPLOYEE'] // Cả 2 đều thấy
        },
        {
            path: '/admin/articles',
            label: 'Quản lý Bài viết',
            icon: <RiArticleLine />,
            roles: ['ADMIN', 'EMPLOYEE'] // Cả 2 đều thấy
        },
        // --- CÁC MỤC CHỈ DÀNH CHO ADMIN ---
        {
            path: '/admin/inventory',
            label: 'Kho & Nhập hàng',
            icon: <RiArchiveLine />,
            roles: ['ADMIN'] // Chỉ ADMIN mới thấy
        },
        {
            path: '/admin/users',
            label: 'Quản lý tài khoản',
            icon: <RiTeamLine />,
            roles: ['ADMIN'] // Chỉ ADMIN mới thấy
        },
        {
            path: '/admin/statistics',
            label: 'Thống kê & Báo cáo',
            icon: <RiBarChartLine />,
            roles: ['ADMIN'] // Chỉ ADMIN mới thấy
        }
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-white h-screen sticky top-0 flex flex-col p-4 shadow-lg border-r border-gray-100">
            {/* Header Sidebar */}
            <div className="text-center py-5 border-b mb-4 bg-indigo-50 rounded-lg">
                <h2 className="text-xl font-bold text-indigo-700">Admin Panel</h2>
                <div className="mt-2">
                    <p className="text-sm font-semibold text-gray-800">{user?.fullName}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide
                        ${user?.role === 'ADMIN' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {user?.role === 'ADMIN' ? 'Quản trị viên' : 'Nhân viên'}
                    </span>
                </div>
            </div>

            {/* Menu List */}
            <nav className="flex-grow space-y-1 overflow-y-auto">
                {menuConfig.map((item, index) => {
                    // LOGIC KIỂM TRA QUYỀN QUAN TRỌNG NHẤT
                    if (user && item.roles.includes(user.role)) {
                        return (
                            <NavLink 
                                key={index} 
                                to={item.path} 
                                end={item.end} 
                                className={navLinkClass}
                            >
                                {item.icon} 
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    }
                    return null; // Ẩn nếu không đủ quyền
                })}
            </nav>

            {/* Footer Logout */}
            <div className="pt-4 border-t mt-4">
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <RiLogoutCircleRLine /> Đăng xuất
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;