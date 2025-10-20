import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.middleware";
import { CustomerApi } from "../api/customer.api";

const router = Router();
const customerApi = new CustomerApi();

router.use(authenticate);

// CustomerProfile CRUD routes
router.post('/profile', authorize(['CUSTOMER']), customerApi.createCustomerProfile);
router.get('/profile/:userId', authorize(['CUSTOMER']), customerApi.getCustomerProfile);
router.put('/profile/:userId', authorize(['CUSTOMER']), customerApi.updateCustomerProfile);
router.delete('/profile/:userId', authorize(['CUSTOMER']), customerApi.deleteCustomerProfile);
router.get('/profiles', authorize(['CUSTOMER']), customerApi.getAllCustomerProfiles);

// Admin routes for customer management
router.get('/admin/list', authorize(['ADMIN']), customerApi.getAllCustomerProfiles);

// Chatbot routes
router.post('/chatbot/send-message', authorize(['CUSTOMER']), customerApi.sendMessage);
router.post('/chatbot/get-sessions', authorize(['CUSTOMER']), customerApi.getChatbotSessionsByUserId);
router.get('/chatbot/session/:sessionId', authorize(['CUSTOMER']), customerApi.getChatbotSessionById);

export default router;