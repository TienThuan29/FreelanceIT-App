'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Api } from '@/configs/api';
import { Constant } from '@/configs/constant';
import axios from 'axios';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const GoogleCallback: React.FC = () => {
  const { setUser, setAccessToken, setRefreshToken } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Get authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          setError('Google authentication was cancelled or failed');
          setIsProcessing(false);
          return;
        }

        if (!code) {
          setError('Authorization code not found');
          setIsProcessing(false);
          return;
        }

        // Call backend to process the authorization code
        const response = await axios.get(`${Api.BASE_API}${Api.Auth.GOOGLE_CALLBACK}?code=${code}`);

        if (response.data.success) {
          const authData = response.data.dataResponse;
          
          // Store authentication data
          console.log('Setting user data:', authData.userProfile);
          setUser(authData.userProfile);
          setAccessToken(authData.accessToken);
          setRefreshToken(authData.refreshToken);

          // Save to localStorage
          const authStorageData = {
            userProfile: authData.userProfile,
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken,
            loginTime: new Date().toISOString()
          };
          localStorage.setItem(Constant.AUTH_TOKEN_KEY, JSON.stringify(authStorageData));

        //   toast.success('Đăng nhập Google thành công!');
          
          // Use Next.js router for smoother navigation
          router.push('/');
        } else {
          setError(response.data.message || 'Google authentication failed');
        }
      } catch (error: any) {
        console.error('Google callback error:', error);
        
        if (error.response?.status === 403) {
          // Email not registered
          setError('Email chưa được đăng ký. Vui lòng đăng ký trước khi sử dụng đăng nhập Google.');
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError('Lỗi khi xử lý đăng nhập Google');
        }
      } finally {
        setIsProcessing(false);
      }
    };

    handleGoogleCallback();
  }, [setUser, setAccessToken, setRefreshToken, router]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-blue-700 mb-2">Đang đăng nhập...</h2>
          <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-700 mb-2">Đăng nhập thất bại</h2>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
          
          <div className="space-y-4">
            <a
              href="/login"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors inline-block"
            >
              Quay lại đăng nhập
            </a>
            <a
              href="/register"
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors inline-block"
            >
              Đăng ký tài khoản
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;
