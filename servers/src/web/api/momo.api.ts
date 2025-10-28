import { Request, Response, NextFunction } from "express";
import { MomoService } from "../../thirdparties/momo.service";
import { ResponseUtil } from "@/libs/response";
import logger from "@/libs/logger";

class MomoApi {
    private momoService: MomoService;

    constructor() {
        this.momoService = new MomoService();
    }

    async createPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.momoService.createPayment(req.body);
            ResponseUtil.success(res, result, 'Tạo thanh toán MoMo thành công');
        } catch (error: any) {
            logger.error("Error in createPayment:", error);
            ResponseUtil.error(res, error.message || 'Lỗi tạo thanh toán', 500);
        }
    }

    async callback(req: Request, res: Response, next: NextFunction) {
        console.log("Callback request:", req.body);
        try {
            const result = await this.momoService.handleCallback(req.body);
            ResponseUtil.success(res, result, 'Callback nhận thành công');
        } catch (error: any) {
            logger.error("Momo callback error:", error);
            ResponseUtil.error(res, 'Lỗi xử lý callback', 500);
        }
    }

    async transactionStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.body;
            const result = await this.momoService.getTransactionStatus(orderId);
            ResponseUtil.success(res, result, 'Lấy trạng thái giao dịch thành công');
        } catch (error: any) {
            logger.error("Momo transaction status error:", error);
            ResponseUtil.error(res, 'Lỗi lấy trạng thái giao dịch', 500);
        }
    }
}
export default new MomoApi();