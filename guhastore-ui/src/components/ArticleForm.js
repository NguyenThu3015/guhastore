import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';           
import TiptapEditor from './TiptapEditor';

const ArticleForm = () => {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const { token } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        content: '',
        imageUrl: '',
        status: 'DRAFT'
    });
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(''); 
    

    
    useEffect(() => {
        if (isEditing) {
            const promise = axios.get(`http://localhost:8081/api/v1/admin/articles/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            toast.promise(promise, {
                loading: 'Đang tải dữ liệu bài viết...',
                success: (res) => {
                    const article = res.data;
                    setFormData({
                        title: article.title,
                        summary: article.summary,
                        content: article.content,
                        imageUrl: article.imageUrl,
                        status: article.status
                    });
                    return 'Tải dữ liệu thành công!';
                },
                error: 'Lỗi! Không thể tải dữ liệu bài viết.'
            });
        }
    }, [id, isEditing, token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    
    const handleContentChange = (newContent) => {
        setFormData(prev => ({ ...prev, content: newContent }));
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            
            setImagePreview(URL.createObjectURL(file));
        }
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const submissionPromise = new Promise(async (resolve, reject) => {
            try {
                let finalImageUrl = formData.imageUrl;

                
                if (selectedFile) {
                    const uploadFormData = new FormData();
                    uploadFormData.append('file', selectedFile);
                    const uploadResponse = await axios.post('http://localhost:8081/api/v1/files/upload', uploadFormData, {
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                    });
                    finalImageUrl = uploadResponse.data.filePath;
                }
                
                const finalData = { ...formData, imageUrl: finalImageUrl };

                if (isEditing) {
                    await axios.put(`http://localhost:8081/api/v1/admin/articles/${id}`, finalData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                } else {
                    await axios.post('http://localhost:8081/api/v1/admin/articles', finalData, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }

                
                setTimeout(() => navigate('/admin/articles'), 1500);
                resolve();
            } catch (err) {
                console.error("Lỗi lưu bài viết", err);
                reject(err);
            }
        });

        toast.promise(submissionPromise, {
            loading: 'Đang lưu bài viết...',
            success: isEditing ? 'Cập nhật thành công!' : 'Tạo bài viết mới thành công!',
            error: 'Lỗi! Không thể lưu bài viết.'
        });
    };

    return (
        
        <div className="flex gap-8 max-w-7xl mx-auto my-5 p-4">
            
            <div className="flex-[3] bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-6">
                    {isEditing ? 'Sửa Bài viết' : 'Thêm Bài viết mới'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Tiêu đề bài viết:</label>
                        <input 
                            type="text" 
                            name="title" 
                            id="title"
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                    </div>

                    <div>
                        <label htmlFor="summary" className="block text-sm font-semibold text-gray-700 mb-1">Nội dung tóm tắt:</label>
                        <textarea 
                            name="summary" 
                            id="summary"
                            value={formData.summary} 
                            onChange={handleChange} 
                            rows="4" 
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nội dung chính bài viết:</label>
                        <div className="bg-white"> 
                            <TiptapEditor
                            content={formData.content}
                            onChange={handleContentChange}
                            />
                        </div>
                    </div>

                    <button type="submit" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Lưu và {formData.status === 'PUBLISHED' ? 'Xuất bản' : 'Lưu nháp'}
                    </button>
                </form>
            </div>

            
            <div className="flex-1 flex flex-col gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Cài đặt & Hiển thị</h4>
                    <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">Trạng thái:</label>
                    <select 
                        name="status" 
                        id="status"
                        value={formData.status} 
                        onChange={handleChange} 
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="DRAFT">Bản nháp (Draft)</option>
                        <option value="PUBLISHED">Công khai (Published)</option>
                    </select>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <label htmlFor="file-upload" className="block text-sm font-semibold text-gray-700 mb-1">Ảnh đại diện:</label>
                    <input 
                        type="file" 
                        id="file-upload"
                        onChange={handleFileChange} 
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    
                    <div className="mt-4 border border-dashed border-gray-300 rounded-md min-h-[150px] flex items-center justify-center p-2">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Xem trước ảnh mới" className="max-w-full h-auto rounded" />
                        ) : formData.imageUrl ? (
                            <img src={`http://localhost:8081${formData.imageUrl}`} alt="Ảnh hiện tại" className="max-w-full h-auto rounded" />
                        ) : (
                            <p className="text-sm text-gray-500">Chưa có ảnh đại diện</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
ArticleForm.modules = {
    toolbar: [
        [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
        [{size: []}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image', 'video'],
        ['clean']
    ],
};




export default ArticleForm;