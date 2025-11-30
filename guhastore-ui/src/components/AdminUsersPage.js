import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';


const RoleBadge = ({ role }) => {
    const isAdmin = role === 'ADMIN';
    const colorClasses = isAdmin 
        ? 'bg-red-100 text-red-800' 
        : 'bg-blue-100 text-blue-800';
    
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses}`}>
            {role}
        </span>
    );
};

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    
    const fetchUsers = () => {
        if (!token) return;
        setLoading(true);
        axios.get('http://localhost:8082/api/v1/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => setUsers(res.data))
        .catch(err => console.error("Lỗi tải danh sách user", err))
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Quản lý Người dùng</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và Tên</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fullName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <RoleBadge role={user.role} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsersPage;