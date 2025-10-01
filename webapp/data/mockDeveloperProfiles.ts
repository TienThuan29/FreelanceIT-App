import type { 
  DeveloperProfile, 
  Certificate, 
  Product, 
  PortfolioItem,
  Language,
  Education,
  WorkHistory,
  SocialLinks,
  DeveloperFilter,
  DeveloperStats
} from '../types';
import { generateAvatar, generateProductImage, techStackImages } from '../utils/imageUtils';

/**
 * Mock data cho developer profiles
 */
export const mockDeveloperProfiles: DeveloperProfile[] = [
  {
    id: 'dev_001',
    fullName: 'Nguyễn Văn Minh',
    email: 'minh.nguyen@email.com',
    phone: '0123456789',
    avatar: generateAvatar('Nguyễn Văn Minh', '3B82F6'),
    bio: 'Tôi là một Full-stack Developer với 5 năm kinh nghiệm trong việc phát triển web applications. Chuyên về React, Node.js và cloud technologies. Đam mê tạo ra những sản phẩm có tác động tích cực đến cuộc sống.',
    title: 'Senior Full-stack Developer',
    location: 'TP. Hồ Chí Minh',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker', 'GraphQL', 'Next.js'],
    experience: 5,
    hourlyRate: 500000,
    availability: 'available',
    languages: [
      { name: 'Tiếng Việt', level: 'native' },
      { name: 'English', level: 'advanced' },
      { name: '日本語', level: 'intermediate' }
    ],
    education: [
      {
        degree: 'Cử nhân',
        school: 'Đại học Bách Khoa TP.HCM',
        field: 'Khoa học Máy tính',
        graduationYear: 2019
      }
    ],
    certificates: [
      {
        id: 'cert_001',
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        issuedDate: new Date('2023-06-15'),
        expiryDate: new Date('2026-06-15'),
        credentialId: 'AWS-SAA-123456',
        credentialUrl: 'https://aws.amazon.com/verification',
        verified: true
      },
      {
        id: 'cert_002',
        name: 'React Developer Certification',
        issuer: 'Meta',
        issuedDate: new Date('2023-03-20'),
        credentialId: 'META-REACT-789',
        verified: true
      },
      {
        id: 'cert_003',
        name: 'MongoDB Certified Developer',
        issuer: 'MongoDB University',
        issuedDate: new Date('2022-11-10'),
        credentialUrl: 'https://university.mongodb.com/verify',
        verified: true
      }
    ],
    products: [
      {
        id: 'prod_001',
        title: 'E-commerce Platform Template',
        description: 'Template hoàn chỉnh cho website bán hàng với admin dashboard, payment integration và responsive design. Được xây dựng với React và Node.js, hỗ trợ đầy đủ tính năng của một website thương mại điện tử hiện đại.',
        category: 'template',
        techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Express', 'JWT', 'Cloudinary'],
        images: [
          'https://via.placeholder.com/800x600/4F46E5/ffffff?text=E-commerce+Homepage',
          'https://via.placeholder.com/800x600/059669/ffffff?text=Admin+Dashboard',
          'https://via.placeholder.com/800x600/DC2626/ffffff?text=Product+Page',
          'https://via.placeholder.com/800x600/7C3AED/ffffff?text=Checkout'
        ],
        liveUrl: 'https://demo-ecommerce.netlify.app',
        githubUrl: 'https://github.com/minhnguyen/ecommerce-template',
        price: 2500000,
        developerId: 'dev_001',
        developer: {
          id: 'dev_001',
          name: 'Nguyễn Văn Minh',
          email: 'minh.nguyen@email.com',
          avatar: 'https://via.placeholder.com/150x150/3B82F6/ffffff?text=NVM',
          bio: 'Full-stack developer với 5 năm kinh nghiệm phát triển web applications',
          skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
          experience: 5,
          rating: 4.9,
          location: 'TP. Hồ Chí Minh',
          hourlyRate: 500000,
          isAvailable: true,
          joinedDate: new Date('2022-03-15'),
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
          'https://via.placeholder.com/800x600/3B82F6/ffffff?text=Task+Dashboard',
          'https://via.placeholder.com/800x600/10B981/ffffff?text=Kanban+Board',
          'https://via.placeholder.com/800x600/F59E0B/ffffff?text=Time+Tracking'
        ],
        liveUrl: 'https://taskapp-demo.herokuapp.com',
        githubUrl: 'https://github.com/minhnguyen/task-management',
        price: 1800000,
        developerId: 'dev_001',
        developer: {
          id: 'dev_001',
          name: 'Nguyễn Văn Minh',
          email: 'minh.nguyen@email.com',
          avatar: 'https://via.placeholder.com/150x150/3B82F6/ffffff?text=NVM',
          bio: 'Full-stack developer với 5 năm kinh nghiệm phát triển web applications',
          skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
          experience: 5,
          rating: 4.9,
          location: 'TP. Hồ Chí Minh',
          hourlyRate: 500000,
          isAvailable: true,
          joinedDate: new Date('2022-03-15'),
          completedProjects: 45
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
      }
    ],
    portfolio: [
      {
        id: 'port_001',
        title: 'Healthcare Management System',
        description: 'Hệ thống quản lý bệnh viện với module quản lý bệnh nhân, lịch hẹn và báo cáo.',
        image: 'https://via.placeholder.com/400x300/059669/ffffff?text=Healthcare+System',
        url: 'https://healthcare-demo.com',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS']
      },
      {
        id: 'port_002',
        title: 'Real Estate Platform',
        description: 'Website bất động sản với tính năng tìm kiếm thông minh và virtual tour.',
        image: 'https://via.placeholder.com/400x300/7C3AED/ffffff?text=Real+Estate',
        technologies: ['Next.js', 'MongoDB', 'Mapbox', 'CloudFlare']
      }
    ],
    socialLinks: {
      github: 'https://github.com/minhnguyen',
      linkedin: 'https://linkedin.com/in/minhnguyen-dev',
      portfolio: 'https://minhnguyen.dev',
      behance: 'https://behance.net/minhnguyen'
    },
    rating: 4.9,
    totalProjects: 45,
    completedProjects: 43,
    clientSatisfaction: 98,
    responseTime: '2 giờ',
    workHistory: [
      {
        id: 'work_001',
        projectTitle: 'E-commerce Website for Fashion Brand',
        clientName: 'Fashion Store ABC',
        completedDate: new Date('2024-01-10'),
        rating: 5,
        review: 'Chất lượng code xuất sắc, giao tiếp tốt và hoàn thành đúng deadline.'
      },
      {
        id: 'work_002',
        projectTitle: 'Mobile App for Food Delivery',
        clientName: 'FoodDelivery Co.',
        completedDate: new Date('2023-11-25'),
        rating: 5,
        review: 'Developer rất chuyên nghiệp và có kinh nghiệm tốt.'
      }
    ],
    verificationStatus: 'verified',
    joinedDate: new Date('2022-03-15'),
    lastActive: new Date('2024-01-20'),
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'dev_002',
    fullName: 'Trần Thị Linh',
    email: 'linh.tran@email.com',
    phone: '0987654321',
    avatar: 'https://via.placeholder.com/150x150/EC4899/ffffff?text=TTL',
    bio: 'Mobile Developer chuyên Flutter với passion về UI/UX design. Có kinh nghiệm phát triển apps cho cả iOS và Android. Luôn cập nhật các trends mới nhất trong mobile development.',
    title: 'Senior Mobile Developer',
    location: 'Hà Nội',
    skills: ['Flutter', 'Dart', 'Firebase', 'iOS', 'Android', 'UI/UX Design', 'Figma', 'Swift'],
    experience: 4,
    hourlyRate: 450000,
    availability: 'busy',
    languages: [
      { name: 'Tiếng Việt', level: 'native' },
      { name: 'English', level: 'advanced' }
    ],
    education: [
      {
        degree: 'Cử nhân',
        school: 'Đại học Công nghệ - ĐH Quốc gia Hà Nội',
        field: 'Công nghệ thông tin',
        graduationYear: 2020
      }
    ],
    certificates: [
      {
        id: 'cert_004',
        name: 'Google Flutter Certified',
        issuer: 'Google',
        issuedDate: new Date('2023-08-15'),
        verified: true
      },
      {
        id: 'cert_005',
        name: 'iOS Development Certificate',
        issuer: 'Apple Developer Academy',
        issuedDate: new Date('2023-05-20'),
        verified: true
      }
    ],
    products: [
      {
        id: 'prod_003',
        title: 'Personal Finance Mobile App',
        description: 'Ứng dụng mobile quản lý tài chính cá nhân được phát triển với Flutter. Bao gồm tracking chi tiêu, budget planning, báo cáo tài chính, và tích hợp với ngân hàng.',
        category: 'mobile',
        techStack: ['Flutter', 'Dart', 'Firebase', 'SQLite', 'Provider'],
        images: [
          'https://via.placeholder.com/400x800/06B6D4/ffffff?text=Finance+Home',
          'https://via.placeholder.com/400x800/84CC16/ffffff?text=Expense+Tracking',
          'https://via.placeholder.com/400x800/F97316/ffffff?text=Budget+Planning'
        ],
        liveUrl: 'https://play.google.com/store/apps/details?id=com.example.finance',
        githubUrl: 'https://github.com/linhtran/finance-app',
        price: 3200000,
        developerId: 'dev_002',
        developer: {
          id: 'dev_002',
          name: 'Trần Thị Linh',
          email: 'linh.tran@email.com',
          avatar: 'https://via.placeholder.com/150x150/EC4899/ffffff?text=TTL',
          bio: 'Mobile developer chuyên Flutter với expertise về fintech applications',
          skills: ['Flutter', 'Dart', 'Firebase', 'Mobile UI/UX', 'Fintech'],
          experience: 4,
          rating: 4.8,
          location: 'Hà Nội',
          hourlyRate: 450000,
          isAvailable: false,
          joinedDate: new Date('2022-06-10'),
          completedProjects: 32
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
      }
    ],
    portfolio: [
      {
        id: 'port_003',
        title: 'Food Delivery App',
        description: 'App giao đồ ăn với real-time tracking và payment integration.',
        image: 'https://via.placeholder.com/300x600/F59E0B/ffffff?text=Food+Delivery',
        technologies: ['Flutter', 'Firebase', 'Google Maps', 'Payment Gateway']
      },
      {
        id: 'port_004',
        title: 'E-learning Mobile App',
        description: 'Ứng dụng học trực tuyến với video streaming và interactive quizzes.',
        image: 'https://via.placeholder.com/300x600/8B5CF6/ffffff?text=E-learning',
        technologies: ['Flutter', 'Firebase', 'Video Player', 'Offline Storage']
      }
    ],
    socialLinks: {
      github: 'https://github.com/linhtran',
      linkedin: 'https://linkedin.com/in/linhtran-mobile',
      dribbble: 'https://dribbble.com/linhtran'
    },
    rating: 4.8,
    totalProjects: 32,
    completedProjects: 30,
    clientSatisfaction: 96,
    responseTime: '4 giờ',
    workHistory: [
      {
        id: 'work_003',
        projectTitle: 'Fitness Tracking Mobile App',
        clientName: 'HealthTech Startup',
        completedDate: new Date('2023-12-15'),
        rating: 5,
        review: 'UI/UX design tuyệt vời và code quality rất cao.'
      },
      {
        id: 'work_004',
        projectTitle: 'Social Media App for Teens',
        clientName: 'Social Tech Co.',
        completedDate: new Date('2023-10-20'),
        rating: 4,
        review: 'Performance app rất tốt, delivery đúng thời gian.'
      }
    ],
    verificationStatus: 'verified',
    joinedDate: new Date('2022-06-10'),
    lastActive: new Date('2024-01-19'),
    createdAt: new Date('2022-06-10'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: 'dev_003',
    fullName: 'Lê Văn Đức',
    email: 'duc.le@email.com',
    phone: '0369852147',
    avatar: 'https://via.placeholder.com/150x150/7C3AED/ffffff?text=LVD',
    bio: 'Backend Developer chuyên về microservices và cloud architecture. Có kinh nghiệm làm việc với các hệ thống high-traffic và distributed systems. Passionate về performance optimization và scalability.',
    title: 'Senior Backend Developer',
    location: 'Đà Nẵng',
    skills: ['Java', 'Spring Boot', 'Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis', 'Microservices'],
    experience: 6,
    hourlyRate: 550000,
    availability: 'available',
    languages: [
      { name: 'Tiếng Việt', level: 'native' },
      { name: 'English', level: 'advanced' }
    ],
    education: [
      {
        degree: 'Thạc sĩ',
        school: 'Đại học Đà Nẵng',
        field: 'Khoa học Máy tính',
        graduationYear: 2018
      }
    ],
    certificates: [
      {
        id: 'cert_006',
        name: 'AWS Certified DevOps Engineer',
        issuer: 'Amazon Web Services',
        issuedDate: new Date('2023-09-10'),
        expiryDate: new Date('2026-09-10'),
        verified: true
      },
      {
        id: 'cert_007',
        name: 'Kubernetes Certified Administrator',
        issuer: 'Cloud Native Computing Foundation',
        issuedDate: new Date('2023-07-20'),
        verified: true
      }
    ],
    products: [
      {
        id: 'prod_007',
        title: 'Microservices API Gateway',
        description: 'API Gateway solution với rate limiting, authentication, và monitoring. Được xây dựng với Spring Boot và Docker, hỗ trợ horizontal scaling.',
        category: 'software',
        techStack: ['Java', 'Spring Boot', 'Docker', 'Redis', 'PostgreSQL', 'Kubernetes'],
        images: [
          'https://via.placeholder.com/800x600/059669/ffffff?text=API+Gateway',
          'https://via.placeholder.com/800x600/DC2626/ffffff?text=Monitoring+Dashboard'
        ],
        liveUrl: 'https://api-gateway-demo.com',
        githubUrl: 'https://github.com/ducle/api-gateway',
        price: 5000000,
        developerId: 'dev_003',
        developer: {
          id: 'dev_003',
          name: 'Lê Văn Đức',
          email: 'duc.le@email.com',
          avatar: 'https://via.placeholder.com/150x150/7C3AED/ffffff?text=LVD',
          bio: 'Backend developer chuyên về microservices và cloud architecture',
          skills: ['Java', 'Spring Boot', 'Docker', 'AWS'],
          experience: 6,
          rating: 4.7,
          location: 'Đà Nẵng',
          hourlyRate: 550000,
          isAvailable: true,
          joinedDate: new Date('2021-08-20'),
          completedProjects: 38
        },
        features: [
          'Rate limiting và throttling',
          'JWT authentication & authorization',
          'Real-time monitoring với metrics',
          'Load balancing',
          'Circuit breaker pattern',
          'API versioning support'
        ],
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-18'),
        status: 'active',
        tags: ['microservices', 'api', 'java', 'backend'],
        views: 1890,
        downloads: 67,
        likes: 45,
        reviews: []
      }
    ],
    portfolio: [
      {
        id: 'port_005',
        title: 'E-learning Platform Backend',
        description: 'Backend API cho nền tảng học trực tuyến với microservices architecture.',
        image: 'https://via.placeholder.com/400x300/3B82F6/ffffff?text=E-learning+API',
        technologies: ['Spring Boot', 'PostgreSQL', 'Docker', 'AWS']
      },
      {
        id: 'port_006',
        title: 'Banking System Backend',
        description: 'Core banking system với high availability và security.',
        image: 'https://via.placeholder.com/400x300/059669/ffffff?text=Banking+System',
        technologies: ['Java', 'Spring Security', 'Oracle DB', 'Kafka']
      }
    ],
    socialLinks: {
      github: 'https://github.com/ducle',
      linkedin: 'https://linkedin.com/in/ducle-backend'
    },
    rating: 4.7,
    totalProjects: 38,
    completedProjects: 36,
    clientSatisfaction: 94,
    responseTime: '3 giờ',
    workHistory: [
      {
        id: 'work_005',
        projectTitle: 'Banking System Backend',
        clientName: 'FinTech Bank',
        completedDate: new Date('2023-10-30'),
        rating: 5,
        review: 'Kiến trúc hệ thống rất tốt và có khả năng scale cao.'
      },
      {
        id: 'work_006',
        projectTitle: 'E-commerce Microservices',
        clientName: 'Online Retail Corp',
        completedDate: new Date('2023-08-15'),
        rating: 5,
        review: 'Performance xuất sắc, code quality rất cao.'
      }
    ],
    verificationStatus: 'verified',
    joinedDate: new Date('2021-08-20'),
    lastActive: new Date('2024-01-18'),
    createdAt: new Date('2021-08-20'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'dev_004',
    fullName: 'Phạm Thị Mai',
    email: 'mai.pham@email.com',
    phone: '0912345678',
    avatar: 'https://via.placeholder.com/150x150/F59E0B/ffffff?text=PTM',
    bio: 'Frontend Developer & UI/UX Designer với focus vào responsive design và user experience. Chuyên về modern CSS frameworks và interactive animations.',
    title: 'Senior Frontend Developer',
    location: 'TP. Hồ Chí Minh',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Vue.js', 'Bootstrap', 'Tailwind CSS', 'Figma', 'Adobe XD'],
    experience: 4,
    hourlyRate: 400000,
    availability: 'available',
    languages: [
      { name: 'Tiếng Việt', level: 'native' },
      { name: 'English', level: 'intermediate' }
    ],
    education: [
      {
        degree: 'Cử nhân',
        school: 'Đại học Kinh tế TP.HCM',
        field: 'Thiết kế Đồ họa',
        graduationYear: 2020
      }
    ],
    certificates: [
      {
        id: 'cert_008',
        name: 'Google UX Design Certificate',
        issuer: 'Google',
        issuedDate: new Date('2023-04-10'),
        verified: true
      }
    ],
    products: [
      {
        id: 'prod_004',
        title: 'Modern Landing Page Collection',
        description: 'Bộ sưu tập 15 landing page templates modern với responsive design. Được tối ưu cho conversion, SEO và performance. Phù hợp cho startup, agency, portfolio, và product launch.',
        category: 'template',
        techStack: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap 5', 'SASS', 'Webpack'],
        images: [
          'https://via.placeholder.com/800x600/1F2937/ffffff?text=Startup+Landing',
          'https://via.placeholder.com/800x600/059669/ffffff?text=Agency+Portfolio',
          'https://via.placeholder.com/800x600/7C2D12/ffffff?text=Product+Launch'
        ],
        liveUrl: 'https://modern-landing-templates.netlify.app',
        githubUrl: 'https://github.com/maipham/landing-templates',
        price: 1200000,
        developerId: 'dev_004',
        developer: {
          id: 'dev_004',
          name: 'Phạm Thị Mai',
          email: 'mai.pham@email.com',
          avatar: 'https://via.placeholder.com/150x150/F59E0B/ffffff?text=PTM',
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
      }
    ],
    portfolio: [
      {
        id: 'port_007',
        title: 'Fashion E-commerce UI',
        description: 'Modern e-commerce interface với interactive product showcase.',
        image: 'https://via.placeholder.com/400x300/EC4899/ffffff?text=Fashion+UI',
        technologies: ['React', 'Tailwind CSS', 'Framer Motion', 'Next.js']
      },
      {
        id: 'port_008',
        title: 'Restaurant Website',
        description: 'Responsive restaurant website với online booking system.',
        image: 'https://via.placeholder.com/400x300/F97316/ffffff?text=Restaurant+Web',
        technologies: ['Vue.js', 'Bootstrap', 'SASS', 'Animation']
      }
    ],
    socialLinks: {
      github: 'https://github.com/maipham',
      linkedin: 'https://linkedin.com/in/maipham-frontend',
      behance: 'https://behance.net/maipham',
      dribbble: 'https://dribbble.com/maipham'
    },
    rating: 4.6,
    totalProjects: 38,
    completedProjects: 36,
    clientSatisfaction: 95,
    responseTime: '2 giờ',
    workHistory: [
      {
        id: 'work_007',
        projectTitle: 'Corporate Website Redesign',
        clientName: 'Tech Company XYZ',
        completedDate: new Date('2023-11-30'),
        rating: 5,
        review: 'Design rất đẹp và modern, responsive tốt trên mọi device.'
      }
    ],
    verificationStatus: 'verified',
    joinedDate: new Date('2020-06-15'),
    lastActive: new Date('2024-01-17'),
    createdAt: new Date('2020-06-15'),
    updatedAt: new Date('2024-01-17')
  }
];

/**
 * Lấy profile của developer hiện tại (user đang đăng nhập)
 */
export const getCurrentDeveloperProfile = (): DeveloperProfile => {
  return mockDeveloperProfiles[0];
};

/**
 * Lấy danh sách developer profiles theo bộ lọc
 */
export const getFilteredDeveloperProfiles = (filters: DeveloperFilter): DeveloperProfile[] => {
  return mockDeveloperProfiles.filter(profile => {
    const matchesSearch = !filters.search || 
      profile.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
      profile.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      profile.bio.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesSkills = !filters.skills?.length || 
      filters.skills.some(skill => 
        profile.skills.some(profileSkill => 
          profileSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
    
    const matchesLocation = !filters.location || 
      profile.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesAvailability = !filters.availability || 
      profile.availability === filters.availability;
    
    const matchesRating = !filters.minRating || profile.rating >= filters.minRating;
    
    const matchesHourlyRate = !filters.maxHourlyRate || profile.hourlyRate <= filters.maxHourlyRate;
    
    return matchesSearch && matchesSkills && matchesLocation && 
           matchesAvailability && matchesRating && matchesHourlyRate;
  });
};

/**
 * Lấy developer profile theo ID
 */
export const getDeveloperById = (id: string): DeveloperProfile | undefined => {
  return mockDeveloperProfiles.find(profile => profile.id === id);
};

/**
 * Lấy sản phẩm của developer theo ID
 */
export const getProductsByDeveloper = (developerId: string): Product[] => {
  const developer = getDeveloperById(developerId);
  return developer ? developer.products : [];
};

/**
 * Lấy thống kê developers
 */
export const getDeveloperStats = (): DeveloperStats => {
  const total = mockDeveloperProfiles.length;
  const available = mockDeveloperProfiles.filter(p => p.availability === 'available').length;
  const busy = mockDeveloperProfiles.filter(p => p.availability === 'busy').length;
  const verified = mockDeveloperProfiles.filter(p => p.verificationStatus === 'verified').length;
  const averageRating = mockDeveloperProfiles.reduce((sum, p) => sum + p.rating, 0) / total;
  
  return {
    total,
    available,
    busy,
    verified,
    averageRating: Math.round(averageRating * 10) / 10
  };
};

/**
 * Lấy top developers theo rating
 */
export const getTopDevelopers = (limit: number = 5): DeveloperProfile[] => {
  return [...mockDeveloperProfiles]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

/**
 * Lấy tất cả sản phẩm từ tất cả developers
 */
export const getAllDeveloperProducts = (): Product[] => {
  return mockDeveloperProfiles.flatMap(profile => profile.products);
};