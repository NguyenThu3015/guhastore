import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PurchaseOrderDetail = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { token } = useAuth();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token || !id) return;

        setLoading(true);
        axios.get(`http://localhost:8081/api/v1/admin/purchase-orders/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            setOrder(res.data);
        })
        .catch(err => {
            console.error("Lỗi tải chi tiết phiếu nhập", err);
            toast.error('Không tìm thấy phiếu nhập hoặc có lỗi xảy ra.');
            navigate('/admin/purchase-orders'); 
        })
        .finally(() => {
            setLoading(false);
        });
    }, [id, token, navigate]);

    if (loading) {
        return <div className="loading-message">Đang tải chi tiết phiếu nhập...</div>;
    }

    if (!order) {
        return <div className="empty-message">Không tìm thấy thông tin cho phiếu nhập này.</div>;
    }

    return (
        <div className="order-detail-container">
            <div className="detail-header">
                <h2>Chi tiết Phiếu Nhập Kho #{order.id}</h2>
                <button onClick={() => navigate(-1)} className="btn btn-secondary">
                    &larr; Quay lại danh sách
                </button>
            </div>

            <div className="info-grid">
                <div className="info-card">
                    <h4>Thông tin chung</h4>
                    <p><strong>Ngày nhập:</strong> {new Date(order.importDate).toLocaleString('vi-VN')}</p>
                    <p><strong>Người phụ trách:</strong> {order.personInCharge}</p>
                    <p><strong>Trạng thái:</strong> <span className="status-badge status-completed">{order.status}</span></p>
                </div>
                <div className="info-card">
                    <h4>Nhà cung cấp</h4>
                    <p><strong>Tên NCC:</strong> {order.supplierName || 'Không có'}</p>
                    <p><strong>SĐT:</strong> {order.supplierPhone || 'Không có'}</p>
                </div>
                <div className="info-card info-card-full">
                     <h4>Ghi chú</h4>
                     <p>{order.notes || 'Không có ghi chú.'}</p>
                </div>
            </div>

            <div className="items-section">
                <h3>Chi tiết sản phẩm nhập</h3>
                <table className="items-table detail">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Đơn giá nhập</th>
                            <th>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.productName}</td>
                                <td>{item.quantity}</td>
                                <td>{item.importPrice.toLocaleString('vi-VN')} VNĐ</td>
                                <td>{(item.quantity * item.importPrice).toLocaleString('vi-VN')} VNĐ</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="summary-section">
                <div className="total-amount">
                    <span>Tổng cộng:</span>
                    <span>{order.totalAmount.toLocaleString('vi-VN')} VNĐ</span>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrderDetail;