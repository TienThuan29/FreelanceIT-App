"use client";

import React from 'react';
import type { DeveloperProfile, DeveloperLevel } from '@/types/user.type';
import type { UserProfileResponse } from '@/hooks/useDeveloperProfile';
import { formatCurrency, formatDate } from '@/utils';
import { HiCheck } from 'react-icons/hi2';

interface SettingsTabProps {
  isEditing: boolean;
  hasProfile: boolean;
  userProfile?: UserProfileResponse;
  developerProfile?: DeveloperProfile;
  userFormData: Partial<UserProfileResponse>;
  formData: Partial<DeveloperProfile>;
  isUpdating: boolean;
  onUserInputChange: (field: string, value: any) => void;
  onInputChange: (field: keyof DeveloperProfile, value: any) => void;
  onSaveUserProfile: () => Promise<void>;
  onSaveDeveloperProfile: () => Promise<void>;
  onCancel: () => void;
  hasUserFormChanges: () => boolean;
  hasDeveloperFormChanges: () => boolean;
}

export default function SettingsTab({
  isEditing,
  hasProfile,
  userProfile,
  developerProfile,
  userFormData,
  formData,
  isUpdating,
  onUserInputChange,
  onInputChange,
  onSaveUserProfile,
  onSaveDeveloperProfile,
  onCancel,
  hasUserFormChanges,
  hasDeveloperFormChanges
}: SettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Thông tin cá nhân</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ tên *
            </label>
            {isEditing ? (
              <input
                type="text"
                value={userFormData?.fullname || ''}
                onChange={(e) => onUserInputChange('fullname', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{userProfile?.fullname}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            {isEditing ? (
              <input
                type="email"
                value={userFormData?.email || ''}
                onChange={(e) => onUserInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{userProfile?.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={userFormData?.phone || ''}
                onChange={(e) => onUserInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{userProfile?.phone || 'Chưa cập nhật'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày sinh
            </label>
            {isEditing ? (
              <input
                type="date"
                value={userFormData?.dateOfBirth ? new Date(userFormData.dateOfBirth).toISOString().split('T')[0] : ''}
                onChange={(e) => onUserInputChange('dateOfBirth', new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{userProfile?.dateOfBirth ? formatDate(new Date(userProfile.dateOfBirth)) : 'Chưa cập nhật'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vai trò
            </label>
            <p className="text-gray-900 capitalize">{userProfile?.role || 'Chưa xác định'}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái tài khoản
            </label>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              userProfile?.isEnable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {userProfile?.isEnable ? 'Hoạt động' : 'Bị khóa'}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lần đăng nhập cuối
            </label>
            <p className="text-gray-900">{userProfile?.lastLoginDate ? formatDate(new Date(userProfile.lastLoginDate)) : 'Chưa có'}</p>
          </div>
        </div>

        {/* Personal Information Save Button */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-end space-x-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                type="button"
              >
                Hủy
              </button>
              <button
                onClick={onSaveUserProfile}
                disabled={isUpdating || !hasUserFormChanges()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                type="button"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <HiCheck className="w-4 h-4" />
                    <span>Lưu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Developer Profile Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Cài đặt Developer Profile</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chức danh
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => onInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: Full Stack Developer, Frontend Developer..."
              />
            ) : (
              <p className="text-gray-900">{developerProfile?.title || 'Chưa cập nhật'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá theo giờ (VND)
            </label>
            {isEditing ? (
              <input
                type="number"
                value={formData.hourlyRate || ''}
                onChange={(e) => onInputChange('hourlyRate', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: 500000"
              />
            ) : (
              <p className="text-gray-900">{developerProfile?.hourlyRate ? formatCurrency(developerProfile.hourlyRate) : 'Chưa cập nhật'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cấp độ Developer
            </label>
            {isEditing ? (
              <select
                value={formData.developerLevel || ''}
                onChange={(e) => onInputChange('developerLevel', e.target.value as DeveloperLevel)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn cấp độ</option>
                <option value="JUNIOR">Junior</option>
                <option value="MID">Mid</option>
                <option value="SENIOR">Senior</option>
                <option value="LEAD">Lead</option>
              </select>
            ) : (
              <p className="text-gray-900 capitalize">{developerProfile?.developerLevel?.toLowerCase() || 'Chưa cập nhật'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Năm kinh nghiệm
            </label>
            {isEditing ? (
              <input
                type="number"
                value={formData.experienceYears || ''}
                onChange={(e) => onInputChange('experienceYears', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{developerProfile?.experienceYears || 'Chưa cập nhật'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GitHub URL
            </label>
            {isEditing ? (
              <input
                type="url"
                value={formData.githubUrl || ''}
                onChange={(e) => onInputChange('githubUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/username"
              />
            ) : (
              <p className="text-gray-900">{developerProfile?.githubUrl || 'Chưa cập nhật'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn URL
            </label>
            {isEditing ? (
              <input
                type="url"
                value={formData.linkedinUrl || ''}
                onChange={(e) => onInputChange('linkedinUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
            ) : (
              <p className="text-gray-900">{developerProfile?.linkedinUrl || 'Chưa cập nhật'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CV/Resume URL
            </label>
            {isEditing ? (
              <input
                type="url"
                value={formData.cvUrl || ''}
                onChange={(e) => onInputChange('cvUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/cv.pdf"
              />
            ) : (
              <p className="text-gray-900">{developerProfile?.cvUrl || 'Chưa cập nhật'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Múi giờ
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.timezone || 'Asia/Ho_Chi_Minh_City'}
                onChange={(e) => onInputChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Asia/Ho_Chi_Minh"
              />
            ) : (
              <p className="text-gray-900">{developerProfile?.timezone || 'Chưa cập nhật'}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giới thiệu bản thân
          </label>
          {isEditing ? (
            <textarea
              rows={4}
              value={formData.bio || ''}
              onChange={(e) => onInputChange('bio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mô tả về kinh nghiệm, kỹ năng và mục tiêu nghề nghiệp của bạn..."
            />
          ) : (
            <p className="text-gray-900">{developerProfile?.bio || 'Chưa cập nhật giới thiệu'}</p>
          )}
        </div>

        <div className="mt-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isAvailable || false}
              onChange={(e) => onInputChange('isAvailable', e.target.checked)}
              disabled={!isEditing}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Sẵn sàng nhận việc</span>
          </label>
        </div>

        {/* Developer Profile Save Button */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-end space-x-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                type="button"
              >
                Hủy
              </button>
              <button
                onClick={onSaveDeveloperProfile}
                disabled={isUpdating || !hasDeveloperFormChanges()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                type="button"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <HiCheck className="w-4 h-4" />
                    <span>Lưu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Cài đặt tài khoản</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Thông báo email</h4>
              <p className="text-sm text-gray-500">Nhận thông báo về dự án mới và tin nhắn</p>
            </div>
            <button
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"
              type="button"
            >
              <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Hiển thị trạng thái hoạt động</h4>
              <p className="text-sm text-gray-500">Cho phép clients thấy khi bạn online</p>
            </div>
            <button
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
              type="button"
            >
              <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-red-200">
        <h3 className="text-lg font-medium text-red-900 mb-4">Vùng nguy hiểm</h3>
        <p className="text-sm text-red-600 mb-4">
          Các hành động này không thể hoàn tác. Vui lòng cân nhắc kỹ trước khi thực hiện.
        </p>
        <div className="space-y-3">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            type="button"
          >
            Xóa tài khoản
          </button>
        </div>
      </div>
    </div>
  );
}

