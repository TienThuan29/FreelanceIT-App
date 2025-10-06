import { Router } from "express";
import authRouter from "./auth.route";
import projectRouter from "./project.route";
import googleAuthRouter from "./google-auth.route";

const router = Router();

router.use('/auth', authRouter);
router.use('/auth/google', googleAuthRouter);
router.use('/projects', projectRouter);
/**
 * @swagger
 * /health:
 *   get:
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/health', (request, response) => {
  response.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});


export default router;