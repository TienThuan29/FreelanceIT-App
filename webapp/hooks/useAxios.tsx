import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs';
import { Api } from '@/configs/api';
import { useMemo, useCallback } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile } from '@/types/user.type';
import { PageUrl } from '@/configs/page.url';
import { Constant } from '@/configs/constant';

const useAxios = () => {

    const { accessToken, refreshToken, user, setUser, setAccessToken, setRefreshToken } = useAuth();
    const memoizedSetUser = useCallback((userProfile: UserProfile) => setUser(userProfile), [setUser]);
    const memoizedSetAccessToken = useCallback((token: string) => setAccessToken(token), [setAccessToken]);
    const memoizedSetRefreshToken = useCallback((token: string) => setRefreshToken(token), [setRefreshToken]);

    const AxiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: Api.BASE_API,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        instance.interceptors.request.use(async req => {
            if (!accessToken) return req;
            
            const decodedToken = jwtDecode(accessToken);
            const isExpired = decodedToken.exp ? dayjs.unix(decodedToken.exp).diff(dayjs()) < 1 : true;
            if (!isExpired) return req;

            if (!refreshToken) {
                window.location.replace(PageUrl.LOGIN_PAGE);
                return req;
            }

            try {
                const response = await axios.post(Api.BASE_API + Api.Auth.REFRESH_TOKEN, {
                    refreshToken: refreshToken
                });

                const newAccessToken = response.data.dataResponse.accessToken;
                memoizedSetAccessToken(newAccessToken);
                
                const storedAuth = localStorage.getItem(Constant.AUTH_TOKEN_KEY);
                if (storedAuth) {
                    const authData = JSON.parse(storedAuth);
                    authData.accessToken = newAccessToken;
                    localStorage.setItem(Constant.AUTH_TOKEN_KEY, JSON.stringify(authData));
                }

                req.headers.Authorization = `Bearer ${newAccessToken}`;
            } 
            catch (error) {
                memoizedSetUser(null as any);
                memoizedSetAccessToken(null as any);
                memoizedSetRefreshToken(null as any);
                localStorage.removeItem(Constant.AUTH_TOKEN_KEY);
                window.location.replace(PageUrl.LOGIN_PAGE);
            }
            
            return req;
        });

        instance.interceptors.response.use(
            response => response,
            error => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    memoizedSetUser(null as any);
                    memoizedSetAccessToken(null as any);
                    memoizedSetRefreshToken(null as any);
                    localStorage.removeItem(Constant.AUTH_TOKEN_KEY);
                    window.location.replace(PageUrl.LOGIN_PAGE);
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }, [accessToken, refreshToken, memoizedSetUser, memoizedSetAccessToken, memoizedSetRefreshToken]);

    return AxiosInstance;
}

export default useAxios;
