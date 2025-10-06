import { Request, Response, NextFunction } from 'express';
import { GoogleAuthService } from '@/services/google-auth.service';
import { ResponseUtil } from '@/libs/response';
import logger from '@/libs/logger';

export class GoogleAuthApi {
    private readonly googleAuthService: GoogleAuthService;

    constructor() {
        this.googleAuthService = new GoogleAuthService();
        this.login = this.login.bind(this);
        this.callback = this.callback.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }

    /**
     * Initiate Google OAuth2 login
     * Redirects user to Google's authorization page
     */
    public async login(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const authUrl = this.googleAuthService.getAuthUrl();
            ResponseUtil.success(response, { authUrl }, 'Google OAuth2 URL generated successfully', 200);
        } catch (error) {
            logger.error('Google login error:', error);
            ResponseUtil.error(response, 'Failed to initiate Google login', 500);
        }
    }

    /**
     * Handle Google OAuth2 callback
     * Exchange authorization code for tokens and authenticate user
     */
    public async callback(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { code } = request.query;

            if (!code || typeof code !== 'string') {
                ResponseUtil.error(response, 'Authorization code is required', 400);
                return;
            }

            // Get user info from Google
            const googleUserInfo = await this.googleAuthService.getTokenAndUserInfo(code);

            // Authenticate user (only existing users)
            const authResponse = await this.googleAuthService.authenticateWithGoogle(googleUserInfo);

            ResponseUtil.success(response, authResponse, 'Google authentication successful', 200);
        } catch (error) {
            logger.error('Google callback error:', error);
            if (error instanceof Error) {
                // Check for specific error types
                if (error.message.includes('Email not registered')) {
                    ResponseUtil.error(response, error.message, 403); // Forbidden - user not registered
                } else if (error.message.includes('Account is disabled')) {
                    ResponseUtil.error(response, error.message, 403); // Forbidden - account disabled
                } else {
                    ResponseUtil.error(response, error.message, 400);
                }
            } else {
                ResponseUtil.error(response, 'Google authentication failed', 500);
            }
        }
    }

    /**
     * Get user profile using Google access token
     * This endpoint can be used to get user profile from Google API
     */
    public async getProfile(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { accessToken } = request.body;

            if (!accessToken) {
                ResponseUtil.error(response, 'Google access token is required', 400);
                return;
            }

            const userProfile = await this.googleAuthService.getUserProfileFromGoogle(accessToken);
            ResponseUtil.success(response, userProfile, 'Google user profile retrieved successfully', 200);
        } catch (error) {
            logger.error('Google profile error:', error);
            if (error instanceof Error) {
                ResponseUtil.error(response, error.message, 400);
            } else {
                ResponseUtil.error(response, 'Failed to get Google user profile', 500);
            }
        }
    }
}
