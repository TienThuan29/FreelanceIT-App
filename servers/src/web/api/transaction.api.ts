import { Request, Response } from 'express';
import { TransactionService } from '@/services/transaction.service';
import { ResponseUtil } from '@/libs/response';
import { AuthService } from '@/services/auth.service';
import logger from '@/libs/logger';

export class TransactionApi {
    private readonly transactionService: TransactionService;
    private readonly authService: AuthService;

    constructor() {
        this.transactionService = new TransactionService();
        this.authService = new AuthService();

        this.getUserTransactions = this.getUserTransactions.bind(this);
        this.getTransactionById = this.getTransactionById.bind(this);
        this.getAllTransactions = this.getAllTransactions.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
    }

    public async getUserTransactions(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const transactions = await this.transactionService.getUserTransactions(currentUser.id);
            ResponseUtil.success(response, transactions, 'Lấy lịch sử giao dịch thành công');
        } catch (error) {
            logger.error('Error getting user transactions:', error);
            ResponseUtil.error(response, 'Lỗi server', 500);
        }
    }

    public async getTransactionById(request: Request, response: Response) {
        try {
            const { id } = request.params;
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            const transaction = await this.transactionService.getTransactionById(id);

            if (!transaction) {
                ResponseUtil.error(response, 'Không tìm thấy giao dịch', 404);
                return;
            }

            // Check if user owns this transaction or is admin
            if (transaction.userId !== currentUser.id && currentUser.role !== 'ADMIN') {
                ResponseUtil.error(response, 'Không có quyền truy cập', 403);
                return;
            }

            ResponseUtil.success(response, transaction, 'Lấy thông tin giao dịch thành công');
        } catch (error) {
            logger.error('Error getting transaction by id:', error);
            ResponseUtil.error(response, 'Lỗi server', 500);
        }
    }

    public async getAllTransactions(request: Request, response: Response) {
        try {
            const currentUser = await this.authService.getUserByToken(this.getAccessToken(request));
            
            if (!currentUser) {
                ResponseUtil.error(response, 'Không tìm thấy người dùng', 404);
                return;
            }

            if (currentUser.role !== 'ADMIN') {
                ResponseUtil.error(response, 'Chỉ ADMIN mới có thể xem tất cả giao dịch', 403);
                return;
            }

            const transactions = await this.transactionService.getAllTransactions();
            ResponseUtil.success(response, transactions, 'Lấy danh sách giao dịch thành công');
        } catch (error) {
            logger.error('Error getting all transactions:', error);
            ResponseUtil.error(response, 'Lỗi server', 500);
        }
    }

    private getAccessToken(request: Request): string {
        const authHeader = request.headers.authorization;
        return authHeader ? authHeader.substring(7) : '';
    }
}


