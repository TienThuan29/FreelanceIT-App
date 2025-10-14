'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { 
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ConversationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationName?: string;
  onRename: (newName: string) => void;
  onDelete: () => void;
  isLoading?: boolean;
}

const ConversationSettingsModal: React.FC<ConversationSettingsModalProps> = ({
  isOpen,
  onClose,
  conversationName = '',
  onRename,
  onDelete,
  isLoading = false
}) => {
  const [newName, setNewName] = useState(conversationName);
  const [showRenameInput, setShowRenameInput] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleRename = () => {
    if (newName.trim() && newName.trim() !== conversationName) {
      onRename(newName.trim());
      setShowRenameInput(false);
    }
  };

  const handleDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleClose = () => {
    setNewName(conversationName);
    setShowRenameInput(false);
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Cài đặt cuộc trò chuyện
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Current conversation name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên cuộc trò chuyện
            </label>
            {!showRenameInput ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-900">{conversationName || 'Không có tên'}</span>
                <button
                  onClick={() => setShowRenameInput(true)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  disabled={isLoading}
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên mới..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename();
                    if (e.key === 'Escape') setShowRenameInput(false);
                  }}
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleRename}
                    disabled={!newName.trim() || newName.trim() === conversationName || isLoading}
                  >
                    Lưu
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowRenameInput(false)}
                    disabled={isLoading}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Delete conversation */}
          <div className="border-t border-gray-200 pt-4">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
                disabled={isLoading}
              >
                <TrashIcon className="h-4 w-4" />
                <span>Xóa cuộc trò chuyện</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-red-600">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                  <span className="font-medium">Xác nhận xóa</span>
                </div>
                <p className="text-sm text-gray-600">
                  Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Hành động này không thể hoàn tác.
                </p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    Xóa
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isLoading}
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationSettingsModal;
