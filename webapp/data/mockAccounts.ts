import type { DeveloperProfile } from '../types';
import { mockDeveloperProfiles } from './mockDeveloperProfiles';
import type { EmployerProfile } from './mockEmployerProfiles';
import { mockEmployerProfiles } from './mockEmployerProfiles';

/**
 * Interface cho account đăng nhập
 */
export interface MockAccount {
  id: string;
  email: string;
  password: string;
  role: 'developer' | 'employer' | 'admin';
  isActive: boolean;
  lastLogin?: Date;
  profile?: DeveloperProfile; // Link đến developer profile nếu là developer
  employerProfile?: EmployerProfile; // Link đến employer profile nếu là employer
}

/**
 * Mock data cho các account đăng nhập
 */
export const mockAccounts: MockAccount[] = [
  // Developer accounts
  {
    id: 'acc_001',
    email: 'minh.nguyen@email.com',
    password: 'password123',
    role: 'developer',
    isActive: true,
    lastLogin: new Date('2024-01-20'),
    profile: mockDeveloperProfiles[0] // Nguyễn Văn Minh
  },
  {
    id: 'acc_002',
    email: 'linh.tran@email.com',
    password: 'password123',
    role: 'developer',
    isActive: true,
    lastLogin: new Date('2024-01-19'),
    profile: mockDeveloperProfiles[1] // Trần Thị Linh
  },
  {
    id: 'acc_003',
    email: 'duc.le@email.com',
    password: 'password123',
    role: 'developer',
    isActive: true,
    lastLogin: new Date('2024-01-18'),
    profile: mockDeveloperProfiles[2] // Lê Văn Đức
  },
  {
    id: 'acc_004',
    email: 'mai.pham@email.com',
    password: 'password123',
    role: 'developer',
    isActive: true,
    lastLogin: new Date('2024-01-17'),
    profile: mockDeveloperProfiles[3] // Phạm Thị Mai
  },
  
  // Employer accounts
  {
    id: 'acc_005',
    email: 'employer1@company.com',
    password: 'employer123',
    role: 'employer',
    isActive: true,
    lastLogin: new Date('2024-01-20'),
    employerProfile: mockEmployerProfiles[0] // TechViet Solutions
  },
  {
    id: 'acc_006',
    email: 'hr@techcorp.vn',
    password: 'employer123',
    role: 'employer',
    isActive: true,
    lastLogin: new Date('2024-01-19'),
    employerProfile: mockEmployerProfiles[1] // Digital Innovation Corp
  },
  {
    id: 'acc_007',
    email: 'manager@startup.io',
    password: 'employer123',
    role: 'employer',
    isActive: true,
    lastLogin: new Date('2024-01-18'),
    employerProfile: mockEmployerProfiles[2] // StartupHub Vietnam
  },
  {
    id: 'acc_012',
    email: 'contact@edutech.vn',
    password: 'employer123',
    role: 'employer',
    isActive: true,
    lastLogin: new Date('2024-01-17'),
    employerProfile: mockEmployerProfiles[3] // EduTech Solutions
  },
  {
    id: 'acc_013',
    email: 'info@greentech.vn',
    password: 'employer123',
    role: 'employer',
    isActive: true,
    lastLogin: new Date('2024-01-16'),
    employerProfile: mockEmployerProfiles[4] // GreenTech Innovations
  },
  
  // Admin accounts
  {
    id: 'acc_008',
    email: 'admin@freelanceit.vn',
    password: 'admin123',
    role: 'admin',
    isActive: true,
    lastLogin: new Date('2024-01-20')
  },
  {
    id: 'acc_009',
    email: 'moderator@freelanceit.vn',
    password: 'admin123',
    role: 'admin',
    isActive: true,
    lastLogin: new Date('2024-01-19')
  },
  
  // Test accounts với các role khác nhau
  {
    id: 'acc_010',
    email: 'demo.developer@test.com',
    password: 'demo123',
    role: 'developer',
    isActive: true,
    lastLogin: new Date('2024-01-15')
  },
  {
    id: 'acc_011',
    email: 'demo.employer@test.com',
    password: 'demo123',
    role: 'employer',
    isActive: true,
    lastLogin: new Date('2024-01-15')
  }
];

/**
 * Đăng nhập với email và password
 */
export const authenticateUser = (email: string, password: string): MockAccount | null => {
  const account = mockAccounts.find(acc => 
    acc.email === email && 
    acc.password === password && 
    acc.isActive
  );
  
  if (account) {
    // Cập nhật last login
    account.lastLogin = new Date();
    return account;
  }
  
  return null;
};

/**
 * Lấy account theo email
 */
export const getAccountByEmail = (email: string): MockAccount | undefined => {
  return mockAccounts.find(acc => acc.email === email);
};

/**
 * Lấy account theo ID
 */
export const getAccountById = (id: string): MockAccount | undefined => {
  return mockAccounts.find(acc => acc.id === id);
};

/**
 * Kiểm tra email đã tồn tại chưa
 */
export const isEmailExists = (email: string): boolean => {
  return mockAccounts.some(acc => acc.email === email);
};

/**
 * Lấy tất cả accounts theo role
 */
export const getAccountsByRole = (role: 'developer' | 'employer' | 'admin'): MockAccount[] => {
  return mockAccounts.filter(acc => acc.role === role && acc.isActive);
};

/**
 * Tạo account mới (dành cho đăng ký)
 */
export const createNewAccount = (
  email: string, 
  password: string, 
  role: 'developer' | 'employer' = 'developer'
): MockAccount => {
  const newAccount: MockAccount = {
    id: `acc_${Date.now()}`,
    email,
    password,
    role,
    isActive: true,
    lastLogin: new Date()
  };
  
  mockAccounts.push(newAccount);
  return newAccount;
};

/**
 * Các account demo để test nhanh
 */
export const demoAccounts = {
  developer: {
    email: 'minh.nguyen@email.com',
    password: 'password123'
  },
  employer: {
    email: 'employer1@company.com',
    password: 'employer123'
  },
  admin: {
    email: 'admin@freelanceit.vn',
    password: 'admin123'
  }
};

/**
 * Reset password (chỉ dành cho demo)
 */
export const resetPassword = (email: string, newPassword: string): boolean => {
  const account = getAccountByEmail(email);
  if (account) {
    account.password = newPassword;
    return true;
  }
  return false;
};

/**
 * Deactivate account
 */
export const deactivateAccount = (accountId: string): boolean => {
  const account = getAccountById(accountId);
  if (account) {
    account.isActive = false;
    return true;
  }
  return false;
};

/**
 * Activate account
 */
export const activateAccount = (accountId: string): boolean => {
  const account = getAccountById(accountId);
  if (account) {
    account.isActive = true;
    return true;
  }
  return false;
};
