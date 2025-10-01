import { Router } from "express";
import authRouter from "./auth.route";

const router = Router();

router.use('/auth', authRouter);
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