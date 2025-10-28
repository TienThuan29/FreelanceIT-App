"use client";

import React, { useState, useEffect } from 'react';
import type { Product } from '@/types/product.type';
import { ProductStatus } from '@/types/product.type';
import { HiXMark, HiPlus, HiTrash, HiPhoto } from 'react-icons/hi2';
import { toast } from 'sonner';
import useAxios from '@/hooks/useAxios';
import { Api } from '@/configs/api';

interface ProductModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  product?: Product | null;
  onClose: () => void;
  onSubmit: (productData: Partial<Product>) => Promise<boolean>;
  isLoading: boolean;
}

const PRODUCT_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Desktop Application',
  'API & Backend',
  'DevOps & Infrastructure',
  'AI & Machine Learning',
  'Data Science',
  'Game Development',
  'E-commerce',
  'CRM & ERP',
  'Other'
];

const PRODUCT_STATUSES: { value: ProductStatus; label: string }[] = [
  { value: ProductStatus.DRAFT, label: 'Nháp' },
  { value: ProductStatus.ACTIVE, label: 'Đang bán' },
  { value: ProductStatus.INACTIVE, label: 'Ngừng bán' },
  { value: ProductStatus.SOLD, label: 'Đã bán' },
];

export default function ProductModal({
  isOpen,
  mode,
  product,
  onClose,
  onSubmit,
  isLoading
}: ProductModalProps) {
  const axiosInstance = useAxios();
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    description: '',
    category: '',
    price: 0,
    images: [],
    techStack: [],
    status: ProductStatus.DRAFT,
  });

  const [currentTech, setCurrentTech] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && product) {
        setFormData({
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          images: product.images || [],
          techStack: product.techStack || [],
          status: product.status,
        });
      } else {
        // Reset for create mode
        setFormData({
          title: '',
          description: '',
          category: '',
          price: 0,
          images: [],
          techStack: [],
          status: ProductStatus.DRAFT,
        });
      }
      setErrors({});
      setCurrentTech('');
      setCurrentImage('');
    }
  }, [isOpen, mode, product]);

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTech = () => {
    if (!currentTech.trim()) return;
    
    if (formData.techStack?.includes(currentTech.trim())) {
      toast.error('Công nghệ này đã được thêm');
      return;
    }

    setFormData(prev => ({
      ...prev,
      techStack: [...(prev.techStack || []), currentTech.trim()]
    }));
    setCurrentTech('');
  };

  const handleRemoveTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack?.filter(t => t !== tech) || []
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate file count (max 5 images total)
    const currentImageCount = formData.images?.length || 0;
    const remainingSlots = 5 - currentImageCount;
    
    if (files.length > remainingSlots) {
      toast.error(`Chỉ có thể tải lên ${remainingSlots} hình ảnh nữa (tối đa 5 hình)`);
      return;
    }

    // Validate file types and size
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        toast.error(`File ${file.name} không phải là hình ảnh`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`File ${file.name} vượt quá 10MB`);
        return;
      }
    }

    setUploadingImage(true);
    try {
      // Upload multiple files
      const formDataToUpload = new FormData();
      Array.from(files).forEach(file => {
        formDataToUpload.append('productImages', file);
      });

      const response = await axiosInstance.post(Api.Product.UPLOAD_IMAGES, formDataToUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success && response.data.dataResponse?.imageUrls) {
        const newImageUrls = response.data.dataResponse.imageUrls;
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), ...newImageUrls]
        }));
        toast.success(`Đã tải lên ${newImageUrls.length} hình ảnh`);
      } else {
        toast.error('Không thể tải lên hình ảnh');
      }
    } catch (error: any) {
      console.error('Error uploading images:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tải lên hình ảnh';
      toast.error(errorMessage);
    } finally {
      setUploadingImage(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleAddImage = () => {
    if (!currentImage.trim()) return;

    // Basic URL validation
    try {
      new URL(currentImage.trim());
    } catch {
      toast.error('URL hình ảnh không hợp lệ');
      return;
    }

    if (formData.images?.includes(currentImage.trim())) {
      toast.error('Hình ảnh này đã được thêm');
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), currentImage.trim()]
    }));
    setCurrentImage('');
  };

  const handleRemoveImage = (image: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter(img => img !== image) || []
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Tên sản phẩm là bắt buộc';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Mô tả sản phẩm là bắt buộc';
    }

    if (!formData.category?.trim()) {
      newErrors.category = 'Danh mục là bắt buộc';
    }

    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = 'Giá phải là số dương';
    }

    if (!formData.techStack || formData.techStack.length === 0) {
      newErrors.techStack = 'Vui lòng thêm ít nhất một công nghệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin');
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'create' ? 'Đăng sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="VD: Hệ thống quản lý bán hàng"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả sản phẩm *
            </label>
            <textarea
              rows={4}
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Mô tả chi tiết về sản phẩm, tính năng, ưu điểm..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục *
              </label>
              <select
                value={formData.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Chọn danh mục</option>
                {PRODUCT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái *
              </label>
              <select
                value={formData.status || ProductStatus.DRAFT}
                onChange={(e) => handleInputChange('status', e.target.value as ProductStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {PRODUCT_STATUSES.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá (VND) *
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={formData.price || 0}
              onChange={(e) => handleInputChange('price', Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Công nghệ sử dụng *
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: React, Node.js, MongoDB..."
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <HiPlus className="w-5 h-5" />
              </button>
            </div>
            
            {formData.techStack && formData.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.techStack.map(tech => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center space-x-2"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="hover:text-blue-900"
                    >
                      <HiXMark className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            {errors.techStack && <p className="mt-1 text-sm text-red-600">{errors.techStack}</p>}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh sản phẩm (tối đa 5 hình, mỗi hình tối đa 10MB)
            </label>
            
            {/* File Upload Button */}
            <div className="mb-3">
              <label className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploadingImage || (formData.images?.length || 0) >= 5}
                  className="hidden"
                />
                {uploadingImage ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    <span>Đang tải lên...</span>
                  </>
                ) : (
                  <>
                    <HiPhoto className="w-5 h-5 mr-2" />
                    <span>Tải lên hình ảnh từ máy tính</span>
                  </>
                )}
              </label>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {formData.images?.length || 0}/5 hình ảnh
              </p>
            </div>

            {/* Or add by URL */}
            <div className="mb-2">
              <p className="text-sm text-gray-600 mb-2">Hoặc thêm bằng URL:</p>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={currentImage}
                  onChange={(e) => setCurrentImage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="https://example.com/image.jpg"
                  disabled={(formData.images?.length || 0) >= 5}
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  disabled={(formData.images?.length || 0) >= 5}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiPlus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image Preview Grid */}
            {formData.images && formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg transition-transform group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/placeholder-product.png';
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-700"
                      title="Xóa hình ảnh"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Ảnh chính
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang lưu...</span>
                </>
              ) : (
                <span>{mode === 'create' ? 'Đăng sản phẩm' : 'Cập nhật'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

