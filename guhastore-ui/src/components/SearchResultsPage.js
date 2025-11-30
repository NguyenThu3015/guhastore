import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchResultsPage = () => {
    const location = useLocation();
    


    return (
        <div className="p-8 min-h-[60vh]">
            <h2 className="text-3xl font-extrabold mb-6">
                Kết quả tìm kiếm cho: "..." 
            </h2>
            <div className="text-gray-600">
                <p>Không có sản phẩm nào khớp với từ khóa tìm kiếm của bạn.</p>
                
            </div>
        </div>
    );
};

export default SearchResultsPage;