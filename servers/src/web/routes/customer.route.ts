import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { CustomerApi } from "../api/customer.api";

const router = Router();
const customerApi = new CustomerApi();

router.use(authenticate);
router.post('/chatbot/send-message', authorize(['CUSTOMER']), customerApi.sendMessage);
router.post('/chatbot/get-sessions', authorize(['CUSTOMER']), customerApi.getChatbotSessionsByUserId);
router.get('/chatbot/session/:sessionId', authorize(['CUSTOMER']), customerApi.getChatbotSessionById);

export default router;