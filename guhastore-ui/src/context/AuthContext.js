// Nằm trong: src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Tạo Context
const AuthContext = createContext();

// 2. Tạo "Provider" (Component Cha)
export const AuthProvider = ({ children }) => {
    // 3. Tạo state để lưu thông tin user và token
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);
    // 4. (Rất quan trọng) Kiểm tra localStorage khi app mới tải
    // Giúp user "tự động đăng nhập" nếu F5 lại trang
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsAuthLoaded(true);
    }, []);

    // 5. Hàm "login"
    const login = (data) => {
        // 'data' là object { token, user } từ API
        setUser(data.user);
        setToken(data.token);
        
        // Lưu vào localStorage để "nhớ"
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
    };

    // 6. Hàm "logout"
    const logout = () => {
        setUser(null);
        setToken(null);
        
        // Xóa khỏi localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    // 7. Cung cấp state và hàm cho các component con
    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthLoaded }}>
            {children}
        </AuthContext.Provider>
    );
};

// 8. Tạo một "Hook" tùy chỉnh (để dễ sử dụng)
export const useAuth = () => {
    return useContext(AuthContext);
};