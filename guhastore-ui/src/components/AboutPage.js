// src/pages/AboutPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaHeart, FaShippingFast, FaAward } from 'react-icons/fa';
import { RiDoubleQuotesL } from 'react-icons/ri';

const AboutPage = () => {
    return (
        <div className="bg-white text-gray-800">
            {/* --- SECTION 1: HERO BANNER --- */}
            <div className="relative h-[400px] flex items-center justify-center">
                {/* Background Image với lớp phủ tối */}
                <div 
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}
                >
                    <div className="absolute inset-0 bg-slate-900/60"></div>
                </div>
                
                {/* Nội dung Hero */}
                <div className="relative z-10 text-center text-white px-4 animate-fade-in-up">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif tracking-wide">Câu Chuyện Của GuHaStore</h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
                        "Nơi cảm xúc thăng hoa cùng những nốt hương tinh tế nhất."
                    </p>
                </div>
            </div>

            {/* --- SECTION 2: GIỚI THIỆU & SỨ MỆNH --- */}
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Hình ảnh minh họa */}
                    <div className="relative">
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-100 rounded-full z-0"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                            alt="Cửa hàng nước hoa GuHaStore" 
                            className="relative z-10 rounded-lg shadow-xl w-full object-cover h-[500px]"
                        />
                        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-lg z-20 hidden md:block">
                            <p className="text-4xl font-bold text-indigo-600">5+</p>
                            <p className="text-gray-600 text-sm uppercase tracking-wider">Năm kinh nghiệm</p>
                        </div>
                    </div>

                    {/* Nội dung text */}
                    <div>
                        <h2 className="text-indigo-600 font-semibold uppercase tracking-wider text-sm mb-2">Về chúng tôi</h2>
                        <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                            Mang Đến Vẻ Đẹp Vô Hình <br/> Nhưng Đầy Quyền Năng
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-justify">
                            Khởi đầu từ niềm đam mê bất tận với thế giới mùi hương, <strong>GuHaStore</strong> được thành lập với sứ mệnh không chỉ cung cấp những chai nước hoa chính hãng, mà còn là người bạn đồng hành giúp bạn định hình phong cách cá nhân.
                        </p>
                        <p className="text-gray-600 mb-8 leading-relaxed text-justify">
                            Chúng tôi tin rằng, nước hoa không chỉ là một loại mỹ phẩm, mà là vũ khí bí mật, là ký ức, và là dấu ấn riêng biệt của mỗi người. Tại GuHaStore, mỗi sản phẩm đều được tuyển chọn kỹ lưỡng từ các thương hiệu danh tiếng toàn cầu như Chanel, Dior, Tom Ford, Le Labo...
                        </p>
                        
                        <div className="flex gap-8 border-t border-gray-100 pt-8">
                            <div>
                                <p className="text-3xl font-bold text-gray-900">1000+</p>
                                <p className="text-gray-500 text-sm">Sản phẩm</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">50k+</p>
                                <p className="text-gray-500 text-sm">Khách hàng hài lòng</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECTION 3: TẠI SAO CHỌN CHÚNG TÔI --- */}
            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4 font-serif">Tại Sao Chọn GuHaStore?</h2>
                        <p className="text-gray-600">Chúng tôi cam kết mang lại những giá trị thực sự cho khách hàng thông qua chất lượng sản phẩm và dịch vụ tận tâm.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard 
                            icon={<FaCheckCircle className="text-4xl text-indigo-600" />}
                            title="100% Chính Hãng"
                            desc="Cam kết hoàn tiền 200% nếu phát hiện hàng giả. Nguồn gốc xuất xứ rõ ràng."
                        />
                        <FeatureCard 
                            icon={<FaShippingFast className="text-4xl text-indigo-600" />}
                            title="Giao Hàng Tốc Độ"
                            desc="Giao hàng hỏa tốc 2h nội thành. Đóng gói 3 lớp chống sốc an toàn tuyệt đối."
                        />
                        <FeatureCard 
                            icon={<FaHeart className="text-4xl text-indigo-600" />}
                            title="Tư Vấn Tận Tâm"
                            desc="Đội ngũ am hiểu về các nốt hương, giúp bạn tìm ra mùi hương chân ái (signature scent)."
                        />
                        <FeatureCard 
                            icon={<FaAward className="text-4xl text-indigo-600" />}
                            title="Bảo Hành Mùi Hương"
                            desc="Chính sách đổi trả linh hoạt. Bảo hành vòi xịt và mùi hương đến giọt cuối cùng."
                        />
                    </div>
                </div>
            </div>

            {/* --- SECTION 4: QUOTE --- */}
            <div className="container mx-auto px-4 py-20">
                <div className="bg-indigo-600 rounded-2xl p-10 md:p-16 text-center text-white relative overflow-hidden">
                    <RiDoubleQuotesL className="text-indigo-400 text-9xl absolute top-0 left-0 opacity-20 transform -translate-x-4 -translate-y-4" />
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <p className="text-2xl md:text-3xl font-medium italic mb-8 leading-relaxed">
                            "Không có sự thanh lịch nào là trọn vẹn nếu thiếu nước hoa. Đó là phụ kiện vô hình, khó quên và tối thượng nhất."
                        </p>
                        <div className="font-bold text-lg uppercase tracking-widest">— Coco Chanel</div>
                    </div>
                </div>
            </div>

            {/* --- SECTION 5: CTA --- */}
            <div className="pb-20 container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-6">Bạn đã sẵn sàng tìm kiếm mùi hương của riêng mình?</h2>
                <Link 
                    to="/" 
                    className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-600 transition-all duration-300 shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1"
                >
                    Khám Phá Bộ Sưu Tập Ngay
                </Link>
            </div>
        </div>
    );
};

// Component phụ: Thẻ tính năng
const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
        <div className="mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
);

export default AboutPage;
