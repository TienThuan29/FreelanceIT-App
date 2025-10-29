'use client';
import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user.type';
import { useAuth } from '@/contexts/AuthContext';
import { Api } from '@/configs/api';
import { Button } from '@/components/ui/Button';
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface DeveloperListProps {
  onSelectDeveloper: (developer: UserProfile) => void;
  selectedDeveloperId?: string;
}

const DeveloperList: React.FC<DeveloperListProps> = ({ 
  onSelectDeveloper, 
  selectedDeveloperId 
}) => {
  const { accessToken, user } = useAuth();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load developers on mount and when accessToken changes
  useEffect(() => {
    if (accessToken && !hasLoaded) {
      // Add delay to prevent rate limiting
      const timer = setTimeout(() => {
        loadDevelopers();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [accessToken, hasLoaded]);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = users.filter(userItem => 
        userItem.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userItem.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const loadDevelopers = async () => {
    if (!accessToken) {
      setError('No access token available');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log('Loading developers from API...');
      
      const response = await fetch(`${Api.BASE_API}/api/v1/auth/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response:', data);

      if (data.success) {
        // Filter users based on current user's role
        const allUsers = data.dataResponse || [];
        
        let filteredUsers;
        if (user?.role === 'DEVELOPER') {
          // DEVELOPER sees CUSTOMER users
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          filteredUsers = allUsers.filter((userItem: any) => userItem.role === 'CUSTOMER');
        } else if (user?.role === 'CUSTOMER') {
          // CUSTOMER sees DEVELOPER users
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          filteredUsers = allUsers.filter((userItem: any) => userItem.role === 'DEVELOPER');
        } else {
          // Default: show all users
          filteredUsers = allUsers;
        }
        
        console.log('Filtered users:', filteredUsers);
        setUsers(filteredUsers);
        setFilteredUsers(filteredUsers);
        setHasLoaded(true);
      } else {
        throw new Error(data.message || 'Failed to load users');
      }
    } catch (err) {
      console.error('Error loading developers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load developers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectDeveloper = (developer: UserProfile) => {
    onSelectDeveloper(developer);
  };

  console.log('DeveloperList render state:', { isLoading, error, usersCount: users.length, filteredCount: filteredUsers.length });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải danh sách developers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={() => {
              setError(null);
              setRetryCount(prev => prev + 1);
              setHasLoaded(false);
              // Add exponential backoff for retries
              const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
              setTimeout(() => {
                loadDevelopers();
              }, delay);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Thử lại {retryCount > 0 && `(${retryCount})`}
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">
              {searchTerm ? 'Không tìm thấy người dùng nào' : 'Không có người dùng nào'}
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredUsers.map((userItem) => (
              <button
                key={userItem.id}
                type="button"
                className={`w-full p-4 border rounded-lg transition-colors text-left ${
                  selectedDeveloperId === userItem.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleSelectDeveloper(userItem)}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {userItem.avatarUrl ? (
                      <img
                        src={userItem.avatarUrl}
                        alt={userItem.fullname}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {userItem.fullname}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {userItem.email}
                    </p>
                    {userItem.phone && (
                      <p className="text-xs text-gray-400 truncate">
                        {userItem.phone}
                      </p>
                    )}
                  </div>

                  {/* Select Status */}
                  <div className="flex-shrink-0">
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-full ${
                        selectedDeveloperId === userItem.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {selectedDeveloperId === userItem.id ? 'Đã chọn' : 'Chọn'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperList;
