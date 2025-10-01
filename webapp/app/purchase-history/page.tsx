"use client";

// import React from "react";
// import PurchaseHistory from '@/components/purchase-history';
// import { ProtectedRoute } from '@/contexts/AuthContext';
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface Purchase {
  id: string
  productId: string
  productTitle: string
  price: number
  paymentMethod: string
  userId: string
  purchaseDate: string
  status: string
}

export default function PurchaseHistoryPage() {
  const { user } = useAuth()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      const userPurchases = JSON.parse(localStorage.getItem('user_purchases') || '[]')
      const filteredPurchases = userPurchases.filter((purchase: Purchase) => purchase.userId === user.id)
      setPurchases(filteredPurchases)
    }
    setLoading(false)
  }, [user])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'credit_card': return 'Thẻ tín dụng'
      case 'bank_transfer': return 'Chuyển khoản'
      case 'ewallet': return 'Ví điện tử'
      default: return method
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử mua hàng</h1>

          {purchases.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có giao dịch nào
              </h3>
              <p className="text-gray-500 mb-4">
                Bạn chưa mua sản phẩm nào. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
              </p>
              <a
                href="/products-dev"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xem sản phẩm
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {purchase.productTitle}
                      </h3>
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>📅 Ngày mua: {new Date(purchase.purchaseDate).toLocaleDateString('vi-VN')}</p>
                        <p>💳 Phương thức: {getPaymentMethodName(purchase.paymentMethod)}</p>
                        <p>🆔 Mã giao dịch: {purchase.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600 mb-2">
                        {formatCurrency(purchase.price)}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${purchase.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {purchase.status === 'completed' ? '✅ Hoàn thành' : '⏳ Đang xử lý'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <a
                      href={`/products-detail/${purchase.productId}`}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Xem chi tiết sản phẩm
                    </a>
                    {purchase.status === 'completed' && (
                      <button className="text-green-600 hover:text-green-800 text-sm underline">
                        Tải xuống
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
  // return (
  //   <ProtectedRoute>
  //     <PurchaseHistory />
  //   </ProtectedRoute>
  // );
}
