import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import OrderSkeletonCard from './ui/OrderSkeletonCard'; 

const StatusBadge = ({ status }) => {
    const statusStyles = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        SHIPPED: 'bg-blue-100 text-blue-800',
        DELIVERED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800',
    };
    const statusText = {
        PENDING: 'Chờ xử lý',
        SHIPPED: 'Đang vận chuyển',
        DELIVERED: 'Đã giao hàng',
        CANCELLED: 'Đã hủy',
    };

    return (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {statusText[status] || status}
        </span>
    );
};

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState({ loading: true, error: null });
    const [confirmingId, setConfirmingId] = useState(null); 
    const { token } = useAuth();

    const fetchOrders = useCallback(() => {
        if (!token) {
            setStatus({ loading: false, error: 'Bạn cần đăng nhập để xem lịch sử.' });
            return;
        }
        setStatus({ loading: true, error: null });
        axios.get('http://localhost:8083/api/v1/orders', { headers: { 'Authorization': `Bearer ${token}` } })
            .then(response => {
                // Sắp xếp đơn hàng mới nhất lên đầu
                const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders);
            })
            .catch(error => {
                console.error('Lỗi khi lấy lịch sử đơn hàng!', error);
                setStatus({ loading: false, error: 'Không thể tải lịch sử đơn hàng.' });
            })
            .finally(() => {
                setStatus(prev => ({ ...prev, loading: false }));
            });
    }, [token]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleConfirmDelivery = (orderId) => {
        if (!token) return;
        setConfirmingId(orderId); 
        
        axios.put(`http://localhost:8083/api/v1/orders/${orderId}/confirm-delivery`, null, { 
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(() => {
            // Cập nhật trạng thái cục bộ để không cần reload lại trang
            setOrders(currentOrders => 
                currentOrders.map(order => 
                    order.id === orderId ? { ...order, status: "DELIVERED" } : order
                )
            );
        })
        .catch(error => {
            console.error('Lỗi khi xác nhận đơn hàng!', error);
            alert('Lỗi! Không thể xác nhận.'); 
        })
        .finally(() => {
            setConfirmingId(null); 
        });
    };

    if (status.loading) {
        return (
            <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => <OrderSkeletonCard key={index} />)}
            </div>
        );
    }
    
    if (status.error) {
        return <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg">{status.error}</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-700">Bạn chưa có đơn hàng nào</h3>
                <p className="text-gray-500 mt-2">Hãy bắt đầu mua sắm để xem lịch sử đơn hàng của bạn tại đây!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {orders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg">
                    {/* Header đơn hàng */}
                    <div className="p-4 bg-gray-50 border-b flex flex-wrap justify-between items-center gap-2">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">Đơn hàng #{order.id}</h3>
                            <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.orderDate).toLocaleString('vi-VN')}</p>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>
                    
                    {/* Chi tiết body */}
                    <div className="p-4">
                        <div className="mb-4">
                            <p className="font-semibold text-gray-700">Địa chỉ giao hàng:</p>
                            <p className="text-gray-600">{order.customerName} - {order.shippingAddress}</p>
                        </div>

                        <h4 className="font-semibold text-gray-700 mb-2">Chi tiết sản phẩm:</h4>
                        <div className="space-y-2">
                            {Array.isArray(order.orderItems) && order.orderItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-800">{item.productName} (x{item.quantity})</span>
                                    <span className="text-gray-600 font-medium">{item.price.toLocaleString('vi-VN')} VNĐ</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer đơn hàng */}
                    <div className="p-4 bg-gray-50 flex justify-between items-center">
                        <div className="font-bold text-lg text-gray-800">
                            <span>Tổng tiền: </span>
                            <span className="text-red-600">{order.totalAmount.toLocaleString('vi-VN')} VNĐ</span>
                        </div>

                        {order.status === 'SHIPPED' && (
                            <button 
                                onClick={() => handleConfirmDelivery(order.id)}
                                disabled={confirmingId === order.id}
                                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm
                                             hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-wait"
                            >
                                {confirmingId === order.id ? 'Đang xác nhận...' : 'Đã nhận được hàng'}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderHistoryPage;