import { google } from 'googleapis';
import { config } from '@/configs/config';
import { UserRepository } from '@/repositories/user.repo';
import { User, Role } from '@/models/user.model';
import { AuthResponse } from '@/types/auth.type';
import { mapUserToUserProfileResponse } from '@/libs/mappers/user.mapper';
import { JwtUtil } from '@/utils/jwt.util';
import logger from '@/libs/logger';

export interface GoogleUserInfo {
    id: string;
    email: string;
    name: string;
    picture?: string;
    verified_email: boolean;
}

export class GoogleAuthService {
    private readonly userRepository: UserRepository;
    private readonly oauth2Client: any;

    constructor() {
        this.userRepository = new UserRepository();
        this.oauth2Client = new google.auth.OAuth2(
            config.GOOGLE_CLIENT_ID,
            config.GOOGLE_CLIENT_SECRET,
            process.env.NODE_ENV === 'production' 
                ? 'https://yourdomain.com/auth/google/callback'
                : 'http://localhost:3000/auth/google/callback'
        );
    }

    /**
     * Generate Google OAuth2 authorization URL
     */
    public getAuthUrl(): string {
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
        ];

        const redirectUri = process.env.NODE_ENV === 'production' 
            ? 'https://yourdomain.com/auth/google/callback'
            : 'http://localhost:3000/auth/google/callback';
        
        logger.info(`Google OAuth2 redirect URI: ${redirectUri}`);

        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true
        });
    }

    /**
     * Exchange authorization code for access token and get user info
     */
    public async getTokenAndUserInfo(code: string): Promise<GoogleUserInfo> {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);

            const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
            const { data } = await oauth2.userinfo.get();

            return {
                id: data.id!,
                email: data.email!,
                name: data.name!,
                picture: data.picture || undefined,
                verified_email: data.verified_email || false
            };
        } catch (error) {
            logger.error('Error getting Google user info:', error);
            throw new Error('Failed to get Google user information');
        }
    }

    /**
     * Authenticate user with Google OAuth2 (only for existing users)
     */
    public async authenticateWithGoogle(googleUserInfo: GoogleUserInfo): Promise<AuthResponse> {
        try {
            // Check if user already exists in database
            const user = await this.userRepository.findByEmail(googleUserInfo.email);

            if (!user) {
                throw new Error('Email not registered. Please register first before using Google login.');
            }

            if (!user.isEnable) {
                throw new Error('Account is disabled. Please contact support.');
            }

            // Update existing user with Google ID if not already set
            let updatedUser = user;
            if (!user.googleId) {
                const updateResult = await this.userRepository.update(user.id, {
                    googleId: googleUserInfo.id,
                    avatar: googleUserInfo.picture || user.avatar,
                    updatedDate: new Date()
                });
                if (updateResult) {
                    updatedUser = updateResult;
                }
            }

            if (!updatedUser) {
                throw new Error('Failed to update user information');
            }

            // Generate JWT tokens
            const tokenPayload = {
                id: updatedUser.id.toString(),
                email: updatedUser.email,
                role: updatedUser.role,
            };

            const accessToken = await JwtUtil.generateAccessToken(tokenPayload);
            const refreshToken = await JwtUtil.generateRefreshToken(tokenPayload);

            const authResponse: AuthResponse = {
                userProfile: await mapUserToUserProfileResponse(updatedUser),
                accessToken,
                refreshToken,
            };

            return authResponse;
        } catch (error) {
            logger.error('Error authenticating with Google:', error);
            if (error instanceof Error) {
                throw error; // Re-throw the specific error message
            }
            throw new Error('Failed to authenticate with Google');
        }
    }

    /**
     * Get user profile from Google using access token
     */
    public async getUserProfileFromGoogle(accessToken: string): Promise<GoogleUserInfo> {
        try {
            this.oauth2Client.setCredentials({ access_token: accessToken });
            
            const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
            const { data } = await oauth2.userinfo.get();

            return {
                id: data.id!,
                email: data.email!,
                name: data.name!,
                picture: data.picture || undefined,
                verified_email: data.verified_email || false
            };
        } catch (error) {
            logger.error('Error getting user profile from Google:', error);
            throw new Error('Failed to get user profile from Google');
        }
    }
}
