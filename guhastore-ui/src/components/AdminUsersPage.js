import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- ICONS ---
const Icons = {
    Admin: () => <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    Employee: () => <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Customer: () => <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    ChevronDown: () => <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
};

// --- HELPER: Cấu hình hiển thị Role ---
const ROLE_CONFIG = {
    ADMIN: { label: 'Admin', color: 'bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200', icon: Icons.Admin },
    EMPLOYEE: { label: 'Nhân viên', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200', icon: Icons.Employee },
    CUSTOMER: { label: 'Khách hàng', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200', icon: Icons.Customer },
};

// --- COMPONENT: CUSTOM ROLE SELECT ---
const RoleSelect = ({ userId, currentRole, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const config = ROLE_CONFIG[currentRole] || ROLE_CONFIG.CUSTOMER;
    const Icon = config.icon;

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleSelect = (roleKey) => {
        if (roleKey !== currentRole) {
            onUpdate(userId, roleKey);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between w-36 px-3 py-1.5 rounded-full border transition-all duration-200 shadow-sm
                    text-xs font-bold uppercase tracking-wide
                    ${config.color}
                    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white focus:ring-blue-400
                `}
            >
                <div className="flex items-center">
                    <Icon />
                    <span>{currentRole}</span>
                </div>
                <Icons.ChevronDown />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 z-50 transform origin-top-right transition-all">
                    <div className="py-1">
                        {Object.keys(ROLE_CONFIG).map((roleKey) => {
                            const itemConfig = ROLE_CONFIG[roleKey];
                            const ItemIcon = itemConfig.icon;
                            const isSelected = currentRole === roleKey;
                            
                            return (
                                <button
                                    key={roleKey}
                                    onClick={() => handleSelect(roleKey)}
                                    className={`
                                        group flex w-full items-center px-4 py-3 text-sm transition-colors duration-150
                                        ${isSelected ? 'bg-gray-50 text-gray-900 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                    `}
                                >
                                    <span className={`mr-3 ${isSelected ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`}>
                                        <ItemIcon />
                                    </span>
                                    {roleKey}
                                    {isSelected && <span className="ml-auto text-blue-600">✓</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- COMPONENT: SKELETON LOADING (Đã bỏ cột Avatar) ---
const TableSkeleton = () => (
    <>
        {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i} className="animate-pulse border-b border-gray-100">
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32 mb-2"></div><div className="h-3 bg-gray-100 rounded w-20"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded-full w-28"></div></td>
            </tr>
        ))}
    </>
);

// --- MAIN PAGE ---
const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    const { token } = useAuth();

    const fetchUsers = () => {
        if (!token) return;
        setLoading(true);
        axios.get('http://localhost:8082/api/v1/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            setUsers(res.data);
            setFilteredUsers(res.data);
        })
        .catch(err => {
            console.error(err);
            toast.error("Không thể tải danh sách người dùng");
        })
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const results = users.filter(user => 
            user.fullName?.toLowerCase().includes(lowerTerm) ||
            user.email?.toLowerCase().includes(lowerTerm) ||
            user.phoneNumber?.includes(lowerTerm)
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const handleRoleChange = async (userId, newRole) => {
        const confirmUpdate = window.confirm(`Xác nhận đổi quyền user này thành ${newRole}?`);
        if (!confirmUpdate) return;

        const toastId = toast.loading("Đang cập nhật phân quyền...");

        try {
            await axios.put(`http://localhost:8082/api/v1/admin/users/${userId}/role`, 
                { role: newRole }, 
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            const updatedList = users.map(user => 
                user.id === userId ? { ...user, role: newRole } : user
            );
            setUsers(updatedList);
            
            toast.update(toastId, { 
                render: `Đã cập nhật thành ${newRole}`, 
                type: "success", 
                isLoading: false, 
                autoClose: 2000 
            });

        } catch (error) {
            console.error(error);
            toast.update(toastId, { 
                render: error.response?.data || "Lỗi cập nhật", 
                type: "error", 
                isLoading: false, 
                autoClose: 3000 
            });
            fetchUsers();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-8 font-sans">
            <ToastContainer position="top-right" theme="colored" hideProgressBar={false} />

            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Quản lý Tài khoản</h1>
                        <p className="text-gray-500 mt-1 text-sm">Xem và quản lý phân quyền thành viên trong hệ thống.</p>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icons.Search />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="pl-10 pr-4 py-2.5 w-full md:w-80 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 overflow-visible"> 
                    <div className="overflow-x-auto rounded-2xl"> 
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/80">
                                <tr>
                                    {/* Bỏ th Avatar */}
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Họ và Tên / ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Vai trò</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {loading ? (
                                    <TableSkeleton />
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <p>Không tìm thấy người dùng nào.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-blue-50/30 transition-colors duration-200 group">
                                            
                                            {/* Cột 1: Tên & ID (Giờ là cột đầu tiên) */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                        {user.fullName}
                                                    </span>
                                                    <span className="text-xs text-gray-400">ID: #{user.id}</span>
                                                </div>
                                            </td>

                                            {/* Cột 2: Email */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                    {user.email}
                                                </div>
                                            </td>

                                            {/* Cột 3: Phone */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${user.phoneNumber ? 'text-gray-600 bg-gray-100' : 'text-gray-400 bg-gray-50 italic'}`}>
                                                    {user.phoneNumber || "Chưa cập nhật"}
                                                </span>
                                            </td>

                                            {/* Cột 4: Role Select */}
                                            <td className="px-6 py-4 whitespace-nowrap overflow-visible">
                                                <RoleSelect 
                                                    userId={user.id} 
                                                    currentRole={user.role} 
                                                    onUpdate={handleRoleChange} 
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination Placeholder */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-gray-500">Hiển thị {filteredUsers.length} kết quả</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;