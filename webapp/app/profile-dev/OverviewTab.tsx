"use client";

import React from 'react';
import type { DeveloperProfile } from '@/types/user.type';
import type { Product } from '@/types/product.type';
import type { UserProfileResponse } from '@/hooks/useDeveloperProfile';
import {
  HiChartPie,
  HiCheckCircle,
  HiStar,
  HiShoppingBag,
  HiEnvelope,
  HiPhone,
  HiMapPin,
  HiClock,
  HiCodeBracket,
  HiBriefcase,
  HiDocument,
  HiWrenchScrewdriver,
  HiCube,
  HiPlus
} from 'react-icons/hi2';

interface OverviewTabProps {
  hasProfile: boolean;
  developerProfile?: DeveloperProfile;
  userProfile?: UserProfileResponse;
  products: Product[];
  onCreateProduct: () => void;
  onManageProducts: () => void;
  onNavigateToSkills: () => void;
  onNavigateToSettings: () => void;
  onStartEditing: () => void;
}

export default function OverviewTab({
  hasProfile,
  developerProfile,
  userProfile,
  products,
  onCreateProduct,
  onManageProducts,
  onNavigateToSkills,
  onNavigateToSettings,
  onStartEditing
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <HiChartPie className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {hasProfile ? (developerProfile?.totalProjects || 0) : 0}
              </p>
              <p className="text-gray-500 text-sm">Tổng dự án</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <HiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {hasProfile ? (developerProfile?.experienceYears || 0) : 0}
              </p>
              <p className="text-gray-500 text-sm">Năm kinh nghiệm</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <HiStar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {hasProfile ? (developerProfile?.rating || 0) : 0}
              </p>
              <p className="text-gray-500 text-sm">Đánh giá</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <HiShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              <p className="text-gray-500 text-sm">Sản phẩm</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
        {hasProfile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={onCreateProduct}
              className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group"
              type="button"
            >
              <div className="text-center">
                <HiShoppingBag className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform text-green-600 mx-auto" />
                <p className="text-gray-600 group-hover:text-green-600">Đăng sản phẩm mới</p>
              </div>
            </button>

            <button
              onClick={onManageProducts}
              className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group"
              type="button"
            >
              <div className="text-center">
                <HiCube className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform text-blue-600 mx-auto" />
                <p className="text-gray-600 group-hover:text-blue-600">Quản lý sản phẩm</p>
              </div>
            </button>

            <button
              onClick={onNavigateToSkills}
              className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors group"
              type="button"
            >
              <div className="text-center">
                <HiWrenchScrewdriver className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform text-gray-600 mx-auto" />
                <p className="text-gray-600 group-hover:text-gray-600">Quản lý kỹ năng</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tạo Profile Developer
            </h3>
            <p className="text-gray-500 mb-4">
              Tạo profile developer để bắt đầu sử dụng các tính năng của nền tảng
            </p>
            <button
              onClick={() => {
                onStartEditing();
                onNavigateToSettings();
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              type="button"
            >
              Tạo Profile Ngay
            </button>
          </div>
        )}
      </div>

      {/* Developer Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Giới thiệu</h3>
          {hasProfile ? (
            <>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {developerProfile?.bio || 'Chưa cập nhật giới thiệu'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 flex items-center">
                    <HiEnvelope className="w-4 h-4 mr-1" />
                    Email:
                  </span>
                  <span className="ml-2 text-gray-900">{userProfile?.email}</span>
                </div>
                <div>
                  <span className="text-gray-500 flex items-center">
                    <HiPhone className="w-4 h-4 mr-1" />
                    Điện thoại:
                  </span>
                  <span className="ml-2 text-gray-900">{userProfile?.phone || 'Chưa cập nhật'}</span>
                </div>
                <div>
                  <span className="text-gray-500 flex items-center">
                    <HiMapPin className="w-4 h-4 mr-1" />
                    Địa điểm:
                  </span>
                  <span className="ml-2 text-gray-900">{userProfile?.id}</span>
                </div>
                <div>
                  <span className="text-gray-500 flex items-center">
                    <HiClock className="w-4 h-4 mr-1" />
                    Múi giờ:
                  </span>
                  <span className="ml-2 text-gray-900">{developerProfile?.timezone || 'Chưa cập nhật'}</span>
                </div>
              </div>

              {/* Skills Preview */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Kỹ năng chính</h4>
                <div className="flex flex-wrap gap-2">
                  {developerProfile?.skills?.slice(0, 6).map(skill => (
                    <span key={skill.id} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {skill.name}
                    </span>
                  )) || <span className="text-gray-500">Chưa cập nhật kỹ năng</span>}
                </div>
                {developerProfile?.skills && developerProfile.skills.length > 6 && (
                  <button
                    onClick={onNavigateToSkills}
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                    type="button"
                  >
                    Xem tất cả kỹ năng →
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có thông tin giới thiệu
              </h4>
              <p className="text-gray-500 mb-4">
                Tạo profile developer để thêm thông tin giới thiệu và kỹ năng của bạn
              </p>
              <button
                onClick={() => {
                  onStartEditing();
                  onNavigateToSettings();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                type="button"
              >
                Tạo Profile
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin bổ sung</h3>

          {hasProfile ? (
            <>
              <div className="space-y-4">
                <div>
                  <span className="text-gray-500 text-sm">Cấp độ:</span>
                  <span className="ml-2 text-gray-900 capitalize">
                    {developerProfile?.developerLevel?.toLowerCase() || 'Chưa cập nhật'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 text-sm">Ngôn ngữ:</span>
                  <div className="mt-1">
                    {developerProfile?.languages?.map((lang, index) => (
                      <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded mr-1 mb-1">
                        {lang}
                      </span>
                    )) || <span className="text-gray-500 text-sm">Chưa cập nhật</span>}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Liên kết</h4>
                <div className="space-y-2">
                  {developerProfile?.githubUrl && (
                    <a
                      href={developerProfile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      <HiCodeBracket className="w-4 h-4 mr-2" /> GitHub
                    </a>
                  )}
                  {developerProfile?.linkedinUrl && (
                    <a
                      href={developerProfile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      <HiBriefcase className="w-4 h-4 mr-2" /> LinkedIn
                    </a>
                  )}
                  {developerProfile?.cvUrl && (
                    <a
                      href={developerProfile.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                    >
                      <HiDocument className="w-4 h-4 mr-2" /> CV/Resume
                    </a>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">
                Tạo profile developer để hiển thị thông tin bổ sung
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

