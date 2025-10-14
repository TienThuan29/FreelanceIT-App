import { Router } from 'express';
import { PlanningApi } from '@/web/api/planning.api';
import { authenticate, authorize } from '@/web/middlewares/auth.middleware';

const router = Router();
const planningApi = new PlanningApi();

// Admin CRUD routes
router.post('/admin/plannings', authenticate, authorize(['ADMIN']), planningApi.createPlanning);
router.get('/admin/plannings', authenticate, authorize(['ADMIN']), planningApi.getAllPlannings);
router.get('/admin/plannings/:id', authenticate, authorize(['ADMIN']), planningApi.getPlanningById);
router.put('/admin/plannings/:id', authenticate, authorize(['ADMIN']), planningApi.updatePlanning);
router.delete('/admin/plannings/:id', authenticate, authorize(['ADMIN']), planningApi.deletePlanning);

// Public planning routes
router.get('/plannings', planningApi.getAllPlannings);
router.get('/plannings/:id', planningApi.getPlanningById);

// User planning routes
router.post('/plannings/purchase', authenticate, planningApi.purchasePlanning);
router.get('/user/plannings', authenticate, planningApi.getUserPlannings);
router.get('/user/plannings/active', authenticate, planningApi.getActiveUserPlanning);
router.post('/plannings/:orderId/confirm-payment', planningApi.confirmPayment);

export default router;
