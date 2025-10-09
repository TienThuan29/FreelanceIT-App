'use client';
import React from 'react';
import { 
  ChatBubbleLeftIcon,
  SparklesIcon,
  LightBulbIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';

interface StarterMessage {
  id: string;
  text: string;
  icon: React.ReactNode;
  category: 'greeting' | 'project' | 'collaboration' | 'question';
}

interface StarterMessagesProps {
  onSelectMessage: (message: string) => void;
  participantName?: string;
  isDeveloper?: boolean;
}

const StarterMessages: React.FC<StarterMessagesProps> = ({
  onSelectMessage,
  participantName,
  isDeveloper = false
}) => {
  // Starter messages based on context
  const allStarterMessages: StarterMessage[] = [
    // Greetings
    {
      id: 'greeting-1',
      text: 'Xin chào! 👋',
      icon: <HandRaisedIcon className="h-5 w-5" />,
      category: 'greeting'
    },
    {
      id: 'greeting-2',
      text: 'Chào bạn! Rất vui được kết nối với bạn',
      icon: <SparklesIcon className="h-5 w-5" />,
      category: 'greeting'
    },
    
    // Developer specific
    {
      id: 'dev-1',
      text: 'Bạn có thể chia sẻ portfolio của mình không?',
      icon: <LightBulbIcon className="h-5 w-5" />,
      category: 'project'
    },
    {
      id: 'dev-2',
      text: 'Bạn chuyên về công nghệ nào?',
      icon: <LightBulbIcon className="h-5 w-5" />,
      category: 'question'
    },
    {
      id: 'dev-3',
      text: 'Có dự án nào bạn đang làm không?',
      icon: <SparklesIcon className="h-5 w-5" />,
      category: 'project'
    },
    
    // General collaboration
    {
      id: 'collab-1',
      text: 'Bạn có muốn hợp tác trong dự án nào không?',
      icon: <SparklesIcon className="h-5 w-5" />,
      category: 'collaboration'
    },
    {
      id: 'collab-2',
      text: 'Chúng ta có thể thảo luận về ý tưởng dự án',
      icon: <LightBulbIcon className="h-5 w-5" />,
      category: 'collaboration'
    },
    {
      id: 'collab-3',
      text: 'Bạn có kinh nghiệm với freelancing không?',
      icon: <ChatBubbleLeftIcon className="h-5 w-5" />,
      category: 'question'
    },
    
    // Project related
    {
      id: 'project-1',
      text: 'Tôi có một dự án thú vị muốn chia sẻ',
      icon: <SparklesIcon className="h-5 w-5" />,
      category: 'project'
    },
    {
      id: 'project-2',
      text: 'Bạn có hứng thú với dự án mới không?',
      icon: <LightBulbIcon className="h-5 w-5" />,
      category: 'project'
    }
  ];

  // Filter and randomize messages based on context
  const getRandomStarterMessages = (): StarterMessage[] => {
    let filteredMessages = allStarterMessages;
    
    // If we know it's a developer conversation, prioritize developer messages
    if (isDeveloper) {
      const devMessages = allStarterMessages.filter(msg => 
        msg.category === 'project' || msg.category === 'collaboration'
      );
      const otherMessages = allStarterMessages.filter(msg => 
        msg.category === 'greeting' || msg.category === 'question'
      );
      
      // Take 2-3 dev messages and 1-2 other messages
      const shuffledDev = devMessages.sort(() => Math.random() - 0.5).slice(0, 3);
      const shuffledOther = otherMessages.sort(() => Math.random() - 0.5).slice(0, 2);
      
      filteredMessages = [...shuffledDev, ...shuffledOther];
    }
    
    // Randomize and take 4-5 messages
    return filteredMessages
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  };

  const starterMessages = getRandomStarterMessages();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'greeting':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'project':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case 'collaboration':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      case 'question':
        return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <ChatBubbleLeftIcon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {participantName ? `Trò chuyện với ${participantName}` : 'Bắt đầu cuộc trò chuyện'}
        </h3>
        <p className="text-gray-600 text-sm">
          Chọn một tin nhắn để bắt đầu hoặc tự viết tin nhắn của bạn
        </p>
      </div>

      {/* Starter Messages */}
      <div className="w-full max-w-2xl space-y-3">
        <h4 className="text-sm font-medium text-gray-700 text-center mb-4">
          💡 Gợi ý tin nhắn mở đầu
        </h4>
        
        <div className="grid gap-3">
          {starterMessages.map((message) => (
            <button
              key={message.id}
              onClick={() => onSelectMessage(message.text)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${getCategoryColor(message.category)}`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {message.icon}
                </div>
                <span className="text-sm font-medium">
                  {message.text}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Custom message hint */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Hoặc gõ tin nhắn của riêng bạn ở ô bên dưới
          </p>
        </div>
      </div>
    </div>
  );
};

export default StarterMessages;
