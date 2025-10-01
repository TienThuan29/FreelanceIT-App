import type { Project } from '../types'

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Phát triển website e-commerce với React & Node.js',
    description: 'Cần phát triển một website bán hàng trực tuyến hoàn chỉnh với React frontend và Node.js backend. Yêu cầu có kinh nghiệm với MongoDB, payment gateway integration, responsive design và optimization.',
    budget: 15000000,
    deadline: new Date('2024-03-15'),
    status: 'open',
    clientId: 'client1',
    skills: ['React', 'Node.js', 'MongoDB', 'Payment Gateway', 'Responsive Design'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    type: 'Web Development',
    duration: '2-3 tháng',
    location: 'Remote',
    level: 'Intermediate',
    experience: '2+ năm',
    language: 'Tiếng Việt',
    workType: 'Remote',
    commitment: 'Full-time',
    // Thông tin client
    clientName: 'TechViet Solutions',
    clientLogo: 'https://via.placeholder.com/50',
    clientIndustry: 'Software Development',
    clientRating: 4.8,
    clientTotalProjects: 45,
    clientCompletedProjects: 42,
    clientCity: 'Hồ Chí Minh',
    clientCompanySize: '11-50 employees',
    clientJoinedDate: new Date('2020-01-15'),
    clientDescription: 'Chúng tôi là một công ty công nghệ chuyên phát triển các giải pháp phần mềm cho doanh nghiệp. Với đội ngũ kỹ sư trẻ, năng động và có kinh nghiệm.',
    clientBenefits: ['Lương thưởng hấp dẫn', 'Bảo hiểm y tế', 'Làm việc từ xa', 'Đào tạo và phát triển', 'Team building định kỳ'],
    clientWebsite: 'https://techviet.com',
    clientSocialLinks: {
      linkedin: 'https://linkedin.com/company/techviet',
      facebook: 'https://facebook.com/techviet'
    }
  },
  {
    id: '2',
    title: 'Thiết kế và phát triển mobile app Flutter',
    description: 'Startup fintech cần phát triển mobile app quản lý tài chính cá nhân. Yêu cầu UI/UX đẹp, tích hợp API ngân hàng, push notification, biometric authentication.',
    budget: 25000000,
    deadline: new Date('2024-04-01'),
    status: 'in_progress',
    clientId: 'client2',
    freelancerId: 'freelancer1',
    skills: ['Flutter', 'Dart', 'Firebase', 'API Integration', 'UI/UX'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    type: 'Mobile Development',
    duration: '3-4 tháng',
    location: 'Hà Nội',
    level: 'Advanced',
    experience: '3+ năm',
    language: 'Tiếng Việt',
    workType: 'Hybrid',
    commitment: 'Full-time',
    // Thông tin client
    clientName: 'FinTech Innovations',
    clientLogo: 'https://via.placeholder.com/50',
    clientIndustry: 'Financial Technology',
    clientRating: 4.9,
    clientTotalProjects: 28,
    clientCompletedProjects: 26,
    clientCity: 'Hà Nội',
    clientCompanySize: '51-200 employees',
    clientJoinedDate: new Date('2019-06-10'),
    clientDescription: 'Startup fintech hàng đầu Việt Nam, chuyên phát triển các giải pháp tài chính thông minh cho thị trường Southeast Asia.',
    clientBenefits: ['Cổ phần công ty', 'Lương cao', 'Môi trường startup', 'Cơ hội phát triển', 'Flexible time'],
    clientWebsite: 'https://fintechinnovations.vn',
    clientSocialLinks: {
      linkedin: 'https://linkedin.com/company/fintech-innovations',
      facebook: 'https://facebook.com/fintechinnovations'
    }
  },
  {
    id: '3',
    title: 'Phát triển hệ thống quản lý nhân sự (HRM)',
    description: 'Công ty cần hệ thống quản lý nhân sự web-based. Các module: quản lý nhân viên, chấm công, tính lương, nghỉ phép, báo cáo. Tech stack: Laravel + Vue.js + MySQL.',
    budget: 35000000,
    deadline: new Date('2024-05-01'),
    status: 'open',
    clientId: 'client3',
    skills: ['Laravel', 'Vue.js', 'MySQL', 'RESTful API', 'Authentication'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '4',
    title: 'Tối ưu hóa và bảo trì website WordPress',
    description: 'Website WordPress chạy chậm, cần tối ưu hóa performance, security hardening, và bảo trì định kỳ. Yêu cầu có kinh nghiệm với WP optimization, caching, CDN.',
    budget: 5000000,
    deadline: new Date('2024-02-28'),
    status: 'completed',
    clientId: 'client4',
    freelancerId: 'freelancer2',
    skills: ['WordPress', 'PHP', 'MySQL', 'Performance Optimization', 'Security'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '5',
    title: 'Xây dựng API microservices với Spring Boot',
    description: 'Cần xây dựng hệ thống microservices cho ứng dụng e-learning. Bao gồm user management, course management, payment processing, notification service.',
    budget: 40000000,
    deadline: new Date('2024-06-15'),
    status: 'open',
    clientId: 'client5',
    skills: ['Spring Boot', 'Java', 'Microservices', 'Docker', 'PostgreSQL'],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '6',
    title: 'Phát triển dashboard analytics với Python',
    description: 'Startup cần dashboard để visualize dữ liệu business intelligence. Yêu cầu real-time data processing, interactive charts, export reports.',
    budget: 18000000,
    deadline: new Date('2024-04-30'),
    status: 'in_progress',
    clientId: 'client6',
    freelancerId: 'freelancer3',
    skills: ['Python', 'Django', 'PostgreSQL', 'D3.js', 'Data Visualization'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: '7',
    title: 'Tích hợp AI chatbot vào website',
    description: 'Cần tích hợp AI chatbot thông minh vào website bán hàng. Chatbot cần hiểu tiếng Việt, trả lời FAQ, hỗ trợ khách hàng 24/7.',
    budget: 12000000,
    deadline: new Date('2024-03-20'),
    status: 'open',
    clientId: 'client7',
    skills: ['Python', 'NLP', 'Machine Learning', 'JavaScript', 'API Integration'],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '8',
    title: 'Thiết kế và code landing page conversion',
    description: 'Startup cần landing page có tỷ lệ conversion cao cho sản phẩm SaaS. Yêu cầu responsive, fast loading, A/B testing ready.',
    budget: 8000000,
    deadline: new Date('2024-02-15'),
    status: 'completed',
    clientId: 'client8',
    freelancerId: 'freelancer4',
    skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'SEO'],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-30')
  },
  {
    id: '9',
    title: 'Xây dựng hệ thống booking online',
    description: 'Spa cần hệ thống đặt lịch online. Tính năng: đặt lịch, thanh toán, quản lý khách hàng, reminder, báo cáo doanh thu.',
    budget: 22000000,
    deadline: new Date('2024-04-10'),
    status: 'open',
    clientId: 'client9',
    skills: ['PHP', 'Laravel', 'MySQL', 'Payment Gateway', 'Calendar Integration'],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '10',
    title: 'Phát triển ứng dụng IoT monitoring',
    description: 'Nhà máy cần ứng dụng giám sát thiết bị IoT real-time. Dashboard hiển thị sensors data, alerts, historical reports.',
    budget: 45000000,
    deadline: new Date('2024-07-01'),
    status: 'in_progress',
    clientId: 'client10',
    freelancerId: 'freelancer5',
    skills: ['Node.js', 'React', 'InfluxDB', 'MQTT', 'Real-time Dashboard'],
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: '11',
    title: 'Xây dựng hệ thống CRM cho startup',
    description: 'Startup cần hệ thống CRM để quản lý khách hàng và leads. Tính năng: quản lý contact, deals, pipeline, email marketing, báo cáo analytics.',
    budget: 28000000,
    deadline: new Date('2024-05-20'),
    status: 'open',
    clientId: 'client11',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Email APIs'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '12',
    title: 'Phát triển game mobile 2D với Unity',
    description: 'Studio game cần phát triển game mobile 2D casual. Gameplay đơn giản, monetization ads, leaderboard, social features.',
    budget: 35000000,
    deadline: new Date('2024-06-30'),
    status: 'open',
    clientId: 'client12',
    skills: ['Unity', 'C#', 'Game Development', '2D Graphics', 'Mobile Optimization'],
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
  }
]

/**
 * Lấy danh sách dự án theo bộ lọc
 * @param filters - Các điều kiện lọc
 * @returns Danh sách dự án đã lọc
 */
export const getFilteredProjects = (filters: {
  search?: string
  skills?: string
  status?: string
  budget?: string
}) => {
  return mockProjects.filter(project => {
    const matchesSearch = !filters.search || 
      project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.description.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesSkills = !filters.skills || 
      project.skills.some(skill => skill.toLowerCase().includes(filters.skills!.toLowerCase()))
    
    const matchesStatus = !filters.status || filters.status === 'all' || project.status === filters.status
    
    return matchesSearch && matchesSkills && matchesStatus
  })
}

/**
 * Lấy dự án theo ID
 * @param id - ID của dự án
 * @returns Dự án hoặc undefined nếu không tìm thấy
 */
export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(project => project.id === id)
}

/**
 * Lấy dự án theo client ID
 * @param clientId - ID của client
 * @returns Danh sách dự án của client
 */
export const getProjectsByClientId = (clientId: string): Project[] => {
  return mockProjects.filter(project => project.clientId === clientId)
}

/**
 * Lấy thống kê dự án
 * @returns Thống kê tổng quan
 */
export const getProjectStats = () => {
  return {
    total: mockProjects.length,
    open: mockProjects.filter(p => p.status === 'open').length,
    inProgress: mockProjects.filter(p => p.status === 'in_progress').length,
    completed: mockProjects.filter(p => p.status === 'completed').length,
    cancelled: mockProjects.filter(p => p.status === 'cancelled').length
  }
}