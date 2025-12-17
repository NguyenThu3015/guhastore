import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { RiSearchLine, RiFilter3Fill, RiArrowDownSLine, RiRestartLine } from 'react-icons/ri';

// --- HOOK DEBOUNCE (Giữ nguyên) ---
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

// --- COMPONENT CON: ACCORDION (Để đóng mở mượt mà) ---
const FilterSection = ({ title, children, isOpenDefault = true }) => {
    const [isOpen, setIsOpen] = useState(isOpenDefault);

    return (
        <div className="border-b border-gray-100 py-4 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center justify-between w-full text-left group"
            >
                <span className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {title}
                </span>
                <RiArrowDownSLine 
                    className={`text-gray-400 text-lg transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
                {children}
            </div>
        </div>
    );
};

const FilterSidebar = ({ categories, brands, onApplyFilters }) => {
    // --- STATE ---
    const [filters, setFilters] = useState({
        search: '',
        categoryId: '',
        brandId: '',
        minPrice: 0,
        maxPrice: 50000000,
    });
    const [priceRange, setPriceRange] = useState([0, 50000000]);

    const debouncedFilters = useDebounce(filters, 500);

    // --- EFFECT ---
    useEffect(() => {
        onApplyFilters(debouncedFilters);
    }, [debouncedFilters, onApplyFilters]);

    // --- HANDLERS ---
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
        setFilters({ search: '', categoryId: '', brandId: '', minPrice: 0, maxPrice: 50000000 });
        setPriceRange([0, 50000000]);
    };

    // Format tiền tệ
    const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    return (
        <>
            {/* CSS Custom Scrollbar */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            `}</style>

            <aside className="w-full md:w-72 flex-shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* HEADER */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                        <RiFilter3Fill className="text-indigo-600" />
                        <h3>Bộ lọc</h3>
                    </div>
                    <button 
                        onClick={resetFilters} 
                        className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                    >
                        <RiRestartLine /> Xóa tất cả
                    </button>
                </div>

                <div className="p-5 space-y-2">
                    {/* 1. SEARCH */}
                    <div className="mb-6 relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <RiSearchLine className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleInputChange}
                            placeholder="Tìm tên sản phẩm..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                        />
                    </div>

                    {/* 2. PRICE RANGE */}
                    <FilterSection title="Khoảng giá" isOpenDefault={true}>
                        <div className="px-2 pb-2">
                            <Slider
                                range
                                min={0}
                                max={50000000}
                                step={100000}
                                value={priceRange}
                                onChange={handlePriceChange}
                                onAfterChange={handleAfterPriceChange}
                                trackStyle={[{ backgroundColor: '#4F46E5', height: 4 }]}
                                handleStyle={[
                                    { borderColor: '#4F46E5', backgroundColor: '#FFF', opacity: 1, borderWidth: 2, height: 18, width: 18, marginTop: -7 },
                                    { borderColor: '#4F46E5', backgroundColor: '#FFF', opacity: 1, borderWidth: 2, height: 18, width: 18, marginTop: -7 }
                                ]}
                                railStyle={{ backgroundColor: '#E2E8F0', height: 4 }}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-4 gap-2">
                            <div className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs font-medium text-gray-600 w-full text-center">
                                {formatCurrency(priceRange[0])}
                            </div>
                            <span className="text-gray-400">-</span>
                            <div className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs font-medium text-gray-600 w-full text-center">
                                {formatCurrency(priceRange[1])}
                            </div>
                        </div>
                    </FilterSection>

                    {/* 3. CATEGORIES */}
                    <FilterSection title="Danh mục" isOpenDefault={true}>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            {categories.map(cat => (
                                <label key={cat.id} className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-1.5 rounded-md transition-colors">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.categoryId === cat.id}
                                            onChange={() => handleCheckboxChange('categoryId', cat.id)}
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-indigo-600 checked:bg-indigo-600 focus:ring-offset-0 focus:ring-0 transition-all"
                                        />
                                        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className={`text-sm ${filters.categoryId === cat.id ? 'font-semibold text-indigo-700' : 'text-gray-600'}`}>
                                        {cat.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    {/* 4. BRANDS */}
                    <FilterSection title="Thương hiệu" isOpenDefault={true}>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            {brands.map(brand => (
                                <label key={brand.id} className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-1.5 rounded-md transition-colors">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={filters.brandId === brand.id}
                                            onChange={() => handleCheckboxChange('brandId', brand.id)}
                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:border-indigo-600 checked:bg-indigo-600 focus:ring-offset-0 focus:ring-0 transition-all"
                                        />
                                        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className={`text-sm ${filters.brandId === brand.id ? 'font-semibold text-indigo-700' : 'text-gray-600'}`}>
                                        {brand.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                </div>
            </aside>
        </>
    );
};

export default FilterSidebar;