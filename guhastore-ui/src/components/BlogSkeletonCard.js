import React from 'react';

const BlogSkeletonCard = () => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
            <div className="h-56 bg-gray-300"></div>
            <div className="p-6">
                <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mt-4"></div>
                <div className="space-y-2 mt-4">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
};

export default BlogSkeletonCard;
