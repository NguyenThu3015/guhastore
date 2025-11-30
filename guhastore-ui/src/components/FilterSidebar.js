import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; 


function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const FilterSidebar = ({ categories, brands, onApplyFilters }) => {
    
    const [filters, setFilters] = useState({
        search: '',
        categoryId: '',
        brandId: '',
        minPrice: 0,
        maxPrice: 50000000,
    });
    const [priceRange, setPriceRange] = useState([0, 50000000]);

    
    const debouncedFilters = useDebounce(filters, 500); 

    
    useEffect(() => {
        onApplyFilters(debouncedFilters);
    }, [debouncedFilters, onApplyFilters]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCheckboxChange = (type, id) => {
        setFilters(prev => ({
            ...prev,
            [type]: prev[type] === id ? '' : id 
        }));
    };

    const handlePriceChange = (value) => {
        setPriceRange(value);
    };

    const handleAfterPriceChange = (value) => {
        setFilters(prev => ({
            ...prev,
            minPrice: value[0],
            maxPrice: value[1],
        }));
    };
    
    const resetFilters = () => {
        setFilters({
            search: '', categoryId: '', brandId: '', minPrice: 0, maxPrice: 50000000
        });
        setPriceRange([0, 50000000]);
    };

    return (
        <aside className="w-full md:w-72 lg:w-80 flex-shrink-0 bg-white p-6 rounded-xl shadow-lg self-start">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Bộ lọc sản phẩm</h3>
                <button onClick={resetFilters} className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold">
                    Xóa bộ lọc
                </button>
            </div>

            <div className="space-y-6">
                {/* Search */}
                <div>
                    <label className="text-sm font-semibold text-gray-600">Tìm kiếm</label>
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleInputChange}
                        placeholder="Tên sản phẩm..."
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Price Range */}
                <div>
                    <label className="text-sm font-semibold text-gray-600">Khoảng giá</label>
                    <div className="mt-4 mx-2">
                        <Slider
                            range
                            min={0}
                            max={50000000}
                            step={100000}
                            value={priceRange}
                            onChange={handlePriceChange}
                            onAfterChange={handleAfterPriceChange}
                            trackStyle={[{ backgroundColor: '#4F46E5' }]}
                            handleStyle={[{ borderColor: '#4F46E5', backgroundColor: '#FFF', borderWidth: 2 }]}
                            railStyle={{ backgroundColor: '#E5E7EB' }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>{priceRange[0].toLocaleString('vi-VN')} đ</span>
                        <span>{priceRange[1].toLocaleString('vi-VN')} đ</span>
                    </div>
                </div>

                {/* Categories */}
                <details className="space-y-2" open>
                    <summary className="text-sm font-semibold text-gray-600 cursor-pointer">Danh mục</summary>
                    <div className="space-y-2 pt-2 max-h-40 overflow-y-auto">
                        {categories.map(cat => (
                            <label key={cat.id} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.categoryId === cat.id}
                                    onChange={() => handleCheckboxChange('categoryId', cat.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">{cat.name}</span>
                            </label>
                        ))}
                    </div>
                </details>

                {/* Brands */}
                <details className="space-y-2" open>
                    <summary className="text-sm font-semibold text-gray-600 cursor-pointer">Thương hiệu</summary>
                      <div className="space-y-2 pt-2 max-h-40 overflow-y-auto">
                        {brands.map(brand => (
                            <label key={brand.id} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.brandId === brand.id}
                                    onChange={() => handleCheckboxChange('brandId', brand.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">{brand.name}</span>
                            </label>
                        ))}
                    </div>
                </details>
            </div>
        </aside>
    );
};

export default FilterSidebar;