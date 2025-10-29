"use client";

import React, { useEffect, useState } from 'react';
import { HiXMark, HiStar, HiEye, HiHeart, HiEnvelope, HiPhone, HiGlobeAlt, HiCube } from 'react-icons/hi2';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import type { Product } from '@/types/product.type';
import type { DeveloperProfile } from '@/types/user.type';
import ImageSlider from './ImageSlider';
import Avatar from './Avatar';
import { formatCurrency } from '@/utils';
import useAxios from '@/hooks/useAxios';
import { Api } from '@/configs/api';

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

interface DeveloperInfo {
  userProfile: {
    id: string;
    fullname: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    dateOfBirth?: string;
    address?: string;
    role?: string;
  };
  developerProfile: DeveloperProfile | null;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const axiosInstance = useAxios();
  const [developerInfo, setDeveloperInfo] = useState<DeveloperInfo | null>(null);
  const [isLoadingDeveloper, setIsLoadingDeveloper] = useState(false);

  useEffect(() => {
    if (isOpen && product.developerId) {
      fetchDeveloperInfo(product.developerId);
    }
  }, [isOpen, product.developerId]);

  const fetchDeveloperInfo = async (developerId: string) => {
    setIsLoadingDeveloper(true);
    try {
      const response = await axiosInstance.get(`${Api.Developer.GET_PROFILE_PUBLIC}/${developerId}`);
      if (response.data.success && response.data.dataResponse) {
        setDeveloperInfo(response.data.dataResponse);
      } else {
        console.error('Failed to fetch developer info:', response.data);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error fetching developer info:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    } finally {
      setIsLoadingDeveloper(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">{product.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            type="button"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Images */}
            <div>
              <ImageSlider
                images={product.images || []}
                alt={product.title}
                className="h-96"
              />

              {/* Stats */}
              <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-1 text-gray-600">
                  <HiEye className="w-5 h-5" />
                  <span className="text-sm font-medium">{product.views || 0} lượt xem</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <HiHeart className="w-5 h-5" />
                  <span className="text-sm font-medium">{product.likes || 0} lượt thích</span>
                </div>
                {product.reviews && product.reviews.length > 0 && (
                  <div className="flex items-center space-x-1 text-gray-600">
                    <HiStar className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium">
                      {(product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Price */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div className="text-sm text-gray-600 mb-1">Giá sản phẩm</div>
                <div className="text-4xl font-bold text-blue-600">{formatCurrency(product.price)}</div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mô tả sản phẩm</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{product.description}</p>
              </div>

              {/* Category */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Danh mục</h3>
                <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <HiCube className="w-4 h-4 mr-2" />
                  {product.category}
                </span>
              </div>

              {/* Tech Stack */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Công nghệ sử dụng</h3>
                <div className="flex flex-wrap gap-2">
                  {product.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-lg text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              {(product.liveUrl || product.githubUrl) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Liên kết</h3>
                  <div className="space-y-2">
                    {product.liveUrl && (
                      <a
                        href={product.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        <HiGlobeAlt className="w-5 h-5 mr-2" />
                        Demo trực tiếp
                      </a>
                    )}
                    {product.githubUrl && (
                      <a
                        href={product.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-700 hover:text-gray-900 hover:underline"
                      >
                        <FaGithub className="w-5 h-5 mr-2" />
                        Mã nguồn GitHub
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Developer Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin nhà phát triển</h3>
                
                {isLoadingDeveloper ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : developerInfo?.userProfile && developerInfo?.developerProfile ? (
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 space-y-4">
                    {/* Developer Header */}
                    <div className="flex items-center space-x-4">
                      <Avatar
                        src={developerInfo.userProfile?.avatarUrl || ''}
                        name={developerInfo.userProfile?.fullname || 'Developer'}
                        size="lg"
                        className="border-2 border-blue-200"
                      />
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{developerInfo.userProfile?.fullname || 'Developer'}</h4>
                        <p className="text-gray-600">{developerInfo.developerProfile?.title || 'Developer'}</p>
                        <div className="flex items-center mt-1">
                          <HiStar className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium text-gray-700">
                            {developerInfo.developerProfile?.rating || 0}/5 ({developerInfo.developerProfile?.totalProjects || 0} dự án)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Developer Bio */}
                    {developerInfo.developerProfile?.bio && (
                      <p className="text-gray-700 text-sm leading-relaxed">{developerInfo.developerProfile.bio}</p>
                    )}

                    {/* Experience & Rate */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="text-xs text-gray-600">Kinh nghiệm</div>
                        <div className="text-lg font-bold text-gray-900">{developerInfo.developerProfile?.experienceYears || 0} năm</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="text-xs text-gray-600">Mức phí</div>
                        <div className="text-lg font-bold text-gray-900">
                          {developerInfo.developerProfile?.hourlyRate ? `${formatCurrency(developerInfo.developerProfile.hourlyRate)}/giờ` : 'Liên hệ'}
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <h5 className="font-semibold text-gray-900">Liên hệ</h5>
                      
                      {developerInfo.userProfile?.email && (
                        <a
                          href={`mailto:${developerInfo.userProfile.email}`}
                          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
                        >
                          <div className="bg-blue-100 group-hover:bg-blue-200 p-2 rounded-lg mr-3 transition-colors">
                            <HiEnvelope className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="text-sm">{developerInfo.userProfile.email}</span>
                        </a>
                      )}

                      {developerInfo.userProfile?.phone && (
                        <a
                          href={`tel:${developerInfo.userProfile.phone}`}
                          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
                        >
                          <div className="bg-green-100 group-hover:bg-green-200 p-2 rounded-lg mr-3 transition-colors">
                            <HiPhone className="w-5 h-5 text-green-600" />
                          </div>
                          <span className="text-sm">{developerInfo.userProfile.phone}</span>
                        </a>
                      )}

                      {developerInfo.developerProfile?.linkedinUrl && (
                        <a
                          href={developerInfo.developerProfile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-700 hover:text-blue-600 transition-colors group"
                        >
                          <div className="bg-blue-100 group-hover:bg-blue-200 p-2 rounded-lg mr-3 transition-colors">
                            <FaLinkedin className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="text-sm">LinkedIn Profile</span>
                        </a>
                      )}

                      {developerInfo.developerProfile?.githubUrl && (
                        <a
                          href={developerInfo.developerProfile.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-700 hover:text-gray-900 transition-colors group"
                        >
                          <div className="bg-gray-100 group-hover:bg-gray-200 p-2 rounded-lg mr-3 transition-colors">
                            <FaGithub className="w-5 h-5 text-gray-700" />
                          </div>
                          <span className="text-sm">GitHub Profile</span>
                        </a>
                      )}
                    </div>

                    {/* CTA Button */}
                    {developerInfo.userProfile?.email && (
                      <button
                        onClick={() => window.location.href = `mailto:${developerInfo.userProfile.email}?subject=Quan tâm đến sản phẩm: ${product.title}`}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                        type="button"
                      >
                        Liên hệ ngay
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Không thể tải thông tin nhà phát triển
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

