import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { RiTruckLine, RiCheckDoubleLine, RiCloseCircleLine, RiRefreshLine, RiTimeLine } from 'react-icons/ri';


const getStatusAppearance = (status) => {
    switch (status) {
        case 'PENDING':
            return { color: 'bg-yellow-100 text-yellow-800', icon: <RiTimeLine /> };
        case 'PROCESSING':
            return { color: 'bg-blue-100 text-blue-800', icon: <RiRefreshLine /> };
        case 'SHIPPED':
            return { color: 'bg-indigo-100 text-indigo-800', icon: <RiTruckLine /> };
        case 'DELIVERED':
            return { color: 'bg-green-100 text-green-800', icon: <RiCheckDoubleLine /> };
        case 'CANCELLED':
            return { color: 'bg-red-100 text-red-800', icon: <RiCloseCircleLine /> };
        default:
            return { color: 'bg-gray-100 text-gray-800', icon: <></> };
    }
};


const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    
    const [filterStatus, setFilterStatus] = useState('ALL'); 
    const { token } = useAuth();

    
    const allStatusOptions = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    const updateStatusOptions = ["PENDING", "PROCESSING", "SHIPPED", "CANCELLED", "DELIVERED"]; 

    
    const fetchOrders = () => {
        if (!token) return;
        setLoading(true);
        
        
        const apiUrl = `http://localhost:8083/api/v1/admin/orders${filterStatus !== 'ALL' ? `?status=${filterStatus}` : ''}`;

        axios.get(apiUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            setOrders(res.data);
        })
        .catch(err => console.error("Lỗi tải đơn hàng (Admin)", err))
        .finally(() => setLoading(false));
    };

    
    useEffect(() => {
        fetchOrders();
    }, [token, filterStatus]); 

    const handleStatusChange = (orderId, newStatus) => {
        if (!token) return;
        axios.put(`http://localhost:8083/api/v1/admin/orders/${orderId}/status`, newStatus, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'text/plain' }
        })
        .then(() => {
            
            if (filterStatus === 'ALL' || filterStatus === newStatus) {
                 setOrders(orders.map(order => 
                     order.id === orderId ? { ...order, status: newStatus } : order
                 ));
            } else {
                 
                 setOrders(orders.filter(order => order.id !== orderId));
            }
        })
        .catch(err => console.error("Lỗi cập nhật status", err));
    };
    

    if (loading) return <p className="p-6">Đang tải danh sách đơn hàng...</p>;

    return (
        <div className="space-y-8 p-6">
            <h1 className="text-3xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
            
            {/* Filter Section */}
            <div className="flex items-center gap-4">
                <label htmlFor="status-filter" className="text-lg font-medium text-gray-700">Lọc theo Trạng thái:</label>
                <select 
                    id="status-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="ALL">Tất cả</option>
                    {allStatusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
            {/* End Filter Section */}

            {orders.length === 0 && !loading && (
                <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                    <p>Không có đơn hàng nào khớp với trạng thái "{filterStatus}".</p>
                </div>
            )}
            
            <div className="space-y-6">
                {orders.map(order => {
                    const { color, icon } = getStatusAppearance(order.status);
                    const isFinalStatus = order.status === 'DELIVERED' || order.status === 'CANCELLED';

                    return (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 mb-4">
                                <div>
                                    <h3 className="font-bold text-lg text-indigo-600">Đơn hàng #{order.id}</h3>
                                    <p className="text-sm text-gray-500">
                                        Ngày đặt: {new Date(order.orderDate).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                                <div className={`px-3 py-1 inline-flex items-center gap-2 text-sm font-medium rounded-full ${color}`}>
                                    {icon}
                                    {order.status}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h4 className="font-semibold text-gray-700">Thông tin khách hàng</h4>
                                    <p className="text-sm text-gray-600">{order.customerName}</p>
                                    <p className="text-sm text-gray-600">{order.customerPhone}</p>
                                    <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-700">Chi tiết đơn hàng</h4>
                                     {Array.isArray(order.orderItems) && order.orderItems.map(item => (
                                        <p key={item.id} className="text-sm text-gray-600">
                                            - {item.productName} (x{item.quantity})
                                        </p>
                                     ))}
                                    <p className="font-bold mt-2">Tổng tiền: {order.totalAmount.toLocaleString('vi-VN')} VNĐ</p>
                                </div>
                            </div>

                            {!isFinalStatus && (
                                <div className="pt-4 border-t flex items-center gap-3">
                                    <label htmlFor={`status-${order.id}`} className="text-sm font-medium text-gray-700">Cập nhật trạng thái:</label>
                                    <select 
                                        id={`status-${order.id}`}
                                        value={order.status} 
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        {updateStatusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminOrders;