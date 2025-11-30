import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 mt-auto border-t border-slate-800">
            <div className="container mx-auto px-4">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Column 1: Brand Info */}
                    <div>
                        <h3 className="text-white text-2xl font-bold mb-6 tracking-tight">GuHaStore</h3>
                        <p className="text-sm leading-relaxed mb-6 text-slate-400">
                            Nơi hội tụ những mùi hương đẳng cấp và tinh tế. Chúng tôi cam kết mang đến sản phẩm nước hoa chính hãng 100% với trải nghiệm mua sắm tuyệt vời nhất cho khách hàng.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm border-b border-indigo-500 inline-block pb-1">Khám phá</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="text-indigo-500">›</span> Trang chủ</Link></li>
                            <li><Link to="/articles" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="text-indigo-500">›</span> Blog & Tin tức</Link></li>
                            <li><Link to="/about" className="hover:text-indigo-400 transition-colors flex items-center gap-2"><span className="text-indigo-500">›</span> Về chúng tôi</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm border-b border-indigo-500 inline-block pb-1">Liên hệ</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3 group">
                                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 transition-colors">
                                    <FaMapMarkerAlt className="text-indigo-400 group-hover:text-white" />
                                </div>
                                <span className="mt-1">123 Đường ABC, Quận Hoàn Kiếm, TP. Hà Nội, Việt Nam</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 transition-colors">
                                    <FaPhoneAlt className="text-indigo-400 group-hover:text-white" size={12} />
                                </div>
                                <span>+84 987 654 321</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 transition-colors">
                                    <FaEnvelope className="text-indigo-400 group-hover:text-white" size={12} />
                                </div>
                                <span>contact@guhastore.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm border-b border-indigo-500 inline-block pb-1">Đăng ký nhận tin</h4>
                        <p className="text-sm mb-4 text-slate-400">Nhận thông tin mới nhất về sản phẩm, mã giảm giá và khuyến mãi hấp dẫn.</p>
                        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Email của bạn..."
                                    className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-700 text-sm transition-all placeholder-slate-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-all font-medium text-sm shadow-lg shadow-indigo-900/20"
                            >
                                Đăng ký ngay
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Section: Copyright */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-sm font-medium text-slate-400">&copy; {new Date().getFullYear()} <span className="text-white">GuHaStore</span>. All rights reserved.</p>
                        <p className="text-xs mt-1 text-slate-600">Kiến trúc SOA | Backend: Spring Boot | Frontend: React/Tailwind</p>
                    </div>

                    <div className="flex gap-4">
                        <SocialIcon href="#" icon={<FaFacebookF size={14} />} colorClass="hover:bg-[#1877F2]" />
                        <SocialIcon href="#" icon={<FaTwitter size={14} />} colorClass="hover:bg-[#1DA1F2]" />
                        <SocialIcon href="#" icon={<FaInstagram size={14} />} colorClass="hover:bg-[#E4405F]" />
                        <SocialIcon href="#" icon={<FaLinkedinIn size={14} />} colorClass="hover:bg-[#0A66C2]" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ href, icon, colorClass }) => (
    <a 
        href={href} 
        className={`w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all duration-300 transform hover:-translate-y-1 ${colorClass}`}
    >
        {icon}
    </a>
);

export default Footer;