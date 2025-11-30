import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ChangePasswordForm = () => {
    const { token } = useAuth();
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [status, setStatus] = useState({ loading: false, error: null, success: null });

    const handleChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null, success: null });

        if (passwords.newPassword !== passwords.confirmPassword) {
            setStatus({ loading: false, error: 'Mật khẩu mới không khớp!', success: null });
            return;
        }

        try {
            const response = await axios.put('http://localhost:8082/api/v1/profile/change-password', 
                { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }, 
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setStatus({ loading: false, error: null, success: response.data });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Lỗi! Không thể đổi mật khẩu.';
            setStatus({ loading: false, error: errorMessage, success: null });
        }
    };
    
    const inputStyle = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu hiện tại</label>
                <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mật khẩu mới</label>
                <input type="password" name="newPassword" value={passwords.newPassword} onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} required className={inputStyle} />
            </div>
            <button type="submit" disabled={status.loading}
                className="w-full mt-4 bg-red-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {status.loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </button>
            {status.success && <p className="text-sm text-center text-green-600">{status.success}</p>}
            {status.error && <p className="text-sm text-center text-red-600">{status.error}</p>}
        </form>
    );
};

export default ChangePasswordForm;