import { Router } from 'express';
import { GoogleAuthApi } from '@/web/api/google-auth.api';

const router = Router();
const googleAuthApi = new GoogleAuthApi();

/**
 * @swagger
 * /auth/google/login:
 *   get:
 *     summary: Initiate Google OAuth2 login
 *     description: Returns Google OAuth2 authorization URL
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Google OAuth2 URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     authUrl:
 *                       type: string
 *                       description: Google OAuth2 authorization URL
 *       500:
 *         description: Failed to initiate Google login
 */
router.get('/login', googleAuthApi.login);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth2 callback
 *     description: Exchange authorization code for tokens and authenticate existing user only
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *     responses:
 *       200:
 *         description: Google authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     userProfile:
 *                       $ref: '#/components/schemas/UserProfile'
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       400:
 *         description: Authorization code is required or Google authentication failed
 *       403:
 *         description: Email not registered or account disabled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email not registered. Please register first before using Google login."
 *       500:
 *         description: Google authentication failed
 */
router.get('/callback', googleAuthApi.callback);

/**
 * @swagger
 * /auth/google/profile:
 *   post:
 *     summary: Get user profile from Google
 *     description: Retrieve user profile information using Google access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: Google access token
 *     responses:
 *       200:
 *         description: Google user profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     picture:
 *                       type: string
 *                     verified_email:
 *                       type: boolean
 *       400:
 *         description: Google access token is required or failed to get profile
 *       500:
 *         description: Failed to get Google user profile
 */
router.post('/profile', googleAuthApi.getProfile);

export default router;
