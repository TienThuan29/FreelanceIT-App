import { useState, useCallback } from 'react';
import useAxios from './useAxios';
import { ChatbotSession, ChatItem } from '@/types/chatbot.type';
import { Api } from '@/configs/api';

export interface ChatbotSendMessageRequest {
    sessionId?: string;
    userId: string;
    chatInput: string;
}

export interface ChatbotSessionResponse {
    sessionId: string;
    userId: string;
    title?: string;
    description?: string;
    isDeleted?: boolean;
    createdDate?: string;
    updatedDate?: string;
}

export const useCustomerChatbot = () => {
    const axios = useAxios();
    const [loading, setLoading] = useState(false);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (request: ChatbotSendMessageRequest): Promise<ChatbotSession> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(Api.Customer.SEND_MESSAGE, request);
            return response.data.dataResponse;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to send message';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [axios]);

    const getChatbotSessions = useCallback(async (userId: string): Promise<ChatbotSessionResponse[]> => {
        setSessionsLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(Api.Customer.GET_SESSIONS, { userId });
            return response.data.dataResponse;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to get sessions';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setSessionsLoading(false);
        }
    }, [axios]);

    const getChatbotSession = useCallback(async (sessionId: string): Promise<ChatbotSession> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get(`${Api.Customer.GET_SESSION}/${sessionId}`);
            return response.data.dataResponse;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to get session';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [axios]);

    const renameChatbotSession = useCallback(async (sessionId: string, title: string): Promise<ChatbotSession> => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.put(`${Api.Customer.RENAME_SESSION}/${sessionId}/rename`, { title });
            return response.data.dataResponse;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to rename session';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [axios]);

    const deleteChatbotSession = useCallback(async (sessionId: string): Promise<void> => {
        setLoading(true);
        setError(null);
        
        try {
            await axios.delete(`${Api.Customer.DELETE_SESSION}/${sessionId}`);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to delete session';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [axios]);

    return {
        sendMessage,
        getChatbotSessions,
        getChatbotSession,
        renameChatbotSession,
        deleteChatbotSession,
        loading,
        sessionsLoading,
        error,
        clearError: () => setError(null)
    };
};
