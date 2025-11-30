import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import OrderSuccess from './OrderSuccess'; 
import { RiLoader4Line } from 'react-icons/ri'; 

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [status, setStatus] = useState({ loading: true, error: null, success: false });
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        customerName: user?.fullName || '',
        customerPhone: '',
        shippingAddress: ''
    });

    useEffect(() => {
        const fetchCheckoutData = async () => {
            if (!token) { navigate('/login'); return; }

            try {
                const cartResponse = await axios.get('http://localhost:8083/api/v1/cart', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const items = cartResponse.data;

                if (items.length === 0) {
                    setStatus({ loading: false, error: 'Giỏ hàng trống, không thể thanh toán.', success: false });
                    setTimeout(() => navigate('/cart'), 2000);
                    return;
                }
                
                const productPromises = items.map(item =>
                    axios.get(`http://localhost:8081/api/v1/products/${item.productId}`)
                );
                const productResults = await Promise.allSettled(productPromises);
                
                const validItems = [];
                let hasError = false;
                productResults.forEach((result, index) => {
                    const cartItem = items[index];
                    if (result.status === 'fulfilled') {
                        validItems.push({ ...cartItem, product: result.value.data });
                    } else {
                        hasError = true;
                        axios.delete(`http://localhost:8083/api/v1/cart/${cartItem.id}`, { headers: { 'Authorization': `Bearer ${token}` } });
                    }
                });

                if (hasError) {
                    setStatus({ loading: false, error: 'Một số sản phẩm không còn tồn tại và đã bị xóa. Vui lòng quay lại giỏ hàng.', success: false });
                    setTimeout(() => navigate('/cart'), 3000);
                    return;
                }

                setCartItems(validItems);
                setStatus({ loading: false, error: null, success: false });
            } catch (err) {
                setStatus({ loading: false, error: 'Lỗi tải dữ liệu thanh toán.', success: false });
                console.error('Lỗi tải checkout data', err);
            }
        };
        fetchCheckoutData();
    }, [token, navigate]);

    
    const totalAmount = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }, [cartItems]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

     const handleSubmit = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            setStatus({ loading: false, error: 'Giỏ hàng của bạn đang trống.', success: false });
            return;
        }

        setStatus({ loading: true, error: null, success: false });

        
        
        const payload = {
            
            customerName: formData.customerName,
            customerPhone: formData.customerPhone,
            shippingAddress: formData.shippingAddress,
            
            
            
            orderItems: cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity
            }))
        };

        try {
            
            await axios.post('http://localhost:8083/api/v1/checkout', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setStatus({ loading: false, error: null, success: true });

        } catch (error) {
            console.error('Lỗi khi checkout!', error);
            
            const errorMessage = error.response?.data?.message || 'Lỗi! Không thể đặt hàng.';
            setStatus({ loading: false, error: errorMessage, success: false });
        }
    };

    if (status.success) {
        return <OrderSuccess />;
    }

    const inputStyle = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition";

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Thanh Toán</h2>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                
                <div className="lg:col-span-3">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-4">Thông tin giao hàng</h3>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Tên người nhận</label>
                            <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} required className={inputStyle} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                            <input type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleChange} required className={inputStyle} />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Địa chỉ giao hàng</label>
                            <textarea name="shippingAddress" value={formData.shippingAddress} onChange={handleChange} required rows="3" className={inputStyle}></textarea>
                        </div>
                        {status.error && <p className="text-sm text-center text-red-600">{status.error}</p>}
                        <button type="submit" disabled={status.loading || cartItems.length === 0}
                            className="w-full mt-4 flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                            {status.loading && <RiLoader4Line className="animate-spin" />}
                            {status.loading ? 'Đang xử lý...' : 'Xác nhận Đặt hàng'}
                        </button>
                    </form>
                </div>

                
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">Tóm tắt đơn hàng</h3>
                        {status.loading && !status.error ? (
                            <div className="space-y-4 animate-pulse">
                                <div className="flex items-center gap-4"><div className="w-16 h-16 bg-gray-200 rounded"></div><div className="flex-grow h-6 bg-gray-200 rounded"></div></div>
                                <div className="flex items-center gap-4"><div className="w-16 h-16 bg-gray-200 rounded"></div><div className="flex-grow h-6 bg-gray-200 rounded"></div></div>
                                <div className="h-8 w-1/2 bg-gray-300 rounded ml-auto mt-4"></div>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <img src={`http://localhost:8081${item.product.imageUrl}`} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-gray-800 line-clamp-1">{item.product.name}</p>
                                                <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-gray-700">{(item.product.price * item.quantity).toLocaleString('vi-VN')} VNĐ</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t flex justify-between items-center text-lg font-bold">
                                    <span className="text-gray-800">Tổng cộng:</span>
                                    <span className="text-red-600">{totalAmount.toLocaleString('vi-VN')} VNĐ</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;