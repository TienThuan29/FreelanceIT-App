import { authenticate, validateSystemSecret } from '@/web/middlewares/auth.middleware';
import { AuthApi } from '@/web/api/auth.api';
import { Router } from 'express';

const router = Router();
const authApi = new AuthApi();

router.post('/create-account', validateSystemSecret, (req, res, next) => authApi.createAccount(req, res, next));

router.post('/register', (req, res) => authApi.register(req, res));

router.post('/verify-code', (req, res) => authApi.verifyCode(req, res));

router.post('/forgot-password', (req, res) => authApi.forgotPassword(req, res));

router.post('/reset-password', (req, res) => authApi.resetPassword(req, res));

router.post('/authenticate', (req, res, next) => authApi.authenticate(req, res, next));

router.post('/refresh-token', authApi.refreshToken);

router.get('/profile', authenticate, (req, res) => authApi.getProfile(req, res));

router.get('/users', authenticate, (req, res, next) => authApi.getAllUsers(req, res, next));

// router.post('/users/by-email', authenticate, (req, res, next) => authApi.getUserByEmail(req, res, next));

// router.put('/users/update', authenticate, authorize([Role.SYSTEM]), (req, res, next) => authApi.updateUser(req, res, next));

// router.delete('/users/delete', authenticate, authorize([Role.SYSTEM]), (req, res, next) => authApi.deleteUser(req, res, next));

// router.patch('/users/status', authenticate, authorize([Role.SYSTEM]), (req, res, next) => authApi.updateUserStatus(req, res, next));

export default router;