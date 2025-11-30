import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <h1 className="text-9xl font-extrabold text-red-600">404</h1>
            <h2 className="text-3xl font-semibold text-slate-800 mt-4 mb-6">Trang này không tồn tại.</h2>
            <p className="text-lg text-gray-600">
                Có vẻ như bạn đã đi lạc. Vui lòng quay lại trang chủ.
            </p>
            <Link to="/" className="mt-8 text-white bg-indigo-600 hover:bg-indigo-700 font-bold py-3 px-6 rounded-lg transition-colors">
                Quay về Trang chủ
            </Link>
        </div>
    );
};

export default NotFoundPage;