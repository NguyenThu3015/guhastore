import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ProfileUpdateForm = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', phoneNumber: '', address: '' });
    const [status, setStatus] = useState({ loading: false, error: null, success: null });
    const { user, token, login } = useAuth();

    useEffect(() => {
        if (token) {
            axios.get('http://localhost:8082/api/v1/profile', { headers: { 'Authorization': `Bearer ${token}` } })
                .then(res => {
                    setFormData({
                        fullName: res.data.fullName || '',
                        email: res.data.email || '',
                        phoneNumber: res.data.phoneNumber || '',
                        address: res.data.address || ''
                    });
                })
                // Sửa lỗi phông: "Không thể tải hồ sơ"
                .catch(err => setStatus({ loading: false, error: 'Không thể tải hồ sơ.', success: null }));
        }
    }, [token]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null, success: null });
        try {
            const res = await axios.put('http://localhost:8082/api/v1/profile', 
                { fullName: formData.fullName, phoneNumber: formData.phoneNumber, address: formData.address }, 
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            // Sửa lỗi phông: "Cập nhật hồ sơ thành công!"
            setStatus({ loading: false, error: null, success: 'Cập nhật hồ sơ thành công!' });
            const updatedUser = { ...user, ...res.data };
            login({ token: token, user: updatedUser }); 
        } catch (err) {
            // Sửa lỗi phông: "Lỗi! Không thể cập nhật."
            const errorMessage = err.response?.data?.message || 'Lỗi! Không thể cập nhật.';
            setStatus({ loading: false, error: errorMessage, success: null });
        }
    };
    
    const inputStyle = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input type="email" value={formData.email} disabled className={`${inputStyle} bg-gray-100 cursor-not-allowed`} />
            </div>
            <div>
                {/* Sửa lỗi phông: "Họ và tên" */}
                <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
                {/* Sửa lỗi phông: "Số điện thoại" */}
                <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
                {/* Sửa lỗi phông: "Địa chỉ" */}
                <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputStyle} />
            </div>
            <button type="submit" disabled={status.loading}
                className="w-full mt-4 bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {/* Sửa lỗi phông: "Lưu thay đổi" */}
                {status.loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
            {status.success && <p className="text-sm text-center text-green-600">{status.success}</p>}
            {status.error && <p className="text-sm text-center text-red-600">{status.error}</p>}
        </form>
    );
};

export default ProfileUpdateForm;