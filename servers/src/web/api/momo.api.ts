import { Request, Response, NextFunction } from "express";
import { MomoService } from "../../thirdparties/momo.service";

class MomoApi {
    async createPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await MomoService.createPayment(req.body);
            res.status(200).json(result);
        } catch (error: any) {
            console.error(" Error in createPayment:", error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }

    async callback(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await MomoService.handleCallback(req.body);
            res.status(200).json(result);
        } catch (error: any) {
            console.error("Momo callback error:", error.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }


    async transactionStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { orderId } = req.body;
            const result = await MomoService.getTransactionStatus(orderId);
            res.status(200).json(result);
        } catch (error: any) {
            console.error("Momo transaction status error:", error.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
export default new MomoApi();