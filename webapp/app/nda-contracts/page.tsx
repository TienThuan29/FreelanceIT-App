"use client";

import React, { useState, useEffect } from "react";
// import NDAContractList from '@/components/nda-contract-list';
import { ProtectedRoute } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface NDAContract {
  id: string
  projectId?: string
  productId?: string
  projectTitle: string
  contractType: 'project' | 'product'
  partnerName: string
  partnerRole: 'employer' | 'developer'
  status: 'draft' | 'pending_employer' | 'pending_developer' | 'signed' | 'rejected'
  createdAt: Date
  signedAt?: Date
  ndaTerms: {
    duration: number
    penaltyAmount: number
  }
}

export default function NDAContractsPage() {
  const router = useRouter()
  const [contracts, setContracts] = useState<NDAContract[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'signed' | 'pending' | 'draft'>('all')

  useEffect(() => {
    loadContracts()
  }, [])

  const loadContracts = () => {
    setTimeout(() => {
      // Mock data
      const mockContracts: NDAContract[] = [
        {
          id: 'nda_001',
          projectId: '1',
          projectTitle: 'Website E-commerce cho Startup',
          contractType: 'project',
          partnerName: 'Công ty ABC Tech',
          partnerRole: 'employer',
          status: 'signed',
          createdAt: new Date('2024-01-15'),
          signedAt: new Date('2024-01-16'),
          ndaTerms: {
            duration: 24,
            penaltyAmount: 50000000
          }
        },
        {
          id: 'nda_002',
          productId: '2',
          projectTitle: 'Template Dashboard Admin',
          contractType: 'product',
          partnerName: 'Trần Văn B',
          partnerRole: 'developer',
          status: 'pending_developer',
          createdAt: new Date('2024-01-18'),
          ndaTerms: {
            duration: 12,
            penaltyAmount: 30000000
          }
        },
        {
          id: 'nda_003',
          projectId: '3',
          projectTitle: 'Mobile App Flutter',
          contractType: 'project',
          partnerName: 'Nguyễn Thị C',
          partnerRole: 'developer',
          status: 'draft',
          createdAt: new Date('2024-01-20'),
          ndaTerms: {
            duration: 18,
            penaltyAmount: 40000000
          }
        }
      ]

      setContracts(mockContracts)
      setLoading(false)
    }, 1000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const getStatusInfo = (status: NDAContract['status']) => {
    switch (status) {
      case 'draft':
        return { text: 'Bản nháp', color: 'bg-gray-100 text-gray-800', icon: '📝' }
      case 'pending_employer':
        return { text: 'Chờ Employer', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' }
      case 'pending_developer':
        return { text: 'Chờ Developer', color: 'bg-blue-100 text-blue-800', icon: '⏳' }
      case 'signed':
        return { text: 'Đã ký', color: 'bg-green-100 text-green-800', icon: '✅' }
      case 'rejected':
        return { text: 'Đã từ chối', color: 'bg-red-100 text-red-800', icon: '❌' }
      default:
        return { text: 'Không xác định', color: 'bg-gray-100 text-gray-800', icon: '❓' }
    }
  }

  const filteredContracts = contracts.filter(contract => {
    if (activeTab === 'all') return true
    if (activeTab === 'signed') return contract.status === 'signed'
    if (activeTab === 'pending') return contract.status.includes('pending')
    if (activeTab === 'draft') return contract.status === 'draft'
    return true
  })

  const getTabCounts = () => {
    return {
      all: contracts.length,
      signed: contracts.filter(c => c.status === 'signed').length,
      pending: contracts.filter(c => c.status.includes('pending')).length,
      draft: contracts.filter(c => c.status === 'draft').length
    }
  }

  const tabCounts = getTabCounts()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách hợp đồng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý hợp đồng NDA
          </h1>
          <p className="text-gray-600">
            Theo dõi và quản lý các hợp đồng bảo mật thông tin của bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{tabCounts.all}</div>
            <div className="text-sm text-gray-500">Tổng hợp đồng</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{tabCounts.signed}</div>
            <div className="text-sm text-gray-500">Đã ký</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">{tabCounts.pending}</div>
            <div className="text-sm text-gray-500">Chờ xử lý</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-2xl font-bold text-gray-600">{tabCounts.draft}</div>
            <div className="text-sm text-gray-500">Bản nháp</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'Tất cả', count: tabCounts.all },
                { key: 'signed', label: 'Đã ký', count: tabCounts.signed },
                { key: 'pending', label: 'Chờ xử lý', count: tabCounts.pending },
                { key: 'draft', label: 'Bản nháp', count: tabCounts.draft }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 text-sm font-medium border-b-2 ${activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contracts List */}
        {filteredContracts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có hợp đồng nào
            </h3>
            <p className="text-gray-500 mb-6">
              Bạn chưa có hợp đồng NDA nào trong danh mục này
            </p>
            <button
              onClick={() => router.push('/post')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Khám phá dự án
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContracts.map(contract => {
              const statusInfo = getStatusInfo(contract.status)

              return (
                <div
                  key={contract.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/nda-contract/${contract.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {contract.projectTitle}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {statusInfo.icon} {statusInfo.text}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {contract.contractType === 'project' ? '📋 Dự án' : '📦 Sản phẩm'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Đối tác</p>
                          <p className="font-medium">{contract.partnerName}</p>
                          <p className="text-xs text-gray-400">
                            ({contract.partnerRole === 'employer' ? 'Nhà tuyển dụng' : 'Developer'})
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Thời hạn bảo mật</p>
                          <p className="font-medium">{contract.ndaTerms.duration} tháng</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Mức phạt</p>
                          <p className="font-medium text-red-600">
                            {formatCurrency(contract.ndaTerms.penaltyAmount)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>📅 Tạo: {formatDate(contract.createdAt)}</span>
                        {contract.signedAt && (
                          <span>✅ Ký: {formatDate(contract.signedAt)}</span>
                        )}
                        <span>🆔 {contract.id}</span>
                      </div>
                    </div>

                    <div className="ml-4">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
  // return (
  //   <ProtectedRoute>
  //     <NDAContractList />
  //   </ProtectedRoute>
  // );
}
