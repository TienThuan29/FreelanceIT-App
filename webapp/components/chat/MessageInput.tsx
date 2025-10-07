'use client';
import React, { useRef, useState } from 'react';
import { PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  isSending?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  onTypingStart,
  onTypingStop,
  disabled = false,
  placeholder = "Nhập tin nhắn...",
  isSending = false
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Handle typing indicators
    if (newValue.trim() && onTypingStart && !isTyping) {
      setIsTyping(true);
      onTypingStart();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    if (newValue.trim() && onTypingStop) {
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        onTypingStop();
      }, 2000);
    } else if (!newValue.trim() && onTypingStop && isTyping) {
      setIsTyping(false);
      onTypingStop();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isSending) {
        onSend();
      }
    }
  };

  const handleSend = () => {
    if (value.trim() && !isSending) {
      onSend();
      // Stop typing when sending
      if (isTyping && onTypingStop) {
        setIsTyping(false);
        onTypingStop();
      }
    }
  };

  const handleFileUpload = () => {
    console.log('File upload clicked');
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 p-4">
      <div className="flex items-center space-x-3">
        <Button
          onClick={handleFileUpload}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
          disabled={disabled}
          title="Đính kèm tệp"
        >
          <PaperClipIcon className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            disabled={disabled}
          />
          {disabled && (
            <div className="absolute inset-0 bg-gray-100/50 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-500">Đang kết nối...</span>
            </div>
          )}
        </div>
        
        <Button
          onClick={handleSend}
          disabled={!value.trim() || disabled || isSending}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          title="Gửi tin nhắn"
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <PaperAirplaneIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {disabled && (
        <p className="text-xs text-red-500 mt-2 flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
          Không thể kết nối đến server
        </p>
      )}
    </div>
  );
};

export default MessageInput;
