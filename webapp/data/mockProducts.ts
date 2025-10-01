import type { Product } from '../types'
import { generateAvatar } from '../utils/imageUtils'
import { realWorldImages } from '../utils/realImages'

/**
 * Mock data cho sản phẩm từ developers
 */
export const mockProducts: Product[] = [
  {
    id: 'prod_001',
    title: 'E-commerce Platform Template',
    description: 'Template hoàn chỉnh cho website bán hàng với admin dashboard, payment integration và responsive design. Được xây dựng với React và Node.js, hỗ trợ đầy đủ tính năng của một website thương mại điện tử hiện đại.',
    category: 'template',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Express', 'JWT', 'Cloudinary'],
    images: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=600&fit=crop&crop=center'
    ],
    liveUrl: 'https://demo-ecommerce.netlify.app',
    githubUrl: 'https://github.com/developer/ecommerce-template',
    price: 2500000,
    developerId: 'dev_001',
    developer: {
      id: 'dev_001',
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
      'Responsive design cho mọi thiết bị',
      'Admin dashboard với đầy đủ tính năng quản lý',
      'Tích hợp Payment Gateway (Stripe, PayPal)',
      'Quản lý sản phẩm với categories và variants',
      'Shopping cart và wishlist',
      'User authentication và profile management'
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    status: 'active',
    tags: ['ecommerce', 'react', 'template', 'nodejs', 'fullstack'],
    views: 2340,
    downloads: 156,
    likes: 89,
    reviews: []
  },
  {
    id: 'prod_002',
    title: 'Task Management App',
    description: 'Ứng dụng quản lý công việc với tính năng real-time collaboration và project tracking. Được thiết kế cho teams và individuals, hỗ trợ Kanban boards, time tracking, và báo cáo chi tiết.',
    category: 'software',
    techStack: ['React', 'Socket.io', 'Express', 'PostgreSQL', 'Redis', 'Docker'],
    images: [
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center'
    ],
    liveUrl: 'https://taskapp-demo.herokuapp.com',
    githubUrl: 'https://github.com/developer/task-management',
    price: 1800000,
    developerId: 'dev_002',
    developer: {
      id: 'dev_002',
      name: 'Trần Thị Linh',
      email: 'linh.tran@email.com',
      avatar: generateAvatar('Trần Thị Linh', 'EC4899'),
      bio: 'Software developer chuyên về productivity tools và collaboration platforms',
      skills: ['React', 'Socket.io', 'Express', 'PostgreSQL', 'Real-time'],
      experience: 4,
      rating: 4.9,
      location: 'Hà Nội',
      hourlyRate: 450000,
      isAvailable: false,
      joinedDate: new Date('2020-03-10'),
      completedProjects: 28
    },
    features: [
      'Real-time collaboration với Socket.io',
      'Kanban boards với drag & drop',
      'Time tracking và reporting',
      'Team management và permissions',
      'Project templates',
      'File attachments'
    ],
    createdAt: new Date('2023-12-20'),
    updatedAt: new Date('2024-01-05'),
    status: 'active',
    tags: ['productivity', 'collaboration', 'react', 'realtime'],
    views: 3120,
    downloads: 203,
    likes: 127,
    reviews: []
  },
  {
    id: 'prod_003',
    title: 'Personal Finance Mobile App',
    description: 'Ứng dụng mobile quản lý tài chính cá nhân được phát triển với Flutter. Bao gồm tracking chi tiêu, budget planning, báo cáo tài chính, và tích hợp với ngân hàng.',
    category: 'mobile',
    techStack: ['Flutter', 'Dart', 'Firebase', 'SQLite', 'Provider'],
    images: [
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=800&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=800&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=800&fit=crop&crop=center'
    ],
    liveUrl: 'https://play.google.com/store/apps/details?id=com.example.finance',
    githubUrl: 'https://github.com/developer/finance-app',
    price: 3200000,
    developerId: 'dev_003',
    developer: {
      id: 'dev_003',
      name: 'Lê Minh Tuấn',
      email: 'tuan.le@email.com',
      avatar: generateAvatar('Lê Minh Tuấn', '7C3AED'),
      bio: 'Mobile developer chuyên Flutter với expertise về fintech applications',
      skills: ['Flutter', 'Dart', 'Firebase', 'Mobile UI/UX', 'Fintech'],
      experience: 6,
      rating: 4.7,
      location: 'Đà Nẵng',
      hourlyRate: 550000,
      isAvailable: true,
      joinedDate: new Date('2018-08-20'),
      completedProjects: 42
    },
    features: [
      'Expense tracking với categories',
      'Budget planning và goals',
      'Financial reports và charts',
      'Multi-currency support',
      'Bank integration (Open Banking)',
      'Bill reminders'
    ],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-15'),
    status: 'active',
    tags: ['finance', 'mobile', 'flutter', 'personal'],
    views: 1560,
    downloads: 89,
    likes: 67,
    reviews: []
  },
  {
    id: 'prod_004',
    title: 'Modern Landing Page Collection',
    description: 'Bộ sưu tập 15 landing page templates modern với responsive design. Được tối ưu cho conversion, SEO và performance. Phù hợp cho startup, agency, portfolio, và product launch.',
    category: 'template',
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap 5', 'SASS', 'Webpack'],
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop&crop=center'
    ],
    liveUrl: 'https://modern-landing-templates.netlify.app',
    githubUrl: 'https://github.com/developer/landing-templates',
    price: 1200000,
    developerId: 'dev_004',
    developer: {
      id: 'dev_004',
      name: 'Phạm Thị Mai',
      email: 'mai.pham@email.com',
      avatar: generateAvatar('Phạm Thị Mai', 'F59E0B'),
      bio: 'Frontend developer & UI/UX designer với focus vào responsive design và user experience',
      skills: ['HTML/CSS', 'JavaScript', 'Bootstrap', 'Figma', 'Responsive Design'],
      experience: 4,
      rating: 4.6,
      location: 'TP. Hồ Chí Minh',
      hourlyRate: 400000,
      isAvailable: true,
      joinedDate: new Date('2020-06-15'),
      completedProjects: 38
    },
    features: [
      '15 unique landing page designs',
      'Fully responsive (mobile-first)',
      'Fast loading với optimized assets',
      'SEO optimized structure',
      'Cross-browser compatibility',
      'Easy customization'
    ],
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-10'),
    status: 'active',
    tags: ['template', 'landing-page', 'responsive', 'conversion'],
    views: 4890,
    downloads: 312,
    likes: 178,
    reviews: []
  },
  {
    id: 'prod_005',
    title: 'Restaurant Management System',
    description: 'Hệ thống quản lý nhà hàng toàn diện với POS, inventory management, staff scheduling, và customer management. Hỗ trợ multiple locations và real-time reporting.',
    category: 'software',
    techStack: ['Angular', 'Spring Boot', 'PostgreSQL', 'Redis', 'Docker'],
    images: [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'
    ],
    liveUrl: 'https://restaurant-demo.com',
    githubUrl: 'https://github.com/developer/restaurant-system',
    price: 4500000,
    developerId: 'dev_005',
    developer: {
      id: 'dev_005',
      name: 'Hoàng Văn Đức',
      email: 'duc.hoang@email.com',
      avatar: generateAvatar('Hoàng Văn Đức'),
      bio: 'Full-stack developer chuyên về enterprise solutions và POS systems',
      skills: ['Angular', 'Spring Boot', 'PostgreSQL', 'Microservices'],
      experience: 7,
      rating: 4.5,
      location: 'TP. Hồ Chí Minh',
      hourlyRate: 600000,
      isAvailable: true,
      joinedDate: new Date('2017-05-20'),
      completedProjects: 51
    },
    features: [
      'Point of Sale (POS) system',
      'Inventory management với alerts',
      'Staff scheduling và time tracking',
      'Customer management và loyalty program',
      'Kitchen display system',
      'Real-time reporting và analytics'
    ],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
    status: 'active',
    tags: ['restaurant', 'pos', 'management', 'enterprise'],
    views: 2180,
    downloads: 98,
    likes: 73,
    reviews: []
  },
  {
    id: 'prod_006',
    title: 'Social Media Dashboard UI Kit',
    description: 'Bộ UI components cho social media dashboard với React. Bao gồm charts, tables, forms, và widgets. Modern design với dark/light theme support.',
    category: 'template',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Chart.js', 'Framer Motion'],
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=600&fit=crop'
    ],
    liveUrl: 'https://ui-kit-demo.netlify.app',
    githubUrl: 'https://github.com/developer/social-dashboard-ui',
    price: 1800000,
    developerId: 'dev_006',
    developer: {
      id: 'dev_006',
      name: 'Nguyễn Thị Hương',
      email: 'huong.nguyen@email.com',
      avatar: generateAvatar('Nguyễn Thị Hương'),
      bio: 'UI/UX Designer và Frontend Developer với expertise về design systems',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Design Systems'],
      experience: 5,
      rating: 4.9,
      location: 'Hà Nội',
      hourlyRate: 480000,
      isAvailable: false,
      joinedDate: new Date('2019-09-10'),
      completedProjects: 41
    },
    features: [
      '50+ React components',
      'Dark/Light theme support',
      'Responsive design',
      'TypeScript support',
      'Interactive charts và graphs',
      'Figma design files included'
    ],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-12'),
    status: 'active',
    tags: ['ui-kit', 'react', 'dashboard', 'components'],
    views: 3450,
    downloads: 187,
    likes: 134,
    reviews: []
  }
]

