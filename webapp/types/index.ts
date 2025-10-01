export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'freelancer' | 'client' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string
  title: string
  description: string
  budget: number
  deadline: Date
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  clientId: string
  freelancerId?: string
  skills: string[]
  createdAt: Date
  updatedAt: Date
  // Thêm các thuộc tính mới
  type?: string
  duration?: string
  location?: string
  level?: string
  experience?: string
  language?: string
  workType?: string
  commitment?: string
}

export interface Proposal {
  id: string;
  projectId: string;
  freelancerId: string;
  budget: number;
  description: string;
  timeline: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Interface cho chứng chỉ của developer
 */
export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issuedDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  verified: boolean;
}

/**
 * Interface cho developer
 */
export interface Developer {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  skills: string[]
  experience: number
  rating: number
  location: string
  hourlyRate: number
  isAvailable: boolean
  joinedDate: Date
  completedProjects: number
}

/**
 * Interface cho sản phẩm của developer
 */
export interface Product {
  id: string
  title: string
  description: string
  category: 'website' | 'mobile' | 'software' | 'template'
  techStack: string[]
  images: string[]
  liveUrl?: string
  githubUrl?: string
  price: number
  developerId: string
  developer: Developer
  features: string[]
  createdAt: Date
  updatedAt?: Date
  status: 'active' | 'inactive'
  tags: string[]
  views?: number
  downloads?: number
  likes?: number
  reviews?: ProductReview[]
}

/**
 * Interface cho portfolio item của developer
 */
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  url?: string;
  technologies: string[];
}

/**
 * Interface cho ngôn ngữ của developer
 */
export interface Language {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'native';
}

/**
 * Interface cho học vấn của developer
 */
export interface Education {
  degree: string;
  school: string;
  field: string;
  graduationYear: number;
}

/**
 * Interface cho lịch sử công việc của developer
 */
export interface WorkHistory {
  id: string;
  projectTitle: string;
  clientName: string;
  completedDate: Date;
  rating: number;
  review?: string;
}

/**
 * Interface cho social links của developer
 */
export interface SocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  behance?: string;
  dribbble?: string;
}

/**
 * Interface chính cho profile của developer
 */
export interface DeveloperProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  bio: string;
  title: string; // e.g., "Full-stack Developer", "Mobile Developer"
  location: string;
  skills: string[];
  experience: number;
  hourlyRate: number;
  availability: 'available' | 'busy' | 'unavailable';
  languages: Language[];
  education: Education[];
  certificates: Certificate[];
  products: Product[];
  portfolio: PortfolioItem[];
  socialLinks: SocialLinks;
  rating: number;
  totalProjects: number;
  completedProjects: number;
  clientSatisfaction: number;
  responseTime: string; // e.g., "2 hours"
  workHistory: WorkHistory[];
  verificationStatus: 'pending' | 'verified' | 'rejected';
  joinedDate: Date;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Filter interface cho developer profiles
 */
export interface DeveloperFilter {
  search?: string;
  skills?: string[];
  location?: string;
  availability?: string;
  minRating?: number;
  maxHourlyRate?: number;
  experience?: string;
}

/**
 * Stats interface cho developer profiles
 */
export interface DeveloperStats {
  total: number;
  available: number;
  busy: number;
  verified: number;
  averageRating: number;
}

/**
 * Interface cho sản phẩm detail với thông tin đầy đủ
 */
export interface ProductDetail extends Product {
  downloads: number
  views: number
  likes: number
  reviews: ProductReview[]
  documentation: string
  demoCredentials?: {
    username: string
    password: string
  }
  support: {
    included: boolean
    duration?: string
    channels: string[]
  }
  license: {
    type: 'personal' | 'commercial' | 'extended'
    description: string
  }
  updates: {
    included: boolean
    duration?: string
  }
  compatibility: string[]
  requirements: string[]
  changelog: ChangelogEntry[]
  relatedProducts: string[]
  updatedAt?: Date // Thêm thuộc tính updatedAt optional
}

/**
 * Interface cho đánh giá sản phẩm
 */
export interface ProductReview {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: Date
  helpful: number
  verified: boolean
}

/**
 * Interface cho changelog
 */
export interface ChangelogEntry {
  version: string
  date: Date
  changes: string[]
  type: 'major' | 'minor' | 'patch'
}
