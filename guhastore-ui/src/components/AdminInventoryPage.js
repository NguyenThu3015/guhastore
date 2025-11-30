import React, { useState } from 'react';
import AdminInventory from './AdminInventory';
import AdminPurchaseOrders from './AdminPurchaseOrders';

const AdminInventoryPage = () => {
    const [activeTab, setActiveTab] = useState('inventory'); 

    const tabButtonClass = (tabName) => 
        `px-6 py-3 font-semibold rounded-t-lg transition-colors ${
            activeTab === tabName 
            ? 'bg-white text-indigo-600' 
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`;

    return (
        <div className="w-full">
            <div className="flex border-b border-gray-300">
                <button onClick={() => setActiveTab('inventory')} className={tabButtonClass('inventory')}>
                    Kiểm tra Tồn kho
                </button>
                <button onClick={() => setActiveTab('purchaseOrders')} className={tabButtonClass('purchaseOrders')}>
                    Lịch sử Nhập hàng
                </button>
            </div>
            <div className="p-6 bg-white rounded-b-lg shadow-md">
                {activeTab === 'inventory' && <AdminInventory />}
                {activeTab === 'purchaseOrders' && <AdminPurchaseOrders />}
            </div>
        </div>
    );
};

export default AdminInventoryPage;