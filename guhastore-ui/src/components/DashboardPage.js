import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend,Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2'; 
import { RiShoppingBag3Line, RiUserAddLine, RiArchiveLine, RiFileList3Line, RiMoneyDollarCircleLine } from 'react-icons/ri';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);


const StatCard = ({ icon, title, value, detail, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6">
        <div className={`text-3xl p-4 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-400">{detail}</p>
        </div>
    </div>
);

const DashboardPage = () => {
    
    const [pendingOrders, setPendingOrders] = useState(0);
    const [newUsers, setNewUsers] = useState(0);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [orderStats, setOrderStats] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [revenueData, setRevenueData] = useState(null); 
    
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    
    useEffect(() => {
        if (!token) return;

        const fetchDashboardData = async () => {
            setLoading(true);
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            
            
            const urlRevenueSummary = 'http://localhost:8083/api/v1/admin/statistics/order-summary?period=last7days';

            
            const urlPendingOrders = 'http://localhost:8083/api/v1/admin/statistics/pending-count';
            const urlOrderStats = 'http://localhost:8083/api/v1/admin/statistics/order-counts';
            const urlTopProducts = 'http://localhost:8083/api/v1/admin/statistics/top-products?limit=5';
            const urlLowStock = 'http://localhost:8081/api/v1/admin/statistics/low-stock?threshold=20';
            const endDate = new Date().toISOString();
            const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
            const urlNewUsers = `http://localhost:8082/api/v1/admin/statistics/new-users-count?start=${startDate}&end=${endDate}`;

            
            const [
                pendingRes,
                statsRes,
                lowStockRes,
                newUsersRes,
                topProductsRes,
                revenueSummaryRes 
            ] = await Promise.allSettled([
                axios.get(urlPendingOrders, config),
                axios.get(urlOrderStats, config),
                axios.get(urlLowStock, config),
                axios.get(urlNewUsers, config),
                axios.get(urlTopProducts, config),
                axios.get(urlRevenueSummary, config) 
            ]);

            
            if (pendingRes.status === 'fulfilled') setPendingOrders(pendingRes.value.data.pendingCount);
            if (statsRes.status === 'fulfilled') setOrderStats(statsRes.value.data);
            if (lowStockRes.status === 'fulfilled') setLowStockProducts(lowStockRes.value.data);
            if (newUsersRes.status === 'fulfilled') setNewUsers(newUsersRes.value.data.newUsersCount);
            if (topProductsRes.status === 'fulfilled') setTopProducts(topProductsRes.value.data);
            
            
            if (revenueSummaryRes.status === 'fulfilled' && revenueSummaryRes.value.data.dataPoints) {
                const dailyDataPoints = revenueSummaryRes.value.data.dataPoints;
                
                const weekLabels = dailyDataPoints.map(p => p.timePeriod);
                const dailyData = dailyDataPoints.map(p => p.totalRevenue);
                
                setRevenueData({
                    labels: weekLabels,
                    datasets: [{
                        label: 'Doanh thu (VNĐ)',
                        data: dailyData,
                        fill: true,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.1
                    }]
                });
            } else {
                 
                 setRevenueData({ labels: [], datasets: [] });
            }

            setLoading(false);
        };

        fetchDashboardData();
    }, [token]);

    
    
    
    const commonTooltipOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) {
                           if (context.dataset.label.includes('Doanh thu')) {
                                
                                label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y);
                           } else {
                                label += context.parsed.y; 
                           }
                        }
                        return label;
                    }
                }
            }
        }
    };
    
    
    const orderStatusData = useMemo(() => ({
        labels: orderStats.map(s => s.status),
        datasets: [{
            label: 'Số lượng đơn hàng',
            data: orderStats.map(s => s.count),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
    }), [orderStats]);

    const topProductsData = useMemo(() => ({
        labels: topProducts.map(p => `ID: ${p.productId}`), 
        datasets: [{
            label: 'Số lượng đã bán',
            data: topProducts.map(p => p.totalSold),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
    }), [topProducts]);
    const StatCard = ({ icon, title, value, detail, color, linkTo }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6 relative group transition-transform hover:scale-[1.02]">
        <div className={`text-3xl p-4 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-400">{detail}</p>
            
            {/* Link Xem chi tiết (chỉ hiện khi có linkTo) */}
            {linkTo && (
                <Link to={linkTo} className="absolute inset-0" aria-label={`Xem chi tiết ${title}`}>
                   {/* Link bao phủ toàn bộ card để bấm đâu cũng được */}
                </Link>
            )}
        </div>
        
        {/* Icon mũi tên nhỏ hiện ra khi hover (Optional UI) */}
        {linkTo && (
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                ↗
            </div>
        )}
    </div>
);

    if (loading || !revenueData) return <p className="p-6">Đang tải dữ liệu Dashboard...</p>; 

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Tổng quan</h1>
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <StatCard icon={<RiFileList3Line />} title="Đơn hàng đang chờ" value={pendingOrders} detail="Cần xử lý ngay" color="bg-orange-100 text-orange-600" linkTo="/admin/orders"    />
                <StatCard icon={<RiUserAddLine />} title="Khách hàng mới" value={newUsers} detail="Trong 30 ngày qua" color="bg-blue-100 text-blue-600" />
                <StatCard icon={<RiArchiveLine />} title="Sản phẩm sắp hết" value={lowStockProducts.length} detail="Số lượng tồn kho < 20" color="bg-red-100 text-red-600" linkTo="/admin/inventory" />
            </div>

            {/* Main Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Phân tích Doanh thu (7 ngày gần nhất)</h2>
                    <Line options={commonTooltipOptions} data={revenueData} /> 
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Tình trạng Đơn hàng (Tổng)</h2>
                    <Doughnut data={orderStatusData} />
                </div>
            </div>

            {/* Main Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Top 5 Sản phẩm Bán chạy</h2>
                    <Bar options={{ ...commonTooltipOptions, indexAxis: 'y' }} data={topProductsData} />
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Sản phẩm sắp hết hàng</h2>
                    <ul className="space-y-3 overflow-y-auto max-h-60">
                        {lowStockProducts.length > 0 ? (
                            lowStockProducts.map(p => (
                                <li key={p.id} className="flex justify-between items-center text-sm">
                                    <span>{p.name}</span>
                                    <span className="font-bold text-red-600">Còn lại: {p.stockQuantity}</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">Không có sản phẩm nào sắp hết hàng.</p>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;