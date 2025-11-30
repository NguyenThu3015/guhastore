import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './ui/Card';
import Button from './ui/Button'; 
import { useAuth } from '../context/AuthContext';
import { RiSearchLine, RiAddLine } from 'react-icons/ri'; 
import { Link } from 'react-router-dom'; 

const BASE_URL = 'http://localhost:8081/api/v1';

const AdminInventory = () => {
    const [allProducts, setAllProducts] = useState([]); 
    const [filteredProducts, setFilteredProducts] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { token } = useAuth(); 

    const fetchInventory = () => {
        setLoading(true);
        if (!token) {
            setLoading(false);
            return;
        }
        axios.get(`${BASE_URL}/products`, {
             headers: { 'Authorization': `Bearer ${token}` }
        }) 
            .then(res => {
                setAllProducts(res.data);
                setFilteredProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Lỗi tải hàng tồn kho:', err);
                setLoading(false);
            });
    };
    
    useEffect(() => {
        fetchInventory();
    }, [token]);

    
    useEffect(() => {
        const results = allProducts.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(results);
    }, [searchTerm, allProducts]);

    if (loading) {
        return <p>Đang tải dữ liệu tồn kho...</p>;
    }

    return (
        <div className="space-y-6 p-4">
            
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Danh sách sản phẩm tồn kho</h2>
                {/* Nút nhập hàng */}
                <Link to="/admin/purchase-orders/new">
                    <Button variant="primary" className="shadow-lg">
                        <RiAddLine className="mr-2" /> Nhập hàng
                    </Button>
                </Link>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full max-w-md">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-4 pr-10 py-3 bg-white rounded-lg border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* Search Icon */}
                <RiSearchLine className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            </div>

            <Card className="p-0 overflow-hidden shadow-xl">
                {/* Table */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ảnh</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tên sản phẩm</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Số lượng tồn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Giá bán</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Tình trạng</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img src={`http://localhost:8081${product.imageUrl}`} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                                    <span className={product.stockQuantity <= 10 ? 'text-red-600' : 'text-blue-600'}>
                                        {product.stockQuantity || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.price.toLocaleString('vi-VN')} VNĐ</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default AdminInventory;