import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { RiAddLine, RiArrowDownSLine } from 'react-icons/ri';
import toast from 'react-hot-toast';

const StatusDropdown = ({ status, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isPublished = status === 'PUBLISHED';

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1
                    ${isPublished 
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 focus:ring-green-500' 
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 focus:ring-gray-500'}
                `}
            >
                <span className={`w-2 h-2 rounded-full ${isPublished ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span className="min-w-[80px] text-left">{isPublished ? 'Đã xuất bản' : 'Bản nháp'}</span>
                <RiArrowDownSLine className={`text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : 'text-opacity-70'}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                    <div className="py-1">
                        <button
                            onClick={() => { onChange('PUBLISHED'); setIsOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center gap-2 hover:bg-green-50 transition-colors
                                ${isPublished ? 'text-green-700 bg-green-50' : 'text-gray-700'}
                            `}
                        >
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Đã xuất bản
                        </button>
                        <button
                            onClick={() => { onChange('DRAFT'); setIsOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors
                                ${!isPublished ? 'text-gray-900 bg-gray-100' : 'text-gray-700'}
                            `}
                        >
                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                            Bản nháp
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


const AdminArticlesPage = () => {
    const [articles, setArticles] = useState([]);
    // const [message, setMessage] = useState(''); // Biến này chưa dùng, có thể bỏ nếu không cần
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);

    const fetchArticles = () => {
        if (!token) return;
        setLoading(true);
        axios.get('http://localhost:8081/api/v1/admin/articles', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => setArticles(res.data))
        .catch(err => console.error("Lỗi tải bài viết", err))
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!token) return;
        fetchArticles();
    }, [token]);

    const handleChangeStatus = (articleId, newStatus) => {
        const statusUpdatePromise = axios.put(
            `http://localhost:8081/api/v1/admin/articles/${articleId}/status`,
            { status: newStatus },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        toast.promise(statusUpdatePromise, {
            loading: 'Đang cập nhật trạng thái...',
            success: (res) => {
                setArticles(articles.map(article =>
                    article.id === articleId ? { ...article, status: newStatus } : article
                ));
                return 'Cập nhật thành công!';
            },
            error: 'Lỗi! Không thể cập nhật.'
        });
    };

    const handleDelete = (id) => {
        if (!token || !window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
        axios.delete(`http://localhost:8081/api/v1/admin/articles/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(() => fetchArticles())
        .catch(err => console.error("Lỗi xóa", err));
    };
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Quản lý Bài viết</h1>
                <Link to="/admin/articles/new">
                     <button className="inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <RiAddLine className="text-lg" />
                        Viết bài mới
                    </button>
                </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md min-h-[400px]">
                <div className="overflow-visible">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiêu đề</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đăng</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {articles.map(article => (
                                <tr key={article.id} className="hover:bg-gray-50 group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 align-middle">#{article.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium align-middle">{article.title}</td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-left align-middle">
                                        <StatusDropdown 
                                            status={article.status} 
                                            onChange={(newVal) => handleChangeStatus(article.id, newVal)}
                                        />
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-middle">
                                        {article.publishDate ? new Date(article.publishDate).toLocaleDateString('vi-VN') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-middle">
                                        <div className="flex items-center justify-end gap-4">
                                            <Link to={`/admin/articles/edit/${article.id}`} className="text-indigo-600 hover:text-indigo-900 font-semibold transition-colors">Sửa</Link>
                                            <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-900 font-semibold transition-colors">Xóa</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminArticlesPage;