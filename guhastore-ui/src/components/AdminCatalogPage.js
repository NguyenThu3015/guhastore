// src/components/AdminCatalogPage.js
import React, { useState } from 'react';
import AdminBrands from './AdminBrands';
import AdminCategories from './AdminCategories';

const AdminCatalogPage = () => {
    const [activeTab, setActiveTab] = useState('categories'); // Mặc định hiển thị Danh mục

    const tabButtonClass = (tabName) => 
        `px-6 py-3 font-semibold rounded-t-lg transition-colors ${
            activeTab === tabName 
            ? 'bg-white text-indigo-600' 
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`;

    return (
        <div className="w-full">
            <div className="flex border-b border-gray-300">
                <button onClick={() => setActiveTab('categories')} className={tabButtonClass('categories')}>
                    Quản lý Danh mục
                </button>
                <button onClick={() => setActiveTab('brands')} className={tabButtonClass('brands')}>
                    Quản lý Thương hiệu
                </button>
            </div>
            <div className="p-6 bg-white rounded-b-lg shadow-md">
                {activeTab === 'categories' && <AdminCategories />}
                {activeTab === 'brands' && <AdminBrands />}
            </div>
        </div>
    );
};

export default AdminCatalogPage;