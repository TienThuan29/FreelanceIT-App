import { Router } from "express";
import { ApplicationApi } from "@/web/api/application.api";
import { authenticate } from "@/web/middlewares/auth.middleware";

const router = Router();
const applicationApi = new ApplicationApi();

// Apply authentication middleware to all routes
router.use(authenticate);

// Application CRUD routes
router.post('/create', applicationApi.createApplication);
router.get('/by-project/:projectId', applicationApi.getApplicationsByProject);
router.get('/by-developer', applicationApi.getApplicationsByDeveloper);
router.get('/:id', applicationApi.getApplicationById);
router.put('/:id/status', applicationApi.updateApplicationStatus);
router.delete('/:id', applicationApi.deleteApplication);

// Utility routes
router.get('/check-applied/:projectId', applicationApi.checkUserAppliedToProject);

export default router;
