import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2'; 
import { RiDownload2Line } from 'react-icons/ri';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const AdminOrderStatsPage = () => {
    const [stats, setStats] = useState(null);
    const [period, setPeriod] = useState('last7days');
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false); 
    const { token } = useAuth();

    
    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8083/api/v1/admin/statistics/order-summary?period=${period}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (error) {
                console.error("Lỗi tải dữ liệu thống kê:", error);
                toast.error("Lỗi tải dữ liệu thống kê.");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token, period]);
    
    
    const handleExport = async () => {
        if (!token) {
            toast.warn("Vui lòng đăng nhập.");
            return;
        }
        setExporting(true);
        try {
            const fileName = `bao_cao_don_hang_${period}.csv`;
            
            const response = await axios.get(
                `http://localhost:8083/api/v1/admin/reports/order-summary-csv?period=${period}`, 
                {
                    headers: { 'Authorization': `Bearer ${token}` },
                    responseType: 'blob', 
                }
            );

            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            
            window.URL.revokeObjectURL(url);

            toast.success(`Xuất báo cáo thành công! Tên file: ${fileName}`);

        } catch (error) {
            console.error("Lỗi khi xuất báo cáo:", error);
            
            if (error.response && error.response.data instanceof Blob) {
                 const errorText = await error.response.data.text();
                 try {
                    const errorJson = JSON.parse(errorText);
                    toast.error(`Lỗi: ${errorJson.message || 'Không thể xuất báo cáo.'}`);
                 } catch (e) {
                      toast.error("Không thể xuất báo cáo. Lỗi định dạng server.");
                 }
            } else {
                 toast.error("Không thể xuất báo cáo. Lỗi kết nối.");
            }
        } finally {
            setExporting(false);
        }
    };
    

    
    const revenueChartData = useMemo(() => {
        if (!stats?.dataPoints) return { labels: [], datasets: [] };
        const labels = stats.dataPoints.map(p => p.timePeriod);
        return {
            labels,
            datasets: [{
                label: 'Doanh thu (VNĐ)',
                data: stats.dataPoints.map(p => p.totalRevenue),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.3
            }],
        };
    }, [stats]);

    
    const activityChartData = useMemo(() => {
        if (!stats?.dataPoints) return { labels: [], datasets: [] };
        const labels = stats.dataPoints.map(p => p.timePeriod);
        return {
            labels,
            datasets: [
                {
                    label: 'Số đơn hàng',
                    data: stats.dataPoints.map(p => p.orderCount),
                    backgroundColor: 'rgba(53, 162, 235, 0.6)',
                    borderColor: 'rgb(53, 162, 235)',
                    borderWidth: 1,
                },
                {
                    label: 'Số lượng sản phẩm bán',
                    data: stats.dataPoints.map(p => p.totalQuantitySold),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1,
                },
            ],
        };
    }, [stats]);
    
    

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


    if (loading) return <p className="p-6">Đang tải dữ liệu...</p>;
    if (!stats) return <p className="p-6">Không có dữ liệu để hiển thị.</p>;

    return (
        <div className="space-y-6 p-6"> 
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                 <h1 className="text-3xl font-bold text-gray-800">Thống kê & Báo cáo</h1>
                <div className="flex items-center gap-4">
                    <select value={period} onChange={(e) => setPeriod(e.target.value)} className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="last7days">7 ngày qua</option>
                        <option value="last30days">30 ngày qua</option>
                        <option value="thisMonth">Tháng này</option>
                        <option value="thisYear">Năm nay</option>
                    </select>
                    
                    <button 
                        onClick={handleExport}
                        disabled={exporting}
                        className={`inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                            exporting 
                                ? 'bg-indigo-400 cursor-not-allowed' 
                                : 'bg-indigo-600 hover:bg-indigo-700'
                        }`}
                    >
                        <RiDownload2Line />
                        {exporting ? 'Đang Export...' : 'Export CSV'}
                    </button>
                    
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-sm text-gray-500">Tổng Doanh thu</p>
                    <p className="text-3xl font-bold text-gray-800">{new Intl.NumberFormat('vi-VN').format(stats.summary.totalRevenue)} VNĐ</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-sm text-gray-500">Tổng Đơn hàng</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.summary.totalOrderCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-sm text-gray-500">Tổng Sản phẩm Bán ra</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.summary.totalQuantitySold}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Phân tích Doanh thu</h2>
                    <Line options={commonTooltipOptions} data={revenueChartData} />
                </div>

                
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Phân tích Hoạt động</h2>
                    <Bar options={commonTooltipOptions} data={activityChartData} />
                </div>
            </div>
        </div>
    );
};

export default AdminOrderStatsPage;