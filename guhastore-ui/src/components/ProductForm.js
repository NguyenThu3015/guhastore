import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast'; 

const ProductForm = () => {
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        brandId: '',
        categoryId: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Load danh mục và thương hiệu
        axios.get('http://localhost:8081/api/v1/brands').then(res => setBrands(res.data));
        axios.get('http://localhost:8081/api/v1/categories').then(res => setCategories(res.data));

        if (isEditing) {
            const promise = axios.get(`http://localhost:8081/api/v1/products/${id}`)
                .then(res => {
                    const product = res.data;
                    setFormData({
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        stockQuantity: product.stockQuantity,
                        brandId: product.brand.id,
                        categoryId: product.category.id
                    });
                    setImageUrl(product.imageUrl);
                    return product; 
                });

            // Sửa lỗi phông chữ thông báo loading
            toast.promise(promise, {
                loading: 'Đang tải dữ liệu sản phẩm...',
                success: 'Dữ liệu đã sẵn sàng!',
                error: 'Lỗi khi tải dữ liệu sản phẩm!',
            });
        }
    }, [id, isEditing]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const submitPromise = new Promise(async (resolve, reject) => {
            try {
                let finalImageUrl = imageUrl;

                // Upload ảnh nếu có file mới
                if (selectedFile) {
                    const uploadFormData = new FormData();
                    uploadFormData.append('file', selectedFile);
                    const uploadResponse = await axios.post('http://localhost:8081/api/v1/files/upload', uploadFormData, {
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                    });
                    finalImageUrl = uploadResponse.data.filePath;
                }

                const productData = {
                    ...formData,
                    imageUrl: finalImageUrl
                };
                const params = {
                    brandId: formData.brandId,
                    categoryId: formData.categoryId
                };

                // Gọi API tạo mới hoặc cập nhật
                if (isEditing) {
                    await axios.put(`http://localhost:8081/api/v1/products/${id}`, productData, {
                        headers: { 'Authorization': `Bearer ${token}` },
                        params: params
                    });
                } else {
                    await axios.post('http://localhost:8081/api/v1/products', productData, {
                        headers: { 'Authorization': `Bearer ${token}` },
                        params: params
                    });
                }

                // Chuyển trang sau khi thành công
                setTimeout(() => navigate('/admin/products'), 1500);
                resolve(); 
            } catch (err) {
                console.error("Lỗi lưu sản phẩm", err);
                reject(err); 
            }
        });

        // Sửa lỗi phông chữ thông báo submit
        toast.promise(submitPromise, {
            loading: isEditing ? 'Đang cập nhật sản phẩm...' : 'Đang tạo sản phẩm...',
            success: isEditing ? 'Cập nhật thành công!' : 'Tạo sản phẩm mới thành công!',
            error: 'Lỗi! Không thể lưu sản phẩm.',
        });
    };

    return (
        <div className="product-form-container" style={{ padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>
                {isEditing ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm mới'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px', gap: '15px' }}>
                
                {isEditing && imageUrl && (
                    <div className="form-group">
                        <label>Ảnh hiện tại:</label>
                        <img src={`http://localhost:8081${imageUrl}`} alt="Ảnh sản phẩm" style={{ width: '100px', height: '100px', border: '1px solid #ccc', borderRadius: '4px', objectFit: 'cover' }} />
                    </div>
                )}
                
                <div className="form-group">
                    <label>Tên sản phẩm:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" />
                </div>
                
                <div className="form-group">
                    <label>Mô tả:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" style={{ minHeight: '100px' }} />
                </div>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Giá (VNĐ):</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required className="form-input" />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Số lượng tồn kho:</label>
                        <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required className="form-input" />
                    </div>
                </div>
                
                <div className="form-group">
                    <label>{isEditing ? 'Tải ảnh mới (nếu muốn thay đổi):' : 'Tải ảnh từ máy tính:'}</label>
                    <input type="file" onChange={handleFileChange} className="form-input" />
                </div>

                <div className="form-group">
                    <label>Thương hiệu:</label>
                    <select name="brandId" value={formData.brandId} onChange={handleChange} required className="form-input">
                        <option value="">-- Chọn Thương hiệu --</option>
                        {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Danh mục:</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className="form-input">
                        <option value="">-- Chọn Danh mục --</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="submit-btn" style={{ marginTop: '20px' }}>
                    {isEditing ? 'Cập nhật' : 'Thêm sản phẩm'}
                </button>
            </form>
        </div>
    );
};

export default ProductForm;