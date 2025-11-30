
import React from 'react';
import AdminBaseManager from './AdminBaseManager';

const AdminCategories = () => {
    
    return (
        <AdminBaseManager 
            endpoint="categories" 
            title="Danh mục nước hoa" 
            
            fields={[{ key: 'name', label: 'Tên Danh mục mới', type: 'text' }]} 
        />
    );
};

export default AdminCategories;
