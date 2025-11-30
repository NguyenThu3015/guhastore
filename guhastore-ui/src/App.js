// src/App.js (PHIÊN BẢN SỬA LỖI)

import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

// --- Import các Layout ---
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';

// --- Import các Component Trang ---
// (Giữ nguyên các import của bạn)
import AdminCatalogPage from './components/AdminCatalogPage'; 
import AdminInventoryPage from './components/AdminInventoryPage'; 
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import WishlistPage from './components/WishlistPage';
import ProfilePage from './components/ProfilePage';
import BlogPage from './components/BlogPage';
import ArticleDetailPage from './components/ArticleDetailPage'; 
import DashboardPage from './components/DashboardPage';
import AdminRoute from './components/AdminRoute';
import CustomerRoute from './components/CustomerRoute';
import AdminProducts from './components/AdminProducts';
import ProductForm from './components/ProductForm';
import AdminOrders from './components/AdminOrders';
import PurchaseOrderForm from './components/PurchaseOrderForm';
import AdminUsersPage from './components/AdminUsersPage';
import AdminArticlesPage from './components/AdminArticlesPage';
import ArticleForm from './components/ArticleForm';
import AdminOrderStatsPage from './components/AdminOrderStatsPage';
import { AuthProvider } from './context/AuthContext';
import PurchaseOrderDetail from './components/PurchaseOrderDetail';
import AdminPurchaseOrders from './components/AdminPurchaseOrders'; 
import AboutPage from './components/AboutPage';
// 1. IMPORT TOASTER (BẠN ĐÃ LÀM)
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    
    <AuthProvider>
      {/* Toaster nên nằm bên trong AuthProvider nếu nó cần context,
          nhưng đặt ở ngoài cùng (như tôi làm ở đây) cũng an toàn. */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000, 
        }}
      />

      {/* Phần Routes của bạn giữ nguyên */}
      <Routes>
        
        {/* === TUYẾN ĐƯỜNG ADMIN (ĐÃ SỬA LẠI CẤU TRÚC) === */}
        {/* Lớp 1: Dùng AdminRoute để bảo vệ tất cả các route bên trong nó */}
        <Route element={<AdminRoute />}>
          
          {/* Lớp 2: Dùng AdminLayout để áp dụng giao diện (có sidebar) cho tất cả các route bên trong nó */}
          <Route path="/admin" element={<AdminLayout />}>
            
            {/* Lớp 3: Các trang con sẽ được hiển thị trong vùng nội dung của AdminLayout */}
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="articles" element={<AdminArticlesPage />} />
            <Route path="articles/new" element={<ArticleForm />} />
            <Route path="articles/edit/:id" element={<ArticleForm />} />
            <Route path="statistics" element={<AdminOrderStatsPage />} />

            {/* Các route đã gộp */}
            <Route path="catalog" element={<AdminCatalogPage />} />
            <Route path="inventory" element={<AdminInventoryPage />} />
            <Route path="purchase-orders/new" element={<PurchaseOrderForm />} />
            <Route path="/admin/purchase-orders/:id" element={<PurchaseOrderDetail />} />
            <Route path="/admin/purchase-orders" element={<AdminPurchaseOrders />} />
          </Route>
        </Route>

        {/* === TUYẾN ĐƯỜNG CÔNG KHAI VÀ KHÁCH HÀNG (GIỮ NGUYÊN) === */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ProductList />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="articles" element={<BlogPage />} />
          <Route path="articles/:id" element={<ArticleDetailPage />} />
          
          <Route element={<CustomerRoute />}>
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="profile/*" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;