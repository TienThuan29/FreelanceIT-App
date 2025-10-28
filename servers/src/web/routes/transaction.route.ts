import { Router } from 'express';
import { TransactionApi } from '../api/transaction.api';

const router = Router();
const transactionApi = new TransactionApi();

// Get current user's transactions
router.get('/user/transactions', transactionApi.getUserTransactions);

// Get transaction by id
router.get('/transactions/:id', transactionApi.getTransactionById);

// Admin: Get all transactions
router.get('/admin/transactions', transactionApi.getAllTransactions);

export default router;


