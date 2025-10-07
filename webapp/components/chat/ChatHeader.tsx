'use client';
import React from 'react';
import { 
  PhoneIcon, 
  VideoCameraIcon, 
  EllipsisVerticalIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import OnlineStatus from './OnlineStatus';

import { UserProfile } from '@/types/user.type';

interface ChatHeaderProps {
  participantId: string;
  participantInfo?: UserProfile | null;
  isOnline: boolean;
  onPhoneCall?: () => void;
  onVideoCall?: () => void;
  onMoreOptions?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  participantId,
  participantInfo,
  isOnline,
  onPhoneCall,
  onVideoCall,
  onMoreOptions
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {participantInfo?.avatarUrl ? (
              <img
                src={participantInfo.avatarUrl}
                alt={participantInfo.fullname}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <UserCircleIcon className="h-10 w-10 text-gray-400" />
            )}
            <OnlineStatus 
              isOnline={isOnline}
              className="-bottom-1 -right-1"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {participantInfo?.fullname || `Người dùng ${participantId}`}
            </h2>
            <p className="text-sm text-gray-500">
              {isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={onPhoneCall}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Gọi điện"
          >
            <PhoneIcon className="h-5 w-5" />
          </Button>
          <Button 
            onClick={onVideoCall}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Gọi video"
          >
            <VideoCameraIcon className="h-5 w-5" />
          </Button>
          <Button 
            onClick={onMoreOptions}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Tùy chọn khác"
          >
            <EllipsisVerticalIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
