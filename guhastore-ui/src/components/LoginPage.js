import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from './ui/Button'; 
import { MdEmail, MdLock } from 'react-icons/md'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('Đang xử lý...');

        axios.post('http://localhost:8082/api/v1/auth/login', { email, password })
        .then(response => {
            login(response.data); 
            navigate('/'); 
        })
        .catch(error => {
            setMessage('Sai email hoặc mật khẩu!');
        });
    };

    return (
        <div className="relative z-10 p-8 max-w-md w-full mx-auto bg-white/90 rounded-2xl shadow-2xl border border-white/80 text-gray-800">
            {/* Header */}
            <h2 className="text-4xl font-extrabold text-center text-slate-800 mb-8 border-none pb-0">Đăng nhập</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email Input */}
                <div className="relative">
                    <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                        placeholder="Email"
                        className="w-full pr-10 pl-4 py-3 bg-white rounded-lg border-2 border-gray-300 focus:border-indigo-600 focus:ring-transparent placeholder-gray-500 text-gray-800 outline-none transition duration-150" 
                    />
                    {/* Icon Email */}
                    <MdEmail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                </div>
                
                {/* Password Input */}
                <div className="relative">
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                        placeholder="Mật khẩu"
                        className="w-full pr-10 pl-4 py-3 bg-white rounded-lg border-2 border-gray-300 focus:border-indigo-600 focus:ring-transparent placeholder-gray-500 text-gray-800 outline-none transition duration-150" 
                    />
                    {/* Icon Lock */}
                    <MdLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
                </div>

                {/* Options */}
                <div className="flex justify-between items-center text-sm text-gray-700">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="form-checkbox text-indigo-600 rounded border-gray-400" />
                        <span>Ghi nhớ đăng nhập</span> 
                    </label>
                    <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-800 transition-colors">Quên mật khẩu?</Link>
                </div>

                {/* Submit Button */}
                <Button 
                    type="submit" 
                    variant="primary" 
                    className="block mx-auto w-48 text-base font-bold py-3 transition-all duration-300 transform hover:scale-[1.01] shadow-xl"
                >
                    Đăng nhập
                </Button>
            </form>
            
            {/* Error Message */}
            {message && <p className="text-sm text-center pt-4 text-red-600">{message}</p>}

            {/* Register Link */}
            <p className="text-center mt-6 text-gray-600 text-base">
                Chưa có tài khoản? <Link to="/register" className="text-indigo-600 font-bold hover:underline transition-colors">Đăng ký</Link>
            </p>
        </div>
    );
};
export default LoginPage;