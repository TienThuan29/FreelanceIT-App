import { CheckMomo, CreateMomoPaymentRequest } from "../types/req/momo.req.js";
import axios from "axios";
import crypto from "crypto";
import { config } from "../configs/config";
import { stat } from "fs";

export class MomoService {
  private static partnerCode = "MOMO";
  private static accessKey = "F8BBA842ECF85";
  private static secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
  private static redirectUrl = "http://localhost:3000/planning/pricing/success";
  private static ipnUrl = "https://sherilyn-infusorial-ervin.ngrok-free.dev/api/v1/momo/callback";

  static async createPayment({ userId, planningId, amount, orderInfo }: CreateMomoPaymentRequest) {
    const partnerCode = MomoService.partnerCode;
    const accessKey = MomoService.accessKey;
    const secretKey = MomoService.secretKey;
    const redirectUrl = MomoService.redirectUrl;
    const ipnUrl = MomoService.ipnUrl;
    const requestType = "payWithMethod";
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = JSON.stringify({ userId, planningId });
    const autoCapture = true;
    const lang = "vi";
    console.log("Access Key:", accessKey);


    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);

    const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)


    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "FreeLanceIt",
      storeId: "MomoStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang,
      requestType,
      autoCapture,
      extraData,
      signature,
    });


    console.log("Request body sending to MoMo:", requestBody);
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/create',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      },
      data: requestBody
    }
    let result;
    try {
      result = await axios(options)
      return result.data;
    } catch (error) {
      return { message: "Error connecting to MoMo", error };
    }
  }
  static async handleCallback(payload: any) {
    console.log("Callback from MoMo:", payload);

    if (payload.resultCode === 0) {
      const { orderId, amount, extraData } = payload;
      const { userId, planningId } = JSON.parse(extraData);

      // TODO: lưu vào bảng user_planning (Prisma / TypeORM)
      console.log(`✅ Thanh toán thành công: user ${userId}, planning ${planningId}`);
    } else {
      console.warn(`❌ Thanh toán thất bại: ${payload.message}`);
    }

    return { message: "Callback received", result: payload };
  }


  static async getTransactionStatus(orderId: string) {


    const rawSignature = `accessKey=${MomoService.accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
    const signature = crypto.createHmac('sha256', MomoService.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: 'MOMO',
      requestId: orderId,
      orderId: orderId,
      signature: signature,
      lang: 'vi'
    });

    console.log("Request body for transaction status:", requestBody);

    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/query',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      },
      data: requestBody
    }
    let result;
    try {
      result = await axios(options)
      return result.data;
    } catch (error) {
      return { message: "Error connecting to MoMo", error };
    }
  };
}

