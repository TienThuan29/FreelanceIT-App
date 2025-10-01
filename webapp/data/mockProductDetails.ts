import type { ProductDetail, ProductReview, ChangelogEntry, Developer } from '../types'
import { generateAvatar, generateProductImage, techStackImages } from '../utils/imageUtils'

/**
 * Mock data cho product details
 */
export const mockProductDetails: ProductDetail[] = [
  {
    id: 'prod_001',
    title: 'E-commerce Platform Template',
    description: 'Template hoàn chỉnh cho website bán hàng với admin dashboard, payment integration và responsive design. Được xây dựng với React và Node.js, hỗ trợ đầy đủ tính năng của một website thương mại điện tử hiện đại.',
    category: 'template',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Express', 'JWT', 'Cloudinary'],
    images: [
      generateProductImage('E-commerce Homepage', 800, 600, '4F46E5'),
      generateProductImage('Admin Dashboard', 800, 600, '059669'),
      generateProductImage('Product Page', 800, 600, 'DC2626'),
      generateProductImage('Checkout Process', 800, 600, '7C3AED'),
      generateProductImage('Mobile Responsive', 800, 600, 'EA580C')
    ],
    liveUrl: 'https://demo-ecommerce.netlify.app',
    githubUrl: 'https://github.com/developer/ecommerce-template',
    price: 2500000,
    developerId: 'dev1',
    developer: {
      id: 'dev1',
      name: 'Nguyễn Văn Nam',
      email: 'nam.nguyen@email.com',
      avatar: generateAvatar('Nguyễn Văn Nam', '3B82F6'),
      bio: 'Full-stack developer với 5 năm kinh nghiệm phát triển web applications',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      experience: 5,
      rating: 4.8,
      location: 'TP. Hồ Chí Minh',
      hourlyRate: 500000,
      isAvailable: true,
      joinedDate: new Date('2019-01-15'),
      completedProjects: 45
    },
    features: [
      'Responsive Design cho mọi thiết bị',
      'Admin Dashboard với đầy đủ tính năng quản lý',
      'Tích hợp Payment Gateway (Stripe, PayPal)',
      'Quản lý sản phẩm với categories và variants',
      'Shopping cart và wishlist',
      'User authentication và profile management',
      'Order tracking và history',
      'Email notifications',
      'SEO optimized',
      'Multi-language support',
      'Reviews và ratings system',
      'Inventory management',
      'Sales analytics và reports',
      'Coupon và discount system'
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    status: 'active',
    tags: ['ecommerce', 'react', 'template', 'nodejs', 'fullstack'],
    downloads: 156,
    views: 2340,
    likes: 89,
    documentation: `# E-commerce Platform Documentation

## Giới thiệu
Template e-commerce hoàn chỉnh được xây dựng với React và Node.js...

## Cài đặt
\`\`\`bash
npm install
npm run dev
\`\`\`

## Cấu hình
1. Tạo file .env
2. Thêm các biến môi trường...`,
    demoCredentials: {
      username: 'admin@demo.com',
      password: 'demo123'
    },
    support: {
      included: true,
      duration: '6 tháng',
      channels: ['Email', 'Discord', 'Documentation']
    },
    license: {
      type: 'commercial',
      description: 'Sử dụng cho mục đích thương mại, không giới hạn domain'
    },
    updates: {
      included: true,
      duration: '1 năm'
    },
    compatibility: ['React 18+', 'Node.js 16+', 'MongoDB 4.4+', 'Modern Browsers'],
    requirements: [
      'Node.js phiên bản 16 trở lên',
      'MongoDB database',
      'Stripe account cho payment',
      'Cloudinary account cho image storage'
    ],
    changelog: [
      {
        version: '2.1.0',
        date: new Date('2024-01-20'),
        changes: [
          'Thêm tính năng wishlist',
          'Cải thiện performance',
          'Fix bug responsive mobile'
        ],
        type: 'minor'
      },
      {
        version: '2.0.0',
        date: new Date('2024-01-15'),
        changes: [
          'Refactor codebase với TypeScript',
          'Thêm admin dashboard mới',
          'Tích hợp payment gateway'
        ],
        type: 'major'
      }
    ],
    relatedProducts: ['prod_002', 'prod_004'],
    reviews: [
      {
        id: 'review_001',
        userId: 'user_001',
        userName: 'Trần Văn A',
        userAvatar: 'https://via.placeholder.com/40',
        rating: 5,
        comment: 'Template rất tốt, code clean và documentation chi tiết. Highly recommended!',
        createdAt: new Date('2024-01-18'),
        helpful: 12,
        verified: true
      },
      {
        id: 'review_002',
        userId: 'user_002',
        userName: 'Nguyễn Thị B',
        rating: 4,
        comment: 'Chất lượng tốt, tuy nhiên có một số bugs nhỏ cần fix.',
        createdAt: new Date('2024-01-16'),
        helpful: 8,
        verified: true
      }
    ]
  },
  {
    id: 'prod_002',
    title: 'Task Management App',
    description: 'Ứng dụng quản lý công việc với tính năng real-time collaboration và project tracking. Được thiết kế cho teams và individuals, hỗ trợ Kanban boards, time tracking, và báo cáo chi tiết.',
    category: 'software',
    techStack: ['React', 'Socket.io', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
    images: [
      'https://via.placeholder.com/800x600/3B82F6/ffffff?text=Dashboard',
      'https://via.placeholder.com/800x600/10B981/ffffff?text=Kanban+Board',
      'https://via.placeholder.com/800x600/F59E0B/ffffff?text=Time+Tracking',
      'https://via.placeholder.com/800x600/EF4444/ffffff?text=Reports',
      'https://via.placeholder.com/800x600/8B5CF6/ffffff?text=Team+View'
    ],
    liveUrl: 'https://taskapp-demo.herokuapp.com',
    githubUrl: 'https://github.com/developer/task-management',
    price: 1800000,
    developerId: 'dev2',
    developer: {
      id: 'dev2',
      name: 'Trần Thị Linh',
      email: 'linh.tran@email.com',
      avatar: 'https://via.placeholder.com/150x150/EC4899/ffffff?text=TTL',
      bio: 'Mobile developer chuyên Flutter với passion về UI/UX design',
      skills: ['Flutter', 'Dart', 'Firebase', 'UI/UX'],
      experience: 3,
      rating: 4.9,
      location: 'Hà Nội',
      hourlyRate: 450000,
      isAvailable: false,
      joinedDate: new Date('2021-03-10'),
      completedProjects: 28
    },
    features: [
      'Real-time collaboration với Socket.io',
      'Kanban boards với drag & drop',
      'Time tracking và reporting',
      'Team management và permissions',
      'Project templates',
      'File attachments',
      'Due dates và notifications',
      'Activity timeline',
      'Mobile responsive',
      'Dark/Light theme',
      'Export data (PDF, Excel)',
      'Calendar integration',
      'Search và filters',
      'Custom fields'
    ],
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2024-01-05'),
    status: 'active',
    tags: ['productivity', 'collaboration', 'react', 'realtime'],
    downloads: 203,
    views: 3120,
    likes: 127,
    documentation: `# Task Management App Documentation

## Overview
Professional task management application with real-time features...`,
    support: {
      included: true,
      duration: '3 tháng',
      channels: ['Email', 'GitHub Issues']
    },
    license: {
      type: 'personal',
      description: 'Sử dụng cho mục đích cá nhân và dự án nhỏ'
    },
    updates: {
      included: true,
      duration: '6 tháng'
    },
    compatibility: ['React 18+', 'Node.js 16+', 'PostgreSQL 12+'],
    requirements: [
      'Node.js 16+',
      'PostgreSQL database',
      'Redis server'
    ],
    changelog: [],
    relatedProducts: ['prod_001'],
    reviews: []
  }
]

/**
 * Lấy product detail theo ID
 * @param id - ID của sản phẩm
 * @returns Product detail hoặc undefined
 */
export const getProductDetailById = (id: string): ProductDetail | undefined => {
  return mockProductDetails.find(product => product.id === id)
}

/**
 * Lấy sản phẩm liên quan
 * @param productId - ID của sản phẩm hiện tại
 * @returns Danh sách sản phẩm liên quan
 */
export const getRelatedProducts = (productId: string): ProductDetail[] => {
  const currentProduct = getProductDetailById(productId)
  if (!currentProduct) return []
  
  return mockProductDetails.filter(product => 
    product.id !== productId &&
    (product.category === currentProduct.category ||
     product.techStack.some(tech => currentProduct.techStack.includes(tech)))
  ).slice(0, 3)
}

/**
 * Lấy sản phẩm theo developer
 * @param developerId - ID của developer
 * @returns Danh sách sản phẩm của developer
 */
export const getProductsByDeveloper = (developerId: string): ProductDetail[] => {
  return mockProductDetails.filter(product => product.developerId === developerId)
}

/**
 * Lấy thống kê sản phẩm
 * @returns Thống kê tổng quan
 */
export const getProductStats = () => {
  const products = mockProductDetails
  return {
    total: products.length,
    totalDownloads: products.reduce((sum, p) => sum + p.downloads, 0),
    totalViews: products.reduce((sum, p) => sum + p.views, 0),
    averageRating: products.reduce((sum, p) => {
      const avgRating = p.reviews.length > 0 
        ? p.reviews.reduce((rSum, r) => rSum + r.rating, 0) / p.reviews.length 
        : 0
      return sum + avgRating
    }, 0) / products.length
  }
}