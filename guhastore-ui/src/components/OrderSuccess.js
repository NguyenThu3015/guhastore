import React from 'react';
import { Link } from 'react-router-dom';
import { RiCheckboxCircleLine } from 'react-icons/ri';

const OrderSuccess = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh] bg-white p-8 rounded-lg shadow-lg">
            <RiCheckboxCircleLine className="w-24 h-24 text-green-500 mb-6" />
            
            {/* Tiêu đề đã sửa lỗi */}
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h2>
            
            {/* Nội dung đã sửa lỗi */}
            <p className="text-gray-600 max-w-md mb-8">
                Cảm ơn bạn đã mua sắm tại GuHaStore. Chúng tôi đã nhận được đơn hàng của bạn và sẽ xử lý trong thời gian sớm nhất.
            </p>
            
            {/* Nút bấm đã sửa lỗi */}
            <Link 
                to="/" 
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
                Tiếp tục mua sắm
            </Link>
        </div>
    );
};

export default OrderSuccess;