import React from 'react';

const OrderSkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-md animate-pulse">
        <div className="p-4 border-b flex justify-between items-center">
            <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
            <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
        </div>
        <div className="p-4 space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end items-center">
            <div className="h-8 w-1/4 bg-gray-300 rounded"></div>
        </div>
    </div>
);

export default OrderSkeletonCard;
