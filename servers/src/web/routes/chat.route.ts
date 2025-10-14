import { Router } from 'express';
import { chatApi } from '@/web/api/chat.api';
import { authenticate } from '@/web/middlewares/auth.middleware';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticate);

// Get user conversations
router.get('/conversations', chatApi.getConversations);

// Create new conversation
router.post('/conversations', chatApi.createConversation);

// Get conversation by ID
router.get('/conversations/:conversationId', chatApi.getConversation);

// Update conversation (rename)
router.put('/conversations/:conversationId', chatApi.updateConversation);

// Delete conversation
router.delete('/conversations/:conversationId', chatApi.deleteConversation);

// Get messages in conversation
router.get('/conversations/:conversationId/messages', chatApi.getMessages);

// Mark messages as read
router.put('/messages/read', chatApi.markMessagesRead);

export default router;
