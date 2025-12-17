import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { 
    RiUserLine, RiHeartLine, RiFileList2Line, 
    RiShoppingCartLine, RiAdminLine, RiMenu3Line, 
    RiCloseLine, RiStore2Line, RiLogoutBoxRLine 
} from 'react-icons/ri';

const Header = () => {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const NavItem = ({ to, children }) => (
        <NavLink to={to} className={({ isActive }) => 
            `relative px-1 py-2 text-sm font-medium transition-colors group ${
                isActive ? 'text-yellow-400' : 'text-gray-300 hover:text-white'
            }`
        }>
            {({ isActive }) => (
                <>
                    {children}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform origin-left transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </>
            )}
        </NavLink>
    );

    const MobileNavItem = ({ to, children, onClick }) => (
        <NavLink 
            to={to} 
            onClick={onClick}
            className={({ isActive }) => 
            `block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-slate-800 hover:text-white'
            }`
        }>
            {children}
        </NavLink>
    );

    return (
        <header 
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg py-3' : 'bg-slate-900 py-5'
            }`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 text-2xl font-serif font-bold text-white tracking-wide hover:opacity-90 transition-opacity">
                    <RiStore2Line className="text-yellow-400" />
                    <span>GuHa<span className="text-yellow-400">Store</span></span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    <NavItem to="/">Trang chủ</NavItem>
                    <NavItem to="/about">Về chúng tôi</NavItem> 
                    <NavItem to="/products">Sản phẩm</NavItem>
                    <NavItem to="/articles">Blog & Tin tức</NavItem>
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        /* --- SỬA Ở ĐÂY: CHO PHÉP ADMIN HOẶC EMPLOYEE --- */
                        (user.role === 'ADMIN' || user.role === 'EMPLOYEE') ? (
                            /* Admin View */
                            <div className="flex items-center gap-4">
                                <Link to="/admin" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-medium transition-all shadow-lg shadow-indigo-500/30">
                                    <RiAdminLine /> Trang Quản Trị
                                </Link>
                                <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors" title="Đăng xuất">
                                    <RiLogoutBoxRLine size={20} />
                                </button>
                            </div>
                        ) : (
                            /* User View */
                            <div className="flex items-center gap-5 text-white">
                                <div className="flex items-center gap-4 border-r border-gray-700 pr-4">
                                    <Link to="/wishlist" className="relative group">
                                        <RiHeartLine size={22} className="text-gray-300 group-hover:text-red-500 transition-colors" />
                                    </Link>
                                    <Link to="/cart" className="relative group">
                                        <RiShoppingCartLine size={22} className="text-gray-300 group-hover:text-yellow-400 transition-colors" />
                                    </Link>
                                </div>
                                
                                <div className="flex items-center gap-3 pl-1">
                                    <Link to="/profile" className="flex items-center gap-2 group">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-yellow-400 group-hover:bg-gray-600 transition-colors">
                                            <RiUserLine />
                                        </div>
                                        <span className="text-sm font-medium max-w-[100px] truncate hidden lg:block group-hover:text-yellow-400 transition-colors">
                                            {user.sub || "Tài khoản"}
                                        </span>
                                    </Link>
                                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors ml-2" title="Đăng xuất">
                                        <RiLogoutBoxRLine size={20} />
                                    </button>
                                </div>
                            </div>
                        )
                    ) : (
                        /* Guest View */
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-white hover:text-yellow-400 font-medium text-sm transition-colors">
                                Đăng nhập
                            </Link>
                            <Link to="/register" className="px-4 py-2 bg-white text-slate-900 rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors shadow-md">
                                Đăng ký
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden text-white text-2xl focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <RiCloseLine /> : <RiMenu3Line />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden bg-slate-800 absolute top-full left-0 w-full shadow-xl overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-screen py-4' : 'max-h-0 py-0'}`}>
                <div className="px-4 flex flex-col gap-1">
                    <MobileNavItem to="/" onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</MobileNavItem>
                    <MobileNavItem to="/about" onClick={() => setIsMobileMenuOpen(false)}>Về chúng tôi</MobileNavItem>
                    <MobileNavItem to="/products" onClick={() => setIsMobileMenuOpen(false)}>Sản phẩm</MobileNavItem>
                    <MobileNavItem to="/articles" onClick={() => setIsMobileMenuOpen(false)}>Blog & Tin tức</MobileNavItem>
                    
                    <div className="h-px bg-gray-700 my-2"></div>
                    
                    {user ? (
                        <>
                            {/* --- ĐÃ SỬA Ở MOBILE MENU --- */}
                            {(user.role === 'ADMIN' || user.role === 'EMPLOYEE') ? (
                                <MobileNavItem to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                                    <span className="flex items-center gap-2 text-yellow-400">
                                        <RiAdminLine /> Trang Quản Trị
                                    </span>
                                </MobileNavItem>
                            ) : (  
                                <>
                                    <MobileNavItem to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Hồ sơ cá nhân</MobileNavItem>
                                    <MobileNavItem to="/cart" onClick={() => setIsMobileMenuOpen(false)}>Giỏ hàng</MobileNavItem>
                                    <MobileNavItem to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>Yêu thích</MobileNavItem>
                                    <MobileNavItem to="/profile/orders" onClick={() => setIsMobileMenuOpen(false)}>Lịch sử đơn hàng</MobileNavItem>
                                </>
                            )}
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 rounded-lg text-red-400 font-medium hover:bg-slate-700 transition-colors flex items-center gap-2"
                            >
                                <RiLogoutBoxRLine /> Đăng xuất
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2 mt-2">
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-2 border border-gray-600 text-white rounded-lg">Đăng nhập</Link>
                            <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-2 bg-yellow-400 text-slate-900 font-bold rounded-lg">Đăng ký</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;