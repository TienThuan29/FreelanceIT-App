'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAxios from './useAxios';
import { Api } from '@/configs/api';
import { TransactionHistory } from '@/types/transaction.type';

interface UseTransactionReturn {
  transactions: TransactionHistory[];
  isLoading: boolean;
  error: string | null;
  getUserTransactions: () => Promise<TransactionHistory[]>;
  getTransactionById: (id: string) => Promise<TransactionHistory | null>;
  getAllTransactions: () => Promise<TransactionHistory[]>;
  refreshTransactions: () => Promise<void>;
  clearError: () => void;
}

export const useTransaction = (): UseTransactionReturn => {
  const axiosInstance = useAxios();
  const [state, setState] = useState({
    transactions: [] as TransactionHistory[],
    isLoading: false,
    error: null as string | null,
  });

  const handleError = useCallback((error: any, operation: string) => {
    const errorMessage = error.response?.data?.message || error.message || `Failed to ${operation}`;
    setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    toast.error(errorMessage);
    console.error(`Error ${operation}:`, error);
  }, []);

  const getUserTransactions = useCallback(async (): Promise<TransactionHistory[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axiosInstance.get(Api.Transaction.GET_USER_TRANSACTIONS);
      const transactions: TransactionHistory[] = response.data.dataResponse || [];

      // Convert date strings to Date objects
      const formattedTransactions = transactions.map(t => ({
        ...t,
        createdDate: new Date(t.createdDate),
        cassoUpdatedDate: t.cassoUpdatedDate ? new Date(t.cassoUpdatedDate) : undefined
      }));

      setState(prev => ({
        ...prev,
        transactions: formattedTransactions,
        isLoading: false,
      }));

      return formattedTransactions;
    } catch (error) {
      handleError(error, 'fetch transactions');
      return [];
    }
  }, [axiosInstance, handleError]);

  const getTransactionById = useCallback(async (id: string): Promise<TransactionHistory | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axiosInstance.get(`${Api.Transaction.GET_TRANSACTION_BY_ID}/${id}`);
      const transaction: TransactionHistory | null = response.data.dataResponse || null;

      if (transaction) {
        transaction.createdDate = new Date(transaction.createdDate);
        if (transaction.cassoUpdatedDate) {
          transaction.cassoUpdatedDate = new Date(transaction.cassoUpdatedDate);
        }
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
      }));

      return transaction;
    } catch (error) {
      handleError(error, 'fetch transaction by id');
      return null;
    }
  }, [axiosInstance, handleError]);

  const getAllTransactions = useCallback(async (): Promise<TransactionHistory[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axiosInstance.get(Api.Transaction.GET_ALL_TRANSACTIONS);
      const transactions: TransactionHistory[] = response.data.dataResponse || [];

      // Convert date strings to Date objects
      const formattedTransactions = transactions.map(t => ({
        ...t,
        createdDate: new Date(t.createdDate),
        cassoUpdatedDate: t.cassoUpdatedDate ? new Date(t.cassoUpdatedDate) : undefined
      }));

      setState(prev => ({
        ...prev,
        transactions: formattedTransactions,
        isLoading: false,
      }));

      return formattedTransactions;
    } catch (error) {
      handleError(error, 'fetch all transactions');
      return [];
    }
  }, [axiosInstance, handleError]);

  const refreshTransactions = useCallback(async (): Promise<void> => {
    await getUserTransactions();
  }, [getUserTransactions]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    transactions: state.transactions,
    isLoading: state.isLoading,
    error: state.error,
    getUserTransactions,
    getTransactionById,
    getAllTransactions,
    refreshTransactions,
    clearError,
  };
};


