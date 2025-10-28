#!/bin/bash
echo "🧪 Testing MoMo Callback Endpoint..."
echo "===================================="
echo ""

# Check if server is running
if ! curl -s http://localhost:5000/api/v1/health > /dev/null 2>&1; then
    echo "❌ Server is not running on port 5000!"
    echo "Start it with: npm run dev"
    exit 1
fi

echo "✅ Server is running"
echo ""
echo "📤 Sending test callback to: http://localhost:5000/api/v1/momo/callback"
echo ""

# Send test callback
curl -X POST http://localhost:5000/api/v1/momo/callback \
  -H "Content-Type: application/json" \
  -d '{
    "partnerCode": "MOMO",
    "orderId": "MOMO1234567890",
    "requestId": "MOMO1234567890",
    "amount": 100000,
    "orderInfo": "Test payment",
    "resultCode": 0,
    "message": "Success",
    "extraData": "{\"userId\":\"test-user-123\",\"planningId\":\"test-plan-456\"}"
  }' \
  -v

echo ""
echo ""
echo "===================================="
echo "✅ Request sent!"
echo "Check your server terminal - you should see:"
echo "  'Callback request: { ... }'"
