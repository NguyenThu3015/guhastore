import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 

const AdminPurchaseOrders = () => {
    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [loading, setLoading] = useState(true); 
    const { token } = useAuth();
    const navigate = useNavigate();

    
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        axios.get('http://localhost:8081/api/v1/admin/purchase-orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            // Sắp xếp theo thời gian nhập mới nhất
            const sortedOrders = res.data.sort((a, b) => new Date(b.importDate) - new Date(a.importDate));
            setPurchaseOrders(sortedOrders);
        })
        .catch(err => {
            console.error("Lỗi tải lịch sử nhập kho", err);
            toast.error('Lỗi! Không thể tải lịch sử nhập kho.');
        })
        .finally(() => {
            setLoading(false); 
        });
    }, [token]);

    
    const handleRowClick = (id) => {
        // Điều hướng đến trang chi tiết
        navigate(`/admin/purchase-orders/${id}`);
    };

    
    const renderContent = () => {
        if (loading) {
            return <div className="loading-message">Đang tải lịch sử nhập kho...</div>;
        }

        if (purchaseOrders.length === 0) {
            return <div className="empty-message">Chưa có phiếu nhập kho nào được tạo.</div>;
        }

        return (
            <table className="history-table">
                <thead>
                    <tr>
                        <th>Mã phiếu</th>
                        <th>Thời gian</th>
                        <th>Nhà cung cấp</th>
                        <th>Người nhập</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {purchaseOrders.map(po => (
                        <tr key={po.id} onClick={() => handleRowClick(po.id)} className="clickable-row">
                            <td>#{po.id}</td>
                            <td>{new Date(po.importDate).toLocaleString('vi-VN')}</td>
                            <td>{po.supplierName || 'N/A'}</td>
                            <td>{po.personInCharge}</td>
                            <td className="total-amount">{po.totalAmount.toLocaleString('vi-VN')} VNĐ</td>
                            <td>
                                <span className="status-badge status-completed">{po.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="purchase-history-container">
            <div className="page-header">
                <h2>Lịch sử Nhập Kho</h2>
                <Link to="/admin/purchase-orders/new" className="btn btn-primary">
                    + Tạo phiếu nhập mới
                </Link>
            </div>
            
            <div className="content-area">
                {renderContent()}
            </div>
        </div>
    );
};

export default AdminPurchaseOrders;