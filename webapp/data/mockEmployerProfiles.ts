/**
 * Mock data cho employer profiles
 */
import { generateCompanyLogo } from '../utils/imageUtils'

export interface EmployerProfile {
  id: string
  companyName: string
  companyLogo?: string
  email: string
  phone: string
  website?: string
  address: string
  city: string
  industry: string
  companySize: string
  founded: string
  description: string
  benefits: string[]
  socialLinks: {
    linkedin?: string
    facebook?: string
    twitter?: string
    github?: string
  }
  verificationStatus: 'pending' | 'verified' | 'rejected'
  rating: number
  totalProjects: number
  completedProjects: number
  averageBudget: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Mock data cho employer profiles
 */
export const mockEmployerProfiles: EmployerProfile[] = [
  {
    id: 'emp_001',
    companyName: 'TechViet Solutions',
    companyLogo: generateCompanyLogo('TechViet Solutions', '3B82F6'),
    email: 'employer1@company.com',
    phone: '0123456789',
    website: 'https://techviet.com',
    address: '123 Nguyễn Văn Cừ, Quận 1',
    city: 'Hồ Chí Minh',
    industry: 'Software Development',
    companySize: '11-50 employees',
    founded: '2020',
    description: 'Chúng tôi là một công ty công nghệ chuyên phát triển các giải pháp phần mềm cho doanh nghiệp. Với đội ngũ kỹ sư trẻ, năng động và có kinh nghiệm, chúng tôi cam kết mang đến những sản phẩm chất lượng cao cho khách hàng.',
    benefits: [
      'Lương thưởng hấp dẫn',
      'Bảo hiểm y tế',
      'Làm việc từ xa',
      'Đào tạo và phát triển',
      'Team building định kỳ'
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/techviet',
      facebook: 'https://facebook.com/techviet',
      twitter: 'https://twitter.com/techviet'
    },
    verificationStatus: 'verified',
    rating: 4.8,
    totalProjects: 25,
    completedProjects: 22,
    averageBudget: 50000000,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'emp_002',
    companyName: 'Digital Innovation Corp',
    companyLogo: generateCompanyLogo('Digital Innovation', '059669'),
    email: 'hr@techcorp.vn',
    phone: '0987654321',
    website: 'https://digitalinnovation.vn',
    address: '456 Lê Lợi, Quận Hai Bà Trưng',
    city: 'Hà Nội',
    industry: 'Fintech',
    companySize: '51-200 employees',
    founded: '2018',
    description: 'Chúng tôi là công ty tiên phong trong lĩnh vực fintech tại Việt Nam, chuyên phát triển các giải pháp thanh toán và ngân hàng số. Đội ngũ của chúng tôi luôn sáng tạo và đổi mới để mang đến những trải nghiệm tốt nhất cho khách hàng.',
    benefits: [
      'Lương cạnh tranh + thưởng hiệu suất',
      'Bảo hiểm sức khỏe cao cấp',
      'Work-life balance',
      'Cơ hội học tập quốc tế',
      'Nghỉ phép có lương linh hoạt'
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/digital-innovation',
      facebook: 'https://facebook.com/digitalinnovation.vn',
      github: 'https://github.com/digitalinnovation'
    },
    verificationStatus: 'verified',
    rating: 4.6,
    totalProjects: 18,
    completedProjects: 16,
    averageBudget: 80000000,
    createdAt: new Date('2022-08-10'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'emp_003',
    companyName: 'StartupHub Vietnam',
    companyLogo: generateCompanyLogo('Smart Hub', 'F59E0B'),
    email: 'manager@startup.io',
    phone: '0369258147',
    website: 'https://startuphub.vn',
    address: '789 Trần Hưng Đạo, Quận 5',
    city: 'Hồ Chí Minh',
    industry: 'E-commerce',
    companySize: '11-50 employees',
    founded: '2021',
    description: 'StartupHub Vietnam là nơi ươm mầm cho các ý tưởng kinh doanh sáng tạo. Chúng tôi phát triển các nền tảng thương mại điện tử và marketplace, tạo cơ hội cho các doanh nghiệp nhỏ tiếp cận thị trường rộng lớn hơn.',
    benefits: [
      'Cổ phần công ty cho nhân viên xuất sắc',
      'Môi trường startup năng động',
      'Flexible working hours',
      'Free lunch và coffee',
      'Opportunity to grow with company'
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/startuphub-vietnam',
      facebook: 'https://facebook.com/startuphub.vn',
      twitter: 'https://twitter.com/startuphub_vn'
    },
    verificationStatus: 'verified',
    rating: 4.4,
    totalProjects: 12,
    completedProjects: 10,
    averageBudget: 35000000,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'emp_004',
    companyName: 'EduTech Solutions',
    companyLogo: generateCompanyLogo('Elite Tech', '7C3AED'),
    email: 'contact@edutech.vn',
    phone: '0912345678',
    website: 'https://edutech.solutions',
    address: '321 Nguyễn Thị Minh Khai, Quận 3',
    city: 'Hồ Chí Minh',
    industry: 'Education Technology',
    companySize: '11-50 employees',
    founded: '2019',
    description: 'EduTech Solutions chuyên phát triển các giải pháp công nghệ cho giáo dục. Chúng tôi tạo ra những nền tảng học tập trực tuyến hiện đại, giúp việc dạy và học trở nên hiệu quả và thú vị hơn.',
    benefits: [
      'Lương competitive trong ngành',
      'Bảo hiểm y tế cho gia đình',
      'Professional development budget',
      'Remote work support',
      'Annual company retreat'
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/edutech-solutions',
      facebook: 'https://facebook.com/edutech.solutions'
    },
    verificationStatus: 'pending',
    rating: 4.2,
    totalProjects: 8,
    completedProjects: 7,
    averageBudget: 45000000,
    createdAt: new Date('2023-06-05'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'emp_005',
    companyName: 'GreenTech Innovations',
    companyLogo: generateCompanyLogo('Green Tech', '10B981'),
    email: 'info@greentech.vn',
    phone: '0856789123',
    website: 'https://greentech.innovations',
    address: '654 Võ Văn Tần, Quận 3',
    city: 'Hồ Chí Minh',
    industry: 'Environmental Technology',
    companySize: '11-50 employees',
    founded: '2022',
    description: 'GreenTech Innovations tập trung phát triển các giải pháp công nghệ xanh và bền vững. Chúng tôi sử dụng AI và IoT để tạo ra những sản phẩm giúp bảo vệ môi trường và tiết kiệm năng lượng.',
    benefits: [
      'Mission-driven work environment',
      'Competitive salary + green bonus',
      'Carbon-neutral office',
      'Learning & development opportunities',
      'Flexible work arrangements'
    ],
    socialLinks: {
      linkedin: 'https://linkedin.com/company/greentech-innovations',
      twitter: 'https://twitter.com/greentech_vn',
      github: 'https://github.com/greentech-innovations'
    },
    verificationStatus: 'verified',
    rating: 4.5,
    totalProjects: 6,
    completedProjects: 5,
    averageBudget: 60000000,
    createdAt: new Date('2023-09-12'),
    updatedAt: new Date('2024-01-08')
  }
];

/**
 * Lấy employer profile theo ID
 */
export const getEmployerProfileById = (id: string): EmployerProfile | undefined => {
  return mockEmployerProfiles.find(profile => profile.id === id);
};

/**
 * Lấy employer profile theo email
 */
export const getEmployerProfileByEmail = (email: string): EmployerProfile | undefined => {
  return mockEmployerProfiles.find(profile => profile.email === email);
};

/**
 * Lấy tất cả employer profiles
 */
export const getAllEmployerProfiles = (): EmployerProfile[] => {
  return mockEmployerProfiles;
};

/**
 * Lấy employer profiles theo trạng thái verification
 */
export const getEmployerProfilesByStatus = (status: 'pending' | 'verified' | 'rejected'): EmployerProfile[] => {
  return mockEmployerProfiles.filter(profile => profile.verificationStatus === status);
};

/**
 * Lấy employer profiles theo thành phố
 */
export const getEmployerProfilesByCity = (city: string): EmployerProfile[] => {
  return mockEmployerProfiles.filter(profile => profile.city.toLowerCase().includes(city.toLowerCase()));
};

/**
 * Lấy employer profiles theo ngành nghề
 */
export const getEmployerProfilesByIndustry = (industry: string): EmployerProfile[] => {
  return mockEmployerProfiles.filter(profile => profile.industry.toLowerCase().includes(industry.toLowerCase()));
};
