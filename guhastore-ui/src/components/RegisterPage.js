import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Button from './ui/Button'; 
import FormContainer from './ui/FormContainer'; 

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        address: '', 
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '', 
        gender: 'UNKNOWN' 
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Sửa lỗi phông: Đang xử lý...
        setMessage('Đang xử lý...');

        if (formData.password !== formData.confirmPassword) {
            // Sửa lỗi phông: Mật khẩu và xác nhận mật khẩu không khớp!
            setMessage('Mật khẩu và xác nhận mật khẩu không khớp!');
            return;
        }

        const { confirmPassword, ...dataToSend } = formData;

        axios.post('http://localhost:8082/api/v1/auth/register', dataToSend)
            .then(response => {
                // Sửa lỗi phông: Đăng ký thành công...
                setMessage('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...');
                setTimeout(() => navigate('/login'), 2000);
            })
            .catch(error => {
                if (error.response?.status === 400) {
                    // Sửa lỗi phông: Lỗi email hoặc thông tin...
                    setMessage('Lỗi! Email đã được sử dụng hoặc thông tin không hợp lệ.');
                } else {
                    // Sửa lỗi phông: Không thể đăng ký...
                    setMessage('Lỗi! Không thể đăng ký.');
                }
            });
    };

    return (
        // Sửa tiêu đề form
        <FormContainer title="Đăng ký thành viên" className="max-w-3xl">
            
            <p className="text-center text-gray-600 mb-6 flex items-center justify-center space-x-2">
                Đăng ký tài khoản ngay để mua hàng tại Guha Perfume <span className="text-red-500">❤️</span>
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    
                    {/* Họ Tên */}
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1">Họ và Tên</label>
                        <input type="text" name="fullName" onChange={handleChange} required 
                               placeholder="Nhập họ tên của bạn" 
                               className="bg-gray-100 text-gray-800 border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 placeholder-gray-500" />
                    </div>

                    {/* Địa chỉ */}
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1">Địa chỉ</label>
                        <input type="text" name="address" onChange={handleChange} placeholder="Nhập địa chỉ của bạn" />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1">Email</label>
                        <input type="email" name="email" onChange={handleChange} required placeholder="Nhập địa chỉ email" />
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1">Số điện thoại</label>
                        <input type="text" name="phoneNumber" onChange={handleChange} placeholder="Nhập số điện thoại" />
                    </div>

                    {/* Mật khẩu */}
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1">Mật khẩu</label>
                        <input type="password" name="password" onChange={handleChange} required placeholder="Nhập mật khẩu" />
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div>
                        <label className="block text-gray-700 text-sm font-semibold mb-1">Nhập lại mật khẩu</label>
                        <input type="password" name="confirmPassword" onChange={handleChange} required placeholder="Xác nhận mật khẩu" />
                    </div>
                </div>

                {/* Giới tính */}
                <div className="pt-4 border-t border-gray-200">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Giới tính:</label>
                    <div className="flex space-x-6">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="gender"
                                value="UNKNOWN"
                                checked={formData.gender === 'UNKNOWN'}
                                onChange={handleChange}
                                className="form-radio text-indigo-600 border-gray-300"
                            />
                            <span className="text-gray-700">Không xác định</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="gender"
                                value="MALE"
                                checked={formData.gender === 'MALE'}
                                onChange={handleChange}
                                className="form-radio text-indigo-600 border-gray-300"
                            />
                            <span className="text-gray-700">Nam</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="gender"
                                value="FEMALE"
                                checked={formData.gender === 'FEMALE'}
                                onChange={handleChange}
                                className="form-radio text-indigo-600 border-gray-300"
                            />
                            <span className="text-gray-700">Nữ</span>
                        </label>
                    </div>
                </div>

                {/* Nút Đăng ký */}
                <Button 
                    type="submit" 
                    variant="primary" 
                    className="block mx-auto w-64 mt-6 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-3 text-base"
                >
                    Đăng ký
                </Button>
            </form>
            {message && <p className="text-sm text-center pt-4 text-red-600">{message}</p>}

            {/* Link Đăng nhập */}
            <p className="text-center mt-6 text-gray-600 text-base">
                Đã có tài khoản? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Đăng nhập</Link>
            </p>
        </FormContainer>
    );
};
export default RegisterPage;