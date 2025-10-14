import type { Project, ProjectType } from '../types/project.type';
import { ProjectStatus } from '../types/shared.type';

/**
 * Mock ProjectType data
 */
const mockProjectTypes: ProjectType[] = [
  {
    id: 'type_001',
    name: 'Website Development',
    isDeleted: false,
    createdDate: new Date('2024-01-01'),
    updatedDate: new Date('2024-01-01')
  },
  {
    id: 'type_002',
    name: 'Mobile App Development',
    isDeleted: false,
    createdDate: new Date('2024-01-01'),
    updatedDate: new Date('2024-01-01')
  },
  {
    id: 'type_003',
    name: 'Desktop Application',
    isDeleted: false,
    createdDate: new Date('2024-01-01'),
    updatedDate: new Date('2024-01-01')
  },
  {
    id: 'type_004',
    name: 'AI/ML Project',
    isDeleted: false,
    createdDate: new Date('2024-01-01'),
    updatedDate: new Date('2024-01-01')
  },
  {
    id: 'type_005',
    name: 'Data Analysis',
    isDeleted: false,
    createdDate: new Date('2024-01-01'),
    updatedDate: new Date('2024-01-01')
  },
  {
    id: 'type_006',
    name: 'DevOps/Infrastructure',
    isDeleted: false,
    createdDate: new Date('2024-01-01'),
    updatedDate: new Date('2024-01-01')
  }
];

/**
 * Mock Project data
 */
