import { Router } from 'express';
import { AdminStatsApi } from '@/web/api/admin-stats.api';
import { authenticate, authorize } from '@/web/middlewares/auth.middleware';
import { Role } from '@/models/user.model';

const router = Router();
const api = new AdminStatsApi();

// Protect stats for ADMIN or SYSTEM
router.use(authenticate);
router.get('/stats', authorize([Role.ADMIN, Role.SYSTEM]), api.getStats);
router.get('/sidebar-stats', authorize([Role.ADMIN, Role.SYSTEM]), api.getSidebarStats);

export default router;


