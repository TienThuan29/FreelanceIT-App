'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Constant } from '@/configs/constant';
import { RegisterRequest, UserProfile, VerifyCodeRequest } from '@/types/user.type';
import axios, { HttpStatusCode } from 'axios';
import { Api } from '@/configs/api';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: UserProfile | null) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  register: (registerRequest: RegisterRequest) => Promise<boolean>;
  verifyCode: (verifyCodeRequest: VerifyCodeRequest) => Promise<boolean>;
}


interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const [user, setUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedAuth = localStorage.getItem(Constant.AUTH_TOKEN_KEY);
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);

          if (authData.accessToken && authData.userProfile) {
            try {
              const response = await axios.get(Api.BASE_API + Api.Auth.GET_PROFILE, {
                headers: {
                  Authorization: `Bearer ${authData.accessToken}`
                }
              });
              setUser(response.data.dataResponse);
              setAccessToken(authData.accessToken);
              setRefreshToken(authData.refreshToken);
            }
            catch (error) {
              if (authData.refreshToken) {
                try {
                  const response = await axios.post(Api.BASE_API + Api.Auth.REFRESH_TOKEN, {
                    headers: {
                      Authorization: `Bearer ${authData.refreshToken}`
                    }
                  });
                  const newAuthData = {
                    ...authData,
                    accessToken: response.data.dataResponse.accessToken,
                    refreshToken: response.data.dataResponse.refreshToken
                  };
                  localStorage.setItem(Constant.AUTH_TOKEN_KEY, JSON.stringify(newAuthData));
                  setAccessToken(response.data.dataResponse.accessToken);
                  setRefreshToken(response.data.dataResponse.refreshToken);
                  // Get profile with new token
                  const profileResponse = await axios.get(Api.BASE_API + Api.Auth.GET_PROFILE, {
                    headers: {
                      Authorization: `Bearer ${response.data.dataResponse.accessToken}`
                    }
                  });
                  setUser(profileResponse.data.dataResponse);
                } catch (refreshError) {
                  // Both tokens are invalid, clear auth data
                  localStorage.removeItem(Constant.AUTH_TOKEN_KEY);
                }
              } else {
                localStorage.removeItem(Constant.AUTH_TOKEN_KEY);
              }
            }
          } else {
            // Clear invalid auth data
            localStorage.removeItem(Constant.AUTH_TOKEN_KEY);
          }
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        localStorage.removeItem(Constant.AUTH_TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);


  const loginWithGoogle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Get Google OAuth2 URL from backend
      const response = await axios.get(Api.BASE_API + Api.Auth.GOOGLE_LOGIN);
      
      if (response.data.success && response.data.dataResponse.authUrl) {
        // Redirect to Google OAuth2 page
        window.location.href = response.data.dataResponse.authUrl;
      } else {
        toast.error('Không thể khởi tạo đăng nhập Google');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Lỗi khi đăng nhập với Google');
    } finally {
      setIsLoading(false);
    }
  };


  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await axios.post(Api.BASE_API + Api.Auth.LOGIN, { email, password });

      if (response) {
        setUser(response.data.dataResponse.userProfile);
        setAccessToken(response.data.dataResponse.accessToken);
        setRefreshToken(response.data.dataResponse.refreshToken);

        const authData = {
          userProfile: response.data.dataResponse.userProfile,
          accessToken: response.data.dataResponse.accessToken,
          refreshToken: response.data.dataResponse.refreshToken,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem(Constant.AUTH_TOKEN_KEY, JSON.stringify(authData));

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };


  const register = async (registerRequest: RegisterRequest): Promise<boolean> => {
      const sessionId = uuidv4();
      // save sessionId to localStorage
      localStorage.setItem(Constant.REGISTER_SESSION_ID_KEY, sessionId);
      const response = await axios.post(Api.BASE_API + Api.Auth.SIGNUP, { 
        ...registerRequest, registerSessionId: sessionId }
      );
      if (response.status == HttpStatusCode.Ok) {
        // Show message to user
        toast.success(response.data.message);
        return true;
      } 
      else {
        toast.error(response.data.message);
        return false;
      }
  }

  const verifyCode = async (verifyCodeRequest: VerifyCodeRequest): Promise<boolean> => {
    const response = await axios.post(Api.BASE_API + Api.Auth.VERIFY_CODE, verifyCodeRequest);
    if (response.status == HttpStatusCode.Ok) {
      toast.success(response.data.message);
      return true;
    } else {
      toast.error(response.data.message);
      return false;
    }
  }

  const logout = () => {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem(Constant.AUTH_TOKEN_KEY);
    };
    const isAuthenticated = !!user;

    const value: AuthContextType = {
      user,
      isAuthenticated,
      login,
      loginWithGoogle,
      logout,
      isLoading,
      accessToken,
      refreshToken,
      setUser,
      setAccessToken,
      setRefreshToken,
      register,
      verifyCode
    };

    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  };


  export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };


  /**
   * Protected Route Component
   */

  interface ProtectedRouteProps {
    children: ReactNode;
    fallback?: ReactNode;
    requiredRole?: 'DEVELOPER' | 'CUSTOMER' | 'SYSTEM' | 'ADMIN';
  }

  export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    fallback,
    requiredRole
  }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Vui lòng đăng nhập
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn cần đăng nhập để truy cập trang này
            </p>
            <a
              href="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đăng nhập
            </a>
          </div>
        </div>
      );
    }

    if (requiredRole && user?.role !== requiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Không có quyền truy cập
            </h2>
            <p className="text-gray-600 mb-6">
              Bạn không có quyền truy cập trang này
            </p>
            <a
              href="/"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Về trang chủ
            </a>
          </div>
        </div>
      );
    }

    return <>{children}</>;
  };