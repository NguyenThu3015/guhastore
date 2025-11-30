import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { RiLoader4Line } from 'react-icons/ri'; 

const ArticleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        setArticle(null);

        axios.get(`http://localhost:8081/api/v1/articles/${id}`)
        .then(res => {
            setArticle(res.data);
        })
        .catch(err => {
            console.error("Lỗi tải chi tiết bài viết", err);
            setError('Lỗi! Không thể tìm thấy bài viết này.');
        })
        .finally(() => {
            setLoading(false); 
        });
    }, [id]);

    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <RiLoader4Line className="animate-spin text-4xl text-indigo-500" />
                <span className="ml-3 text-xl text-gray-600">Đang tải nội dung...</span>
            </div>
        );
    }

    
    if (error) {
        return (
            <div className="text-center p-20">
                <p className="text-2xl font-semibold text-red-600">{error}</p>
                <button 
                    onClick={() => navigate('/articles')} 
                    className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
                >
                    &larr; Quay lại Blog
                </button>
            </div>
        );
    }

    if (!article) return null; 

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden my-8">
            
            {/* Ảnh bìa bài viết */}
            {article.imageUrl && (
                <img 
                    src={`http://localhost:8081${article.imageUrl}`} 
                    alt={article.title} 
                    className="w-full h-auto max-h-[500px] object-cover" 
                />
            )}
            
            <div className="p-6 md:p-10 lg:p-12">
                
                {/* Nút quay lại */}
                <button 
                    onClick={() => navigate('/articles')} 
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-semibold mb-6 transition-colors"
                >
                    &larr; Quay lại Blog
                </button>
                
                {/* Tiêu đề */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                    {article.title}
                </h1>

                {/* Metadata */}
                <p className="text-base text-gray-500 mb-8 pb-8 border-b border-gray-200">
                    Tác giả: <span className="font-bold text-gray-700">{article.authorName || 'Admin'}</span>
                    <span className="mx-2">|</span>
                    Đăng ngày: {new Date(article.publishDate).toLocaleDateString('vi-VN')}
                </p>

                {/* Tóm tắt (Summary) */}
                <p className="text-xl md:text-2xl font-light text-gray-600 mb-8 italic border-l-4 border-indigo-200 pl-4 py-2">
                    {article.summary}
                </p>

                {/* Nội dung chính HTML */}
                <div 
                    className="prose prose-lg lg:prose-xl max-w-none" 
                    dangerouslySetInnerHTML={{ __html: article.content }} 
                />
            </div>
        </div>
    );
};

export default ArticleDetailPage;