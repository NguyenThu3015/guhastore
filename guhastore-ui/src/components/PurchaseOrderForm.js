import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 
import './PurchaseOrderForm.css';

const PurchaseOrderForm = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    // State cho thông tin phiếu nhập
    const [supplierName, setSupplierName] = useState('');
    const [supplierPhone, setSupplierPhone] = useState('');
    const [notes, setNotes] = useState('');

    // State danh sách tất cả sản phẩm để chọn
    const [allProducts, setAllProducts] = useState([]);
    
    // State danh sách các item đã thêm vào phiếu
    const [itemsInOrder, setItemsInOrder] = useState([]);
    
    // State cho item đang được chọn/nhập liệu hiện tại
    const [currentItem, setCurrentItem] = useState({
        productId: '',
        productName: '',
        quantity: 1,
        importPrice: 0
    });
    
    // Load danh sách sản phẩm khi component mount
    useEffect(() => {
        axios.get('http://localhost:8081/api/v1/products')
            .then(res => setAllProducts(res.data))
            .catch(err => {
                console.error("Lỗi tải sản phẩm", err);
                toast.error('Không thể tải danh sách sản phẩm!');
            });
    }, []);

    // Xử lý thêm item vào danh sách tạm
    const handleAddItem = () => {
        if (!currentItem.productId || currentItem.quantity <= 0 || currentItem.importPrice <= 0) {
            // Sửa lỗi phông: Vui lòng chọn sản phẩm, nhập số lượng và giá nhập hợp lý.
            toast.error('Vui lòng chọn sản phẩm, nhập số lượng và giá nhập hợp lý.');
            return;
        }

        // Kiểm tra xem sản phẩm đã có trong danh sách chưa
        const isExisting = itemsInOrder.some(item => item.productId === currentItem.productId);
        if (isExisting) {
            toast.error('Sản phẩm này đã được thêm vào phiếu.');
            return;
        }
        
        setItemsInOrder([...itemsInOrder, currentItem]);
        toast.success(`Đã thêm: ${currentItem.productName}`);
        
        // Reset form nhập liệu item
        setCurrentItem({ productId: '', productName: '', quantity: 1, importPrice: 0 });
    };
    
    // Xử lý submit phiếu nhập lên server
    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (itemsInOrder.length === 0) {
            toast.error('Bạn phải thêm ít nhất 1 sản phẩm vào phiếu nhập.');
            return;
        }
        
        const requestBody = {
            supplierName: supplierName,
            supplierPhone: supplierPhone,
            notes: notes,
            items: itemsInOrder.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                importPrice: item.importPrice
            }))
        };

        // Gọi API tạo Purchase Order
        const submitPromise = axios.post('http://localhost:8081/api/v1/admin/purchase-orders', requestBody, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        toast.promise(submitPromise, {
            loading: 'Đang tạo phiếu nhập...',
            success: (res) => {
                // Chuyển hướng sau khi thành công
                setTimeout(() => navigate('/admin/inventory'), 1500);
                return 'Tạo phiếu nhập thành công!';
            },
            error: (err) => {
                console.error("Lỗi tạo phiếu nhập", err);
                return 'Lỗi! Không thể tạo phiếu nhập.';
            }
        });
    };

    // Xử lý khi chọn sản phẩm từ dropdown
    const handleProductSelect = (e) => {
        const productId = e.target.value;
        const selectedOption = e.target.options[e.target.selectedIndex];
        const productName = selectedOption ? selectedOption.text : '';
        setCurrentItem({ ...currentItem, productId, productName });
    };

    // Xóa item khỏi danh sách tạm
    const handleRemoveItem = (indexToRemove) => {
        setItemsInOrder(itemsInOrder.filter((_, index) => index !== indexToRemove));
        toast.success('Đã xóa sản phẩm khỏi phiếu.');
    };

    // Tính tổng tiền
    const totalAmount = itemsInOrder.reduce((total, item) => total + (item.quantity * item.importPrice), 0);

    return (
        <div className="purchase-form-layout">
            
            {/* Phần bên trái: Thông tin phiếu và danh sách item */}
            <div className="form-main">
                <h3>Thông tin Phiếu Nhập Kho</h3>
                <form onSubmit={handleSubmitOrder} className="info-form">
                    <div className="form-group">
                        <label>Tên nhà cung cấp:</label>
                        <input type="text" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} required className="form-input"/>
                    </div>
                    <div className="form-group">
                        <label>SĐT nhà cung cấp:</label>
                        <input type="text" value={supplierPhone} onChange={(e) => setSupplierPhone(e.target.value)} className="form-input"/>
                    </div>
                    <div className="form-group">
                        <label>Ghi chú:</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="form-input" rows="3"/>
                    </div>

                    <h4>Chi tiết sản phẩm nhập</h4>
                    <table className="items-table">
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Đơn giá nhập</th>
                                <th>Thành tiền</th>
                                <th>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemsInOrder.length > 0 ? itemsInOrder.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.productName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.importPrice.toLocaleString('vi-VN')} VNĐ</td>
                                    <td>{(item.quantity * item.importPrice).toLocaleString('vi-VN')} VNĐ</td>
                                    <td><button type="button" onClick={() => handleRemoveItem(index)} className="btn-remove">X</button></td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Chưa có sản phẩm nào</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" style={{textAlign: 'right', fontWeight: 'bold'}}>Tổng cộng:</td>
                                <td colSpan="2" style={{fontWeight: 'bold', fontSize: '1.2em'}}>
                                    {totalAmount.toLocaleString('vi-VN')} VNĐ
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                    
                    <button type="submit" className="btn-submit">
                        Hoàn Thành và Tạo Phiếu Nhập
                    </button>
                </form>
            </div>

            {/* Phần bên phải: Form thêm sản phẩm */}
            <div className="form-sidebar">
                <h4>Thêm Sản phẩm vào Phiếu</h4>
                <div className="form-group">
                    <label>Sản phẩm:</label>
                    <select value={currentItem.productId} onChange={handleProductSelect} required className="form-input">
                        <option value="">-- Chọn sản phẩm --</option>
                        {allProducts.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Số lượng nhập:</label>
                    <input 
                        type="number" 
                        min="1"
                        value={currentItem.quantity} 
                        onChange={(e) => setCurrentItem({...currentItem, quantity: parseInt(e.target.value) || 1})} 
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label>Giá nhập (VNĐ) / 1 sản phẩm:</label>
                    <input 
                        type="number" 
                        min="0"
                        value={currentItem.importPrice} 
                        onChange={(e) => setCurrentItem({...currentItem, importPrice: parseFloat(e.target.value) || 0})} 
                        className="form-input"
                    />
                </div>

                <button onClick={handleAddItem} className="btn-add">
                    Thêm vào phiếu
                </button>
            </div>
        </div>
    );
};

export default PurchaseOrderForm;