/**
 * Lấy sản phẩm theo ID
 * @param id - ID của sản phẩm
 * @returns Sản phẩm hoặc undefined
 */
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id)
}

/**
 * Lấy sản phẩm theo developer ID
 * @param developerId - ID của developer
 * @returns Danh sách sản phẩm của developer
 */
export const getProductsByDeveloperId = (developerId: string): Product[] => {
  return mockProducts.filter(product => product.developerId === developerId)
}

/**
 * Lấy sản phẩm theo category
 * @param category - Category của sản phẩm
 * @returns Danh sách sản phẩm theo category
 */
export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return mockProducts
  return mockProducts.filter(product => product.category === category)
}

/**
 * Tìm kiếm sản phẩm
 * @param query - Từ khóa tìm kiếm
 * @returns Danh sách sản phẩm tìm thấy
 */
export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase()
  return mockProducts.filter(product => 
    product.title.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.developer.name.toLowerCase().includes(searchTerm) ||
    product.techStack.some(tech => tech.toLowerCase().includes(searchTerm)) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

/**
 * Lấy thống kê sản phẩm
 * @returns Thống kê tổng quan
 */
export const getProductsStats = () => {
  const products = mockProducts
  return {
    total: products.length,
    totalValue: products.reduce((sum, p) => sum + p.price, 0),
    totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0),
    totalDownloads: products.reduce((sum, p) => sum + (p.downloads || 0), 0),
    averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length,
    averageRating: products.reduce((sum, p) => sum + p.developer.rating, 0) / products.length,
    byCategory: {
      website: products.filter(p => p.category === 'website').length,
      mobile: products.filter(p => p.category === 'mobile').length,
      software: products.filter(p => p.category === 'software').length,
      template: products.filter(p => p.category === 'template').length
    },
    topDevelopers: products
      .map(p => p.developer)
      .filter((dev, index, self) => self.findIndex(d => d.id === dev.id) === index) // Remove duplicates
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)
  }
}

/**
 * Lấy sản phẩm nổi bật
 * @param limit - Số lượng sản phẩm cần lấy
 * @returns Danh sách sản phẩm nổi bật
 */
export const getFeaturedProducts = (limit: number = 3): Product[] => {
  return mockProducts
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit)
}

/**
 * Lấy sản phẩm mới nhất
 * @param limit - Số lượng sản phẩm cần lấy
 * @returns Danh sách sản phẩm mới nhất
 */
export const getLatestProducts = (limit: number = 6): Product[] => {
  return mockProducts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

/**
 * Lấy sản phẩm theo giá
 * @param minPrice - Giá tối thiểu
 * @param maxPrice - Giá tối đa
 * @returns Danh sách sản phẩm trong khoảng giá
 */
export const getProductsByPriceRange = (minPrice: number, maxPrice: number): Product[] => {
  return mockProducts.filter(product => 
    product.price >= minPrice && product.price <= maxPrice
  )
}