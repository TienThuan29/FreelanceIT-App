import { Router } from "express";
import momoApi from "../api/momo.api";

const router = Router();

router.post("/payment", (req, res, next) => momoApi.createPayment(req, res, next));

router.post("/callback", (req, res, next) => momoApi.callback(req, res, next));

router.get("/transaction-status", (req, res,next) => momoApi.transactionStatus(req, res, next));

export default router;