export const mockProjects: Project[] = [
  {
    id: 'proj_001',
    customerId: 'customer_001',
    title: 'E-commerce Website với React và Node.js',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center',
    description: 'Xây dựng website thương mại điện tử hoàn chỉnh với React frontend và Node.js backend. Bao gồm tính năng đăng ký/đăng nhập, quản lý sản phẩm, giỏ hàng, thanh toán online, và admin dashboard.',
    category: 'Web Development',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'Express', 'JWT', 'Stripe'],
    projectType: mockProjectTypes[0],
    budget: 15000000,
    minBudget: 12000000,
    maxBudget: 18000000,
    estimateDuration: 60,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-04-01'),
    status: ProjectStatus.OPEN_APPLYING,
    isRemote: true,
    location: 'TP. Hồ Chí Minh',
    attachments: ['project-requirements.pdf', 'design-mockups.fig'],
    views: 234,
    createdDate: new Date('2024-01-15'),
    updatedDate: new Date('2024-01-20')
  },
  {
    id: 'proj_002',
    customerId: 'customer_002',
    title: 'Mobile App Flutter - Quản lý tài chính cá nhân',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&crop=center',
    description: 'Phát triển ứng dụng mobile Flutter để quản lý tài chính cá nhân. Tính năng chính: tracking chi tiêu, lập ngân sách, báo cáo tài chính, nhắc nhở thanh toán, và đồng bộ dữ liệu đám mây.',
    category: 'Mobile Development',
    requiredSkills: ['Flutter', 'Dart', 'Firebase', 'SQLite', 'Provider', 'Charts'],
    projectType: mockProjectTypes[1],
    budget: 12000000,
    minBudget: 10000000,
    maxBudget: 15000000,
    estimateDuration: 45,
    startDate: new Date('2024-02-15'),
    endDate: new Date('2024-04-01'),
    status: ProjectStatus.OPEN_APPLYING,
    isRemote: false,
    location: 'Hà Nội',
    attachments: ['app-requirements.docx', 'ui-designs.sketch'],
    views: 189,
    createdDate: new Date('2024-01-10'),
    updatedDate: new Date('2024-01-18')
  },
  {
    id: 'proj_003',
    customerId: 'customer_003',
    title: 'AI Chatbot cho Customer Support',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center',
    description: 'Xây dựng hệ thống chatbot AI sử dụng machine learning để hỗ trợ khách hàng 24/7. Tích hợp với website và ứng dụng mobile, hỗ trợ đa ngôn ngữ và có khả năng học hỏi từ cuộc trò chuyện.',
    category: 'AI/ML Development',
    requiredSkills: ['Python', 'TensorFlow', 'OpenAI API', 'FastAPI', 'PostgreSQL', 'Docker'],
    projectType: mockProjectTypes[3],
    budget: 25000000,
    minBudget: 20000000,
    maxBudget: 30000000,
    estimateDuration: 90,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-06-01'),
    status: ProjectStatus.OPEN_APPLYING,
    isRemote: true,
    location: 'Remote',
    attachments: ['ai-requirements.pdf', 'training-data.csv'],
    views: 312,
    createdDate: new Date('2024-01-05'),
    updatedDate: new Date('2024-01-22')
  },
  {
    id: 'proj_004',
    customerId: 'customer_004',
    title: 'WordPress Website cho Doanh nghiệp',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center',
    description: 'Thiết kế và phát triển website WordPress cho doanh nghiệp với giao diện responsive, tối ưu SEO, và tích hợp các plugin cần thiết. Bao gồm quản trị nội dung và training cho khách hàng.',
    category: 'Web Development',
    requiredSkills: ['WordPress', 'PHP', 'HTML/CSS', 'JavaScript', 'SEO', 'Elementor'],
    projectType: mockProjectTypes[0],
    budget: 8000000,
    minBudget: 6000000,
    maxBudget: 10000000,
    estimateDuration: 30,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-03-01'),
    status: ProjectStatus.IN_PROGRESS,
    isRemote: true,
    location: 'Đà Nẵng',
    attachments: ['brand-guidelines.pdf', 'content-samples.docx'],
    views: 156,
    createdDate: new Date('2024-01-12'),
    updatedDate: new Date('2024-01-25')
  },
  {
    id: 'proj_005',
    customerId: 'customer_005',
    title: 'Phân tích Dữ liệu và Báo cáo Business Intelligence',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center',
    description: 'Phân tích dữ liệu doanh nghiệp và tạo dashboard báo cáo real-time. Sử dụng Python, SQL và các công cụ visualization để tạo insights cho việc ra quyết định kinh doanh.',
    category: 'Data Analysis',
    requiredSkills: ['Python', 'SQL', 'Power BI', 'Tableau', 'Pandas', 'NumPy'],
    projectType: mockProjectTypes[4],
    budget: 18000000,
    minBudget: 15000000,
    maxBudget: 22000000,
    estimateDuration: 75,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-05-15'),
    status: ProjectStatus.OPEN_APPLYING,
    isRemote: true,
    location: 'Remote',
    attachments: ['data-sample.xlsx', 'report-requirements.pdf'],
    views: 278,
    createdDate: new Date('2024-01-08'),
    updatedDate: new Date('2024-01-20')
  },
  {
    id: 'proj_006',
    customerId: 'customer_006',
    title: 'Desktop Application - Quản lý Kho hàng',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop&crop=center',
    description: 'Phát triển ứng dụng desktop Windows để quản lý kho hàng với giao diện hiện đại. Tính năng: quản lý sản phẩm, nhập/xuất kho, báo cáo tồn kho, và tích hợp máy in mã vạch.',
    category: 'Desktop Development',
    requiredSkills: ['C#', 'WPF', 'SQL Server', 'Entity Framework', 'Crystal Reports'],
    projectType: mockProjectTypes[2],
    budget: 20000000,
    minBudget: 18000000,
    maxBudget: 25000000,
    estimateDuration: 90,
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-06-15'),
    status: ProjectStatus.OPEN_APPLYING,
    isRemote: false,
    location: 'TP. Hồ Chí Minh',
    attachments: ['system-requirements.pdf', 'database-schema.sql'],
    views: 145,
    createdDate: new Date('2024-01-18'),
    updatedDate: new Date('2024-01-25')
  },
  {
    id: 'proj_007',
    customerId: 'customer_007',
    title: 'DevOps Setup và CI/CD Pipeline',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center',
    description: 'Thiết lập infrastructure trên AWS và xây dựng CI/CD pipeline cho ứng dụng web. Bao gồm Docker containerization, Kubernetes deployment, monitoring và logging.',
    category: 'DevOps',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux'],
    projectType: mockProjectTypes[5],
    budget: 22000000,
    minBudget: 20000000,
    maxBudget: 26000000,
    estimateDuration: 60,
    startDate: new Date('2024-02-20'),
    endDate: new Date('2024-04-20'),
    status: ProjectStatus.OPEN_APPLYING,
    isRemote: true,
    location: 'Remote',
    attachments: ['infrastructure-diagram.drawio', 'deployment-requirements.md'],
    views: 198,
    createdDate: new Date('2024-01-14'),
    updatedDate: new Date('2024-01-23')
  },
  {
    id: 'proj_008',
    customerId: 'customer_008',
    title: 'Website Landing Page với Animation',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&crop=center',
    description: 'Thiết kế và phát triển landing page hiện đại với animations và effects đẹp mắt. Tối ưu conversion rate và performance, responsive trên mọi thiết bị.',
    category: 'Web Development',
    requiredSkills: ['React', 'GSAP', 'Tailwind CSS', 'Framer Motion', 'Next.js'],
    projectType: mockProjectTypes[0],
    budget: 6000000,
    minBudget: 5000000,
    maxBudget: 8000000,
    estimateDuration: 21,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-22'),
    status: ProjectStatus.COMPLETED,
    isRemote: true,
    location: 'Remote',
    attachments: ['design-mockups.fig', 'brand-assets.zip'],
    views: 267,
    createdDate: new Date('2023-12-20'),
    updatedDate: new Date('2024-01-15')
  }
];

/**
 * Get project by ID
 * @param id - Project ID
 * @returns Project or undefined
 */
export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(project => project.id === id);
};

/**
 * Get projects by customer ID
 * @param customerId - Customer ID
 * @returns List of projects by customer
 */
export const getProjectsByCustomerId = (customerId: string): Project[] => {
  return mockProjects.filter(project => project.customerId === customerId);
};

/**
 * Get projects by status
 * @param status - Project status
 * @returns List of projects with specified status
 */
export const getProjectsByStatus = (status: ProjectStatus): Project[] => {
  return mockProjects.filter(project => project.status === status);
};

/**
 * Search projects
 * @param query - Search query
 * @returns List of matching projects
 */
export const searchProjects = (query: string): Project[] => {
  const searchTerm = query.toLowerCase();
  return mockProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm) ||
    project.description?.toLowerCase().includes(searchTerm) ||
    project.category?.toLowerCase().includes(searchTerm) ||
    project.requiredSkills?.some(skill => skill.toLowerCase().includes(searchTerm))
  );
};

/**
 * Get projects by budget range
 * @param minBudget - Minimum budget
 * @param maxBudget - Maximum budget
 * @returns List of projects within budget range
 */
export const getProjectsByBudgetRange = (minBudget: number, maxBudget: number): Project[] => {
  return mockProjects.filter(project => 
    project.budget && project.budget >= minBudget && project.budget <= maxBudget
  );
};

/**
 * Get project statistics
 * @returns Project statistics
 */
export const getProjectStats = () => {
  const projects = mockProjects;
  return {
    total: projects.length,
    totalValue: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    totalViews: projects.reduce((sum, p) => sum + (p.views || 0), 0),
    averageBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0) / projects.length,
    byStatus: {
      open: projects.filter(p => p.status === ProjectStatus.OPEN_APPLYING).length,
      inProgress: projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length,
      completed: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
      cancelled: projects.filter(p => p.status === ProjectStatus.CANCELLED).length
    },
    byCategory: {
      web: projects.filter(p => p.category?.includes('Web')).length,
      mobile: projects.filter(p => p.category?.includes('Mobile')).length,
      desktop: projects.filter(p => p.category?.includes('Desktop')).length,
      ai: projects.filter(p => p.category?.includes('AI')).length,
      data: projects.filter(p => p.category?.includes('Data')).length,
      devops: projects.filter(p => p.category?.includes('DevOps')).length
    }
  };
};

/**
 * Get featured projects (projects with high views or budget)
 * @param limit - Number of projects to return
 * @returns List of featured projects
 */
export const getFeaturedProjects = (limit: number = 3): Project[] => {
  return mockProjects
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit);
};

/**
 * Get latest projects
 * @param limit - Number of projects to return
 * @returns List of latest projects
 */
export const getLatestProjects = (limit: number = 6): Project[] => {
  return mockProjects
    .sort((a, b) => new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime())
    .slice(0, limit);
};
