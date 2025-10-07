import { Router } from "express";
import authRouter from "./auth.route";
import chatRouter from "./chat.route";

const router = Router();

router.use('/auth', authRouter);
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