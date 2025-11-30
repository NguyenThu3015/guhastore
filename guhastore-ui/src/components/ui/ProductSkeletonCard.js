import React from 'react';

const ProductSkeletonCard = () => (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="w-full h-48 bg-gray-300 rounded-md mb-4"></div>
        <div className="h-6 w-3/4 bg-gray-300 rounded mb-2"></div>
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
        <div className="h-8 w-1/3 bg-gray-300 rounded"></div>
    </div>
);

export default ProductSkeletonCard;
