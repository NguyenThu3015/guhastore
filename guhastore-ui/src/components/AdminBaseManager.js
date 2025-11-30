// src/components/AdminBaseManager.js
import React, { useState, useEffect, useMemo } from 'react'; // 1. Thêm useMemo
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BASE_URL = 'http://localhost:8081/api/v1';

const AdminBaseManager = ({ endpoint, title, fields }) => {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState({});
    const [editingItem, setEditingItem] = useState(null); 
    // 2. Thêm state cho việc tìm kiếm
    const [searchQuery, setSearchQuery] = useState('');
    const { token } = useAuth();

    // ... (Các hàm fetch, handleSubmit, handleDelete, resetForm, handleEdit giữ nguyên)
    useEffect(() => {
        fetchItems();
    }, [endpoint]);

    const fetchItems = () => {
        axios.get(`${BASE_URL}/${endpoint}`, { 
            headers: { 'Authorization': `Bearer ${token}` } 
        })
            .then(res => setItems(res.data))
            .catch(err => console.error(`Lỗi tải ${title}:`, err));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {};
        fields.forEach(field => {
            data[field.key] = formData[field.key];
        });

        const request = editingItem
            ? axios.put(`${BASE_URL}/${endpoint}/${editingItem.id}`, data, { headers: { 'Authorization': `Bearer ${token}` } })
            : axios.post(`${BASE_URL}/${endpoint}`, data, { headers: { 'Authorization': `Bearer ${token}` } });
        
        request.then(() => {
            fetchItems();
            resetForm();
        }).catch(err => alert(`Lỗi. Hãy kiểm tra token hoặc dữ liệu trùng lặp.`));
    };
    
    const handleDelete = (id, name) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa ${title} "${name}"?`)) {
            axios.delete(`${BASE_URL}/${endpoint}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(() => fetchItems())
                .catch(err => alert(`KHÔNG THỂ XÓA. Vui lòng kiểm tra các ràng buộc.`));
        }
    };

    const resetForm = () => {
        setEditingItem(null);
        setFormData({});
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        const initialData = {};
        fields.forEach(field => {
            initialData[field.key] = item[field.key];
        });
        setFormData(initialData);
    };

    // 3. Sử dụng useMemo để lọc danh sách một cách hiệu quả
    const filteredItems = useMemo(() => {
        if (!searchQuery) {
            return items; // Nếu không có query, trả về danh sách đầy đủ
        }

        // Lấy key của trường đầu tiên (thường là 'name') để tìm kiếm
        const searchKey = fields[0]?.key;
        if (!searchKey) return items; // An toàn nếu fields rỗng

        return items.filter(item =>
            item[searchKey] && item[searchKey].toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [items, searchQuery, fields]); // Tính toán lại chỉ khi items hoặc searchQuery thay đổi


    // ---- GIAO DIỆN ----
    return (
        <div className="space-y-8 p-6">
            {/* --- KHUNG THÊM / SỬA (Giữ nguyên) --- */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    {editingItem ? `Chỉnh sửa ${title}` : `Thêm ${title} mới`}
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    {fields.map(field => (
                        <div key={field.key} className="w-full">
                            <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">{field.label}</label>
                            <input
                                id={field.key}
                                type={field.type}
                                placeholder={`Nhập ${field.label.toLowerCase()}...`}
                                name={field.key}
                                value={formData[field.key] || ''}
                                onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                    ))}
                    <div className="flex-shrink-0 flex gap-2">
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {editingItem ? 'Lưu' : 'Thêm'}
                        </button>
                        {editingItem && (
                            <button type="button" onClick={resetForm} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Hủy
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* --- DANH SÁCH ITEMS --- */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                 <h3 className="text-xl font-semibold mb-4 text-gray-800">Danh sách {title}</h3>
                 
                 {/* 4. Thêm ô Input tìm kiếm */}
                 <div className="mb-4">
                     <input
                         type="text"
                         placeholder={`Tìm kiếm ${title.toLowerCase()}...`}
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="block w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                     />
                 </div>
                 
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                {fields.map(field => (
                                    <th key={field.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{field.label}</th>
                                ))}
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* 5. Hiển thị danh sách đã lọc (filteredItems) */}
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{item.id}</td>
                                        {fields.map(field => (
                                            <td key={field.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item[field.key]}</td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900">Sửa</button>
                                            <button onClick={() => handleDelete(item.id, item.name)} className="text-red-600 hover:text-red-900">Xóa</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={fields.length + 2} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Không tìm thấy kết quả nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBaseManager;