'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';
import { Api } from '@/configs/api';
import { Constant } from '@/configs/constant';

function GoogleCallbackPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setUser, setAccessToken, setRefreshToken } = useAuth();

    useEffect(() => {
        const handleGoogleCallback = async () => {
            const code = searchParams.get('code');
            const error = searchParams.get('error');
            const state = searchParams.get('state');

            console.log('Google callback received:', { code: !!code, error, state });

            if (error) {
                console.error('Google OAuth error:', error);
                toast.error('Google authentication failed');
                router.push('/login');
                return;
            }

            if (code) {
                try {
                    const response = await axios.get(`${Api.BASE_API}${Api.Auth.GOOGLE_CALLBACK}?code=${code}`);
                    
                    if (response.data.success) {
                        const authData = response.data.dataResponse;
                        
                        // Save auth data to localStorage
                        const authTokenData = {
                            accessToken: authData.accessToken,
                            refreshToken: authData.refreshToken,
                            userProfile: authData.userProfile
                        };
                        localStorage.setItem(Constant.AUTH_TOKEN_KEY, JSON.stringify(authTokenData));
                        
                        // Update AuthContext
                        setUser(authData.userProfile);
                        setAccessToken(authData.accessToken);
                        setRefreshToken(authData.refreshToken);
                        
                        toast.success('Đăng nhập Google thành công!');
                        
                        // Force page reload to ensure AuthContext picks up the new tokens
                        setTimeout(() => {
                            window.location.href = '/projects';
                        }, 500);
                    } else {
                        throw new Error(response.data.message || 'Authentication failed');
                    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    console.error('Error handling Google callback:', error);
                    const errorMessage = error.response?.data?.message || error.message || 'Failed to authenticate with Google';
                    toast.error(errorMessage);
                    router.push('/login');
                }
            } else {
                router.push('/login');
            }
        };

        handleGoogleCallback();
    }, [searchParams, setUser, setAccessToken, setRefreshToken, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Processing Google authentication...</p>
            </div>
        </div>
    );
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <GoogleCallbackPageContent />
        </Suspense>
    );
}