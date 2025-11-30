// src/components/AdminBrands.js
import React from 'react';
import AdminBaseManager from './AdminBaseManager';

const AdminBrands = () => {
    // Endpoint: /api/v1/brands
    return (
        <AdminBaseManager 
            endpoint="brands" 
            title="Thương hiệu Nước hoa" 
            fields={[{ key: 'name', label: 'Tên Thương hiệu', type: 'text' }]}
        />
    );
};

export default AdminBrands;