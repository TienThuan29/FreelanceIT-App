import { Router } from "express";
import authRouter from "./auth.route";
import projectRouter from "./project.route";
import googleAuthRouter from "./google-auth.route";
import developerRouter from "./developer.route";
import testDataRouter from "./test-data.route";
import customerRouter from "./customer.route";
import chatRouter from "./chat.route";

const router = Router();

router.use('/auth', authRouter);
router.use('/auth/google', googleAuthRouter);
router.use('/projects', projectRouter);
router.use('/developers', developerRouter);
router.use('/customers', customerRouter);

router.use('/test-data', testDataRouter);
router.use('/chat', chatRouter);
/**
 * @swagger
 * /health:
 *   get:
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/health', (_, response) => {
  response.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});


export default router;