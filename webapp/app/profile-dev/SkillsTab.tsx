"use client";

import React, { useState } from 'react';
import type { DeveloperProfile, Skill, SkillProficiency } from '@/types/user.type';
import { formatDate } from '@/utils';
import { HiPlus, HiXMark } from 'react-icons/hi2';
import { toast } from 'sonner';

interface SkillsTabProps {
  hasProfile: boolean;
  developerProfile?: DeveloperProfile;
  onAddSkill: (skill: { name: string; proficiency: SkillProficiency; yearsOfExperience: number }) => Promise<boolean>;
  onNavigateToSettings: () => void;
  onStartEditing: () => void;
  isSkillLoading: boolean;
}

interface SkillFormData {
  name: string;
  proficiency: SkillProficiency;
  yearsOfExperience: number;
}

export default function SkillsTab({
  hasProfile,
  developerProfile,
  onAddSkill,
  onNavigateToSettings,
  onStartEditing,
  isSkillLoading
}: SkillsTabProps) {
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillFormData, setSkillFormData] = useState<SkillFormData>({
    name: '',
    proficiency: 'BEGINNER' as SkillProficiency,
    yearsOfExperience: 1
  });

  const getProficiencyColor = (proficiency: SkillProficiency): string => {
    const proficiencyColors: Record<SkillProficiency, string> = {
      BEGINNER: 'bg-gray-100 text-gray-800',
      INTERMEDIATE: 'bg-yellow-100 text-yellow-800',
      ADVANCED: 'bg-blue-100 text-blue-800',
      EXPERT: 'bg-green-100 text-green-800'
    };
    return proficiencyColors[proficiency] || 'bg-gray-100 text-gray-800';
  };

  const getProficiencyText = (proficiency: SkillProficiency): string => {
    const proficiencyTexts: Record<SkillProficiency, string> = {
      BEGINNER: 'Cơ bản',
      INTERMEDIATE: 'Trung bình',
      ADVANCED: 'Nâng cao',
      EXPERT: 'Chuyên gia'
    };
    return proficiencyTexts[proficiency] || 'Chưa xác định';
  };

  const handleOpenSkillModal = () => {
    setIsSkillModalOpen(true);
    setSkillFormData({
      name: '',
      proficiency: 'BEGINNER' as SkillProficiency,
      yearsOfExperience: 1
    });
  };

  const handleCloseSkillModal = () => {
    setIsSkillModalOpen(false);
    setSkillFormData({
      name: '',
      proficiency: 'BEGINNER' as SkillProficiency,
      yearsOfExperience: 1
    });
  };

  const handleSkillFormChange = (field: string, value: string | number) => {
    setSkillFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSkill = async () => {
    // Validate form data
    if (!skillFormData.name.trim()) {
      toast.error('Vui lòng nhập tên kỹ năng');
      return;
    }

    if (skillFormData.yearsOfExperience < 1) {
      toast.error('Số năm kinh nghiệm phải lớn hơn 0');
      return;
    }

    try {
      const success = await onAddSkill({
        name: skillFormData.name.trim(),
        proficiency: skillFormData.proficiency,
        yearsOfExperience: skillFormData.yearsOfExperience
      });

      if (success) {
        toast.success('Thêm kỹ năng thành công!');
        handleCloseSkillModal();
      } else {
        toast.error('Có lỗi xảy ra khi thêm kỹ năng!');
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error('Có lỗi xảy ra khi thêm kỹ năng!');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Kỹ năng & Chuyên môn</h3>
          {hasProfile && (
            <button
              onClick={handleOpenSkillModal}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              type="button"
            >
              Thêm kỹ năng
            </button>
          )}
        </div>

        {hasProfile ? (
          <div className="space-y-6">
            {developerProfile?.skills?.map(skill => (
              <div key={skill.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 text-lg">{skill.name}</h4>
                    <p className="text-gray-600 text-sm">{skill.yearsOfExperience} năm kinh nghiệm</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getProficiencyColor(skill.proficiency)}`}>
                    {getProficiencyText(skill.proficiency)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>ID: {skill.id}</span>
                    <span>Tạo: {skill.createdDate ? formatDate(skill.createdDate) : 'Chưa xác định'}</span>
                    {skill.updatedDate && (
                      <span>Cập nhật: {formatDate(skill.updatedDate)}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 text-sm"
                      type="button"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 text-sm"
                      type="button"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có kỹ năng nào
                </h3>
                <p className="text-gray-500 mb-4">
                  Hãy thêm kỹ năng của bạn để khách hàng có thể tìm thấy bạn dễ dàng hơn
                </p>
                <button
                  onClick={handleOpenSkillModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  type="button"
                >
                  Thêm kỹ năng đầu tiên
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có profile developer
            </h3>
            <p className="text-gray-500 mb-4">
              Tạo profile developer để quản lý kỹ năng và chuyên môn của bạn
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

      {/* Skill Addition Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Thêm kỹ năng mới</h3>
                <button
                  onClick={handleCloseSkillModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  type="button"
                >
                  <HiXMark className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Skill Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên kỹ năng *
                  </label>
                  <input
                    type="text"
                    value={skillFormData.name}
                    onChange={(e) => handleSkillFormChange('name', e.target.value)}
                    placeholder="Ví dụ: React, Node.js, Python..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Proficiency Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mức độ thành thạo *
                  </label>
                  <select
                    value={skillFormData.proficiency}
                    onChange={(e) => handleSkillFormChange('proficiency', e.target.value as SkillProficiency)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="BEGINNER">Mới bắt đầu</option>
                    <option value="INTERMEDIATE">Trung bình</option>
                    <option value="ADVANCED">Nâng cao</option>
                    <option value="EXPERT">Chuyên gia</option>
                  </select>
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số năm kinh nghiệm *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={skillFormData.yearsOfExperience}
                    onChange={(e) => handleSkillFormChange('yearsOfExperience', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCloseSkillModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  type="button"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddSkill}
                  disabled={isSkillLoading || !skillFormData.name.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                  type="button"
                >
                  {isSkillLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Đang thêm...</span>
                    </>
                  ) : (
                    <>
                      <HiPlus className="w-4 h-4" />
                      <span>Thêm kỹ năng</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

