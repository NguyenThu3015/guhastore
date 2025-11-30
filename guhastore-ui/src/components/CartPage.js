import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';



const CART_API_URL = 'http://localhost:8083/api/v1/cart';
const PRODUCT_API_URL = 'http://localhost:8081/api/v1/products';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    
    const fetchCartItems = useCallback(async () => {
        if (!token) {
            setError('Bạn cần đăng nhập để xem giỏ hàng.');
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        setError(null);

        try {
            const cartResponse = await axios.get(CART_API_URL, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const items = cartResponse.data;
            if (items.length === 0) {
                setCartItems([]);
                setIsLoading(false);
                return;
            }

            // Lấy thông tin chi tiết từng sản phẩm
            const productPromises = items.map(item =>
                axios.get(`${PRODUCT_API_URL}/${item.productId}`)
            );
            
            const productResults = await Promise.allSettled(productPromises);

            const validCartItems = [];
            productResults.forEach((result, index) => {
                const cartItem = items[index];
                if (result.status === 'fulfilled') {
                    validCartItems.push({ ...cartItem, product: result.value.data });
                } else {
                    // Nếu không lấy được thông tin sản phẩm (đã bị xóa), tự động xóa khỏi giỏ
                    console.warn(`Sản phẩm (ID: ${cartItem.productId}) không còn. Tự động xóa khỏi giỏ.`);
                    axios.delete(`${CART_API_URL}/${cartItem.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
            });
            setCartItems(validCartItems);
        } catch (err) {
            console.error('Lỗi khi lấy giỏ hàng!', err);
            setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]); 

    const handleDelete = async (cartItemId) => {
        const originalCart = [...cartItems];
        setCartItems(currentItems => currentItems.filter(item => item.id !== cartItemId));
        try {
            await axios.delete(`${CART_API_URL}/${cartItemId}`, { headers: { 'Authorization': `Bearer ${token}` } });
        } catch (err) {
            console.error('Lỗi khi xóa item!', err);
            setError('Lỗi! Không thể xóa sản phẩm.');
            setCartItems(originalCart);
        }
    };
    
    const handleUpdateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        const originalCart = [...cartItems];
        setCartItems(currentItems =>
            currentItems.map(item => item.id === cartItemId ? { ...item, quantity: newQuantity } : item)
        );
        try {
            await axios.put(`${CART_API_URL}/update/${cartItemId}?quantity=${newQuantity}`, null, { headers: { 'Authorization': `Bearer ${token}` } });
        } catch (err) {
            console.error('Lỗi khi cập nhật số lượng!', err);
            setError('Lỗi! Không thể cập nhật số lượng.');
            setCartItems(originalCart);
        }
    };

    const totalPrice = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }, [cartItems]);

    
    if (isLoading) {
        return <div className="text-center text-gray-500 py-10">Đang tải giỏ hàng...</div>;
    }

    if (error) {
        return <div className="max-w-md mx-auto my-10 p-4 text-center text-red-800 bg-red-100 border border-red-300 rounded-lg">{error}</div>;
    }

    if (cartItems.length === 0) {
        return <div className="text-center text-gray-500 py-10">Giỏ hàng của bạn đang trống.</div>;
    }

    
    return (
        <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 pb-4 border-b-2 border-gray-100">
                Giỏ hàng của bạn
            </h2>
            
            <div className="space-y-6">
                {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-6 py-4 border-b border-gray-200 last:border-b-0">
                        <img 
                            src={`http://localhost:8081${item.product.imageUrl}`} 
                            alt={item.product.name} 
                            className="w-28 h-28 object-cover rounded-md border border-gray-200"
                        />
                        
                        <div className="flex-grow">
                            <h4 className="text-lg font-semibold text-gray-900">{item.product.name}</h4>
                            <p className="text-base font-bold text-indigo-600 my-1">{item.product.price.toLocaleString('vi-VN')} VNĐ</p>
                            
                            <div className="flex items-center gap-3 mt-3">
                                <button 
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-600 bg-gray-100 rounded-full transition hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    -
                                </button>
                                <span className="text-lg font-medium text-gray-800 w-8 text-center">{item.quantity}</span>
                                <button 
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                    className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-600 bg-gray-100 rounded-full transition hover:bg-gray-200"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => handleDelete(item.id)} 
                            title="Xóa sản phẩm"
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 pt-6 border-t-2 border-gray-200 flex justify-between items-center">
                <div className="text-xl font-bold text-gray-800">
                    <span>Tổng cộng: </span>
                    <span className="text-indigo-700">{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <Link to="/checkout" className="px-6 py-3 text-base font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:scale-105">
                    Tiến hành Thanh toán
                </Link>
            </div>
        </div>
    );
};

export default CartPage;