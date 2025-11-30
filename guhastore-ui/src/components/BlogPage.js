import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BlogSkeletonCard from './BlogSkeletonCard'; 


const API_BASE_URL = 'http://localhost:8081';

const BlogPage = () => {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchArticles = useCallback(() => {
        setIsLoading(true);
        setError(null);
        
        axios.get(`${API_BASE_URL}/api/v1/articles`)
            .then(res => {
                setArticles(res.data);
            })
            .catch(err => {
                console.error("Lỗi tải bài viết", err);
                setError('Rất tiếc, đã có lỗi xảy ra. Không thể tải nội dung từ blog.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    
    const renderContent = () => {
        if (isLoading) {
            // Hiển thị Skeleton loading state
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {Array.from({ length: 6 }).map((_, index) => <BlogSkeletonCard key={index} />)}
                </div>
            );
        }

        if (error) {
            return <div className="text-center py-10 px-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;
        }

        if (articles.length === 0) {
            return <div className="text-center py-10 text-gray-500">Hiện chưa có bài viết nào được xuất bản.</div>;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {articles.map(article => (
                    <Link 
                        key={article.id} 
                        to={`/articles/${article.id}`} 
                        
                        className="group block"
                    >
                        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
                            {/* Article Image */}
                            {article.imageUrl && (
                                <div className="flex-shrink-0">
                                    <img 
                                            className="h-56 w-full object-cover" 
                                            src={`${API_BASE_URL}${article.imageUrl}`} 
                                            alt={article.title} 
                                    />
                                </div>
                            )}
                            
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-indigo-600">
                                    {article.title}
                                </h3>
                                
                                <p className="mt-2 text-sm text-gray-500">
                                    Đăng ngày: {new Date(article.publishDate).toLocaleDateString('vi-VN')}
                                </p>
                                
                                {/* Summary with truncation */}
                                <p className="mt-4 text-gray-600 text-base line-clamp-3">
                                    {article.summary}
                                </p>

                                <div className="mt-auto pt-4">
                                     <span className="font-semibold text-indigo-600 group-hover:underline">
                                        Đọc thêm &rarr;
                                     </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-gray-50 py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Góc Chia Sẻ | <span className="text-indigo-600">GuHaStore</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                        Khám phá những câu chuyện, mẹo vặt và kiến thức thú vị từ thế giới của chúng tôi.
                    </p>
                </div>
                
                {/* Blog Grid */}
                {renderContent()}
            </div>
        </div>
    );
};

export default BlogPage;