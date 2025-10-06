import { Router } from "express";
import { TestDataApi } from "@/web/api/test-data.api";
import { validateSystemSecret } from "@/web/middlewares/auth.middleware";

const router = Router();
const testDataApi = new TestDataApi();

// Apply system secret validation for test data endpoints
router.use(validateSystemSecret);

/**
 * @swagger
 * tags:
 *   name: Test Data
 *   description: API endpoints for generating test data
 */
router.post('/create-developers', testDataApi.createDevelopers);
router.delete('/clear-developers', testDataApi.clearDevelopers);

export default router;
