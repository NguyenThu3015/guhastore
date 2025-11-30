import React, { useState, useEffect, useCallback,useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

import Button from './ui/Button';
import { RiAddLine, RiFileExcel2Line } from 'react-icons/ri';

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]); 
    const [categories, setCategories] = useState([]); 
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const fileInputRef = useRef(null);

    
    const [filters, setFilters] = useState({
        search: '',
        brandId: '',
        categoryId: '',
        minPrice: '',
        maxPrice: ''
    });

    
    const debouncedFilters = useDebounce(filters, 500); 

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setMessage('Đang import dữ liệu...');

        axios.post('http://localhost:8081/api/v1/products/import', formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            setMessage('Import thành công!');
             // Tải lại danh sách
        })
        .catch(err => {
            console.error(err);
            setMessage('Lỗi import! Kiểm tra định dạng file CSV.');
        });
        
        // Reset input để có thể chọn lại cùng file nếu muốn
        e.target.value = null;
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    
    useEffect(() => {
        const fetchFilterData = async () => {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            try {
                const [brandsRes, categoriesRes] = await Promise.all([
                    axios.get('http://localhost:8081/api/v1/brands', config),
                    axios.get('http://localhost:8081/api/v1/categories', config)
                ]);
                setBrands(brandsRes.data);
                setCategories(categoriesRes.data);
            } catch (err) {
                console.error("Lỗi tải dữ liệu cho bộ lọc", err);
            }
        };
        if (token) {
            fetchFilterData();
        }
    }, [token]);

    
    useEffect(() => {
        if (!token) return;

        setLoading(true);
        
        const params = new URLSearchParams();
        if (debouncedFilters.search) params.append('search', debouncedFilters.search);
        if (debouncedFilters.brandId) params.append('brandId', debouncedFilters.brandId);
        if (debouncedFilters.categoryId) params.append('categoryId', debouncedFilters.categoryId);
        if (debouncedFilters.minPrice) params.append('minPrice', debouncedFilters.minPrice);
        if (debouncedFilters.maxPrice) params.append('maxPrice', debouncedFilters.maxPrice);

        const apiUrl = `http://localhost:8081/api/v1/products?${params.toString()}`;

        axios.get(apiUrl, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setProducts(res.data))
            .catch(err => console.error("Lỗi tải sản phẩm", err))
            .finally(() => setLoading(false));

    }, [debouncedFilters, token]); 

    const handleDelete = (productId) => {
        
        if (!token || !window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
        axios.delete(`http://localhost:8081/api/v1/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
                setMessage('Đã xóa sản phẩm thành công.');
                
                setFilters(f => ({...f})); 
            })
            .catch(err => setMessage('Lỗi! Không thể xóa sản phẩm.'));
    };

    const resetFilters = () => {
        setFilters({
            search: '', brandId: '', categoryId: '', minPrice: '', maxPrice: ''
        });
    };

    
    return (
        <div className="space-y-8 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Quản lý Sản phẩm</h1>
                <div className="flex gap-3">
                    {/* Nút Thêm thủ công */}
                    <Link to="/admin/products/new">
                        <Button variant="primary" className="flex items-center">
                            <RiAddLine className="mr-2" /> Thêm Mới
                        </Button>
                    </Link>

                    {/* Nút Import CSV */}
                    <div>
                        {/* Input ẩn */}
                        <input 
                            type="file" 
                            accept=".csv" 
                            ref={fileInputRef}
                            style={{ display: 'none' }} 
                            onChange={handleFileUpload}
                        />
                        {/* Nút giả kích hoạt input ẩn */}
                        <Button 
                            variant="secondary" 
                            className="flex items-center bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <RiFileExcel2Line className="mr-2" /> Import CSV
                        </Button>
                    </div>
                </div>
            </div>

            {message && <p className="text-sm text-green-600">{message}</p>}
            
            {/* Filter Section */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <input
                        type="text"
                        name="search"
                        placeholder="Tìm theo tên..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="p-2 border rounded-md"
                    />
                    {/* Brand Filter */}
                    <select name="brandId" value={filters.brandId} onChange={handleFilterChange} className="p-2 border rounded-md">
                        <option value="">Tất cả thương hiệu</option>
                        {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                    </select>
                    {/* Category Filter */}
                    <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange} className="p-2 border rounded-md">
                        <option value="">Tất cả danh mục</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    {/* Price Range */}
                    <input
                        type="number"
                        name="minPrice"
                        placeholder="Giá tối thiểu"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="p-2 border rounded-md"
                    />
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="Giá tối đa"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="p-2 border rounded-md"
                    />
                    <button onClick={resetFilters} className="md:col-start-5 bg-gray-600 text-white p-2 rounded-md hover:bg-gray-700">
                        Reset
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* Table Header */}
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Sản phẩm</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-4">Đang tải sản phẩm...</td></tr>
                            ) : products.length > 0 ? (
                                products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{product.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price.toLocaleString('vi-VN')} VNĐ</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stockQuantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                            <Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900">Sửa</Link>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">Xóa</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        Không tìm thấy sản phẩm nào khớp với bộ lọc.
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

export default AdminProducts;