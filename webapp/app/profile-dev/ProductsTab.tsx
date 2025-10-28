"use client";

import React, { useState } from 'react';
import type { Product, ProductStatus } from '@/types/product.type';
import { formatCurrency } from '@/utils';
import { HiEye, HiArrowDown, HiHeart, HiPlus, HiXMark, HiTrash } from 'react-icons/hi2';
import { toast } from 'sonner';

interface ProductsTabProps {
  hasProfile: boolean;
  products: Product[];
  limitInfo: {
    currentCount: number;
    maxAllowed: number;
    remaining: number;
    canAddMore: boolean;
  } | null;
  isLoading: boolean;
  onCreateProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => Promise<void>;
  onNavigateToSettings: () => void;
  onStartEditing: () => void;
}

export default function ProductsTab({
  hasProfile,
  products,
  limitInfo,
  isLoading,
  onCreateProduct,
  onEditProduct,
  onDeleteProduct,
  onNavigateToSettings,
  onStartEditing
}: ProductsTabProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await onDeleteProduct(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Sản phẩm đang bán</h3>
          {hasProfile && limitInfo && (
            <p className="text-sm text-gray-500 mt-1">
              Đang sử dụng {limitInfo.currentCount}/{limitInfo.maxAllowed} sản phẩm
              {limitInfo.remaining > 0 && (
                <span className="text-green-600 ml-1">
                  ({limitInfo.remaining} còn lại)
                </span>
              )}
            </p>
          )}
        </div>
        {hasProfile && (
          <button
            onClick={onCreateProduct}
            disabled={Boolean(limitInfo && !limitInfo.canAddMore)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            type="button"
            title={limitInfo && !limitInfo.canAddMore ? 'Đã đạt giới hạn số sản phẩm' : 'Đăng sản phẩm mới'}
          >
            <HiPlus className="w-4 h-4" />
            <span>Đăng sản phẩm mới</span>
          </button>
        )}
      </div>

      {hasProfile ? (
        <>
          {limitInfo && !limitInfo.canAddMore && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Đã đạt giới hạn:</strong> Bạn đã sử dụng hết {limitInfo.maxAllowed} sản phẩm.
                {limitInfo.maxAllowed === 1 && (
                  <span className="ml-1">
                    Nâng cấp gói dịch vụ để đăng thêm sản phẩm.
                  </span>
                )}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(product => (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/placeholder-product.png';
                    }}
                  />
                )}
                {(!product.images || product.images.length === 0) && (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Không có hình ảnh</span>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 flex-1">{product.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2 ${
                      product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                      product.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                      product.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.status === 'ACTIVE' ? 'Đang bán' : 
                       product.status === 'DRAFT' ? 'Nháp' :
                       product.status === 'INACTIVE' ? 'Ngừng bán' :
                       product.status === 'SOLD' ? 'Đã bán' : 'Đã xóa'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  {/* Category */}
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">Danh mục: </span>
                    <span className="text-xs font-medium text-gray-700">{product.category}</span>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.techStack.slice(0, 3).map(tech => (
                      <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                    {product.techStack.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{product.techStack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <HiEye className="w-4 h-4" />
                        <span>{product.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HiHeart className="w-4 h-4" />
                        <span>{product.likes || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditProduct(product)}
                      className="flex-1 px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-sm"
                      type="button"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.title)}
                      disabled={deletingId === product.id}
                      className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 text-sm disabled:opacity-50"
                      type="button"
                    >
                      {deletingId === product.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <HiTrash className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có sản phẩm nào
              </h3>
              <p className="text-gray-500 mb-4">
                Hãy đăng sản phẩm đầu tiên của bạn để bắt đầu kiếm tiền
              </p>
              <button
                onClick={onCreateProduct}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                type="button"
              >
                Đăng sản phẩm đầu tiên
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có profile developer
          </h3>
          <p className="text-gray-500 mb-4">
            Tạo profile developer để bắt đầu đăng sản phẩm và kiếm tiền
          </p>
          <button
            onClick={() => {
              onStartEditing();
              onNavigateToSettings();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            type="button"
          >
            Tạo Profile Developer
          </button>
        </div>
      )}
    </div>
  );
}
