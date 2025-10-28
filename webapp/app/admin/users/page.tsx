'use client';
import React, { useEffect, useState } from 'react';
import { useAdminUsers, DeveloperWithProfile, CustomerWithProfile } from '@/hooks/useAdminUsers';
import { UserPlanning } from '@/types/planning.type';
import { Button } from '@/components/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Mail, Phone, MapPin, Briefcase, Award, Calendar, Star, Globe, Github, Linkedin, FolderOpen } from 'lucide-react';

export default function AdminUsersPage() {
  const {
    developers,
    customers,
    isLoading,
    error,
    fetchDevelopers,
    fetchCustomers,
    fetchUserPlannings,
    refreshAll,
  } = useAdminUsers();

  const [selectedUser, setSelectedUser] = useState<DeveloperWithProfile | CustomerWithProfile | null>(null);
  const [userPlannings, setUserPlannings] = useState<UserPlanning[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [loadingPlannings, setLoadingPlannings] = useState(false);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleViewPlannings = async (user: DeveloperWithProfile | CustomerWithProfile) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
    setLoadingPlannings(true);
    
    try {
      const plannings = await fetchUserPlannings(user.id);
      setUserPlannings(plannings);
    } catch (err) {
      console.error('Error loading plannings:', err);
      setUserPlannings([]);
    } finally {
      setLoadingPlannings(false);
    }
  };

  const handleViewDetail = (user: DeveloperWithProfile | CustomerWithProfile) => {
    setSelectedUser(user);
    setIsDetailDialogOpen(true);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Enhanced mock data for developers
  const mockDevelopers: DeveloperWithProfile[] = [
    {
      id: 'dev-1',
      email: 'nguyen.van.a@email.com',
      fullname: 'Nguyễn Văn An',
      phone: '0901234567',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: new Date('1990-05-15'),
      province: { id: '1', name: 'Hồ Chí Minh' },
      role: 'DEVELOPER',
      isEnable: true,
      createdDate: new Date('2023-01-15'),
      updatedDate: new Date('2024-01-20'),
      lastLoginDate: new Date('2024-01-25'),
      developerProfile: {
        id: 'dev-profile-1',
        userId: 'dev-1',
        title: 'Senior Full Stack Developer',
        developerLevel: 'SENIOR',
        experienceYears: 8,
        hourlyRate: 45,
        rating: 4.8,
        totalProjects: 25,
        githubUrl: 'https://github.com/nguyenvanan',
        linkedinUrl: 'https://linkedin.com/in/nguyenvanan',
        skills: [
          { id: '1', name: 'React', proficiency: 'EXPERT' },
          { id: '2', name: 'Node.js', proficiency: 'EXPERT' },
          { id: '3', name: 'TypeScript', proficiency: 'ADVANCED' },
          { id: '4', name: 'AWS', proficiency: 'ADVANCED' }
        ]
      }
    },
    {
      id: 'dev-2',
      email: 'tran.thi.b@email.com',
      fullname: 'Trần Thị Bình',
      phone: '0901234568',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: new Date('1992-08-22'),
      province: { id: '2', name: 'Hà Nội' },
      role: 'DEVELOPER',
      isEnable: true,
      createdDate: new Date('2023-02-10'),
      updatedDate: new Date('2024-01-18'),
      lastLoginDate: new Date('2024-01-24'),
      developerProfile: {
        id: 'dev-profile-2',
        userId: 'dev-2',
        title: 'Lead Mobile Developer',
        developerLevel: 'LEAD',
        experienceYears: 10,
        hourlyRate: 60,
        rating: 4.9,
        totalProjects: 35,
        githubUrl: 'https://github.com/tranthibinh',
        linkedinUrl: 'https://linkedin.com/in/tranthibinh',
        skills: [
          { id: '5', name: 'React Native', proficiency: 'EXPERT' },
          { id: '6', name: 'Flutter', proficiency: 'EXPERT' },
          { id: '7', name: 'iOS', proficiency: 'ADVANCED' },
          { id: '8', name: 'Android', proficiency: 'ADVANCED' }
        ]
      }
    },
    {
      id: 'dev-3',
      email: 'le.van.c@email.com',
      fullname: 'Lê Văn Cường',
      phone: '0901234569',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: new Date('1995-03-10'),
      province: { id: '3', name: 'Đà Nẵng' },
      role: 'DEVELOPER',
      isEnable: true,
      createdDate: new Date('2023-03-05'),
      updatedDate: new Date('2024-01-15'),
      lastLoginDate: new Date('2024-01-23'),
      developerProfile: {
        id: 'dev-profile-3',
        userId: 'dev-3',
        title: 'Mid-level Backend Developer',
        developerLevel: 'MID',
        experienceYears: 4,
        hourlyRate: 30,
        rating: 4.5,
        totalProjects: 15,
        githubUrl: 'https://github.com/levancuong',
        linkedinUrl: 'https://linkedin.com/in/levancuong',
        skills: [
          { id: '9', name: 'Python', proficiency: 'ADVANCED' },
          { id: '10', name: 'Django', proficiency: 'ADVANCED' },
          { id: '11', name: 'PostgreSQL', proficiency: 'INTERMEDIATE' },
          { id: '12', name: 'Docker', proficiency: 'INTERMEDIATE' }
        ]
      }
    },
    {
      id: 'dev-4',
      email: 'pham.thi.d@email.com',
      fullname: 'Phạm Thị Dung',
      phone: '0901234570',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: new Date('1998-11-18'),
      province: { id: '4', name: 'Cần Thơ' },
      role: 'DEVELOPER',
      isEnable: true,
      createdDate: new Date('2023-04-12'),
      updatedDate: new Date('2024-01-12'),
      lastLoginDate: new Date('2024-01-22'),
      developerProfile: {
        id: 'dev-profile-4',
        userId: 'dev-4',
        title: 'Junior Frontend Developer',
        developerLevel: 'JUNIOR',
        experienceYears: 2,
        hourlyRate: 20,
        rating: 4.2,
        totalProjects: 8,
        githubUrl: 'https://github.com/phamthidung',
        linkedinUrl: 'https://linkedin.com/in/phamthidung',
        skills: [
          { id: '13', name: 'Vue.js', proficiency: 'INTERMEDIATE' },
          { id: '14', name: 'JavaScript', proficiency: 'ADVANCED' },
          { id: '15', name: 'CSS', proficiency: 'ADVANCED' },
          { id: '16', name: 'HTML', proficiency: 'EXPERT' }
        ]
      }
    },
    {
      id: 'dev-5',
      email: 'hoang.van.e@email.com',
      fullname: 'Hoàng Văn Em',
      phone: '0901234571',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: new Date('1988-07-25'),
      province: { id: '5', name: 'Hải Phòng' },
      role: 'DEVELOPER',
      isEnable: false,
      createdDate: new Date('2023-01-20'),
      updatedDate: new Date('2024-01-10'),
      lastLoginDate: new Date('2024-01-05'),
      developerProfile: {
        id: 'dev-profile-5',
        userId: 'dev-5',
        title: 'Senior DevOps Engineer',
        developerLevel: 'SENIOR',
        experienceYears: 12,
        hourlyRate: 55,
        rating: 4.7,
        totalProjects: 40,
        githubUrl: 'https://github.com/hoangvanem',
        linkedinUrl: 'https://linkedin.com/in/hoangvanem',
        skills: [
          { id: '17', name: 'Kubernetes', proficiency: 'EXPERT' },
          { id: '18', name: 'Terraform', proficiency: 'EXPERT' },
          { id: '19', name: 'Jenkins', proficiency: 'ADVANCED' },
          { id: '20', name: 'Linux', proficiency: 'EXPERT' }
        ]
      }
    }
  ];

  // Enhanced mock data for customers
  const mockCustomers: CustomerWithProfile[] = [
    {
      id: 'cust-1',
      email: 'admin@techcorp.vn',
      fullname: 'Nguyễn Minh Tuấn',
      phone: '0901234572',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: new Date('1985-04-12'),
      province: { id: '1', name: 'Hồ Chí Minh' },
      role: 'CUSTOMER',
      isEnable: true,
      createdDate: new Date('2023-01-10'),
      updatedDate: new Date('2024-01-20'),
      lastLoginDate: new Date('2024-01-25'),
      customerProfile: {
        id: 'cust-profile-1',
        userId: 'cust-1',
        companyName: 'TechCorp Solutions',
        companyWebsite: 'https://techcorp.vn',
        industry: 'Technology',
        companySize: '50-200 employees',
        taxId: '0123456789',
        rating: 4.6
      }
    },
    {
      id: 'cust-2',
      email: 'ceo@startupvn.com',
      fullname: 'Trần Thị Lan',
      phone: '0901234573',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: new Date('1982-09-30'),
      province: { id: '2', name: 'Hà Nội' },
      role: 'CUSTOMER',
      isEnable: true,
      createdDate: new Date('2023-02-15'),
      updatedDate: new Date('2024-01-18'),
      lastLoginDate: new Date('2024-01-24'),
      customerProfile: {
        id: 'cust-profile-2',
        userId: 'cust-2',
        companyName: 'StartupVN',
        companyWebsite: 'https://startupvn.com',
        industry: 'Fintech',
        companySize: '10-50 employees',
        taxId: '0987654321',
        rating: 4.8
      }
    },
    {
      id: 'cust-3',
      email: 'manager@ecommerce.vn',
      fullname: 'Lê Văn Minh',
      phone: '0901234574',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: new Date('1979-12-05'),
      province: { id: '3', name: 'Đà Nẵng' },
      role: 'CUSTOMER',
      isEnable: true,
      createdDate: new Date('2023-03-20'),
      updatedDate: new Date('2024-01-15'),
      lastLoginDate: new Date('2024-01-23'),
      customerProfile: {
        id: 'cust-profile-3',
        userId: 'cust-3',
        companyName: 'E-Commerce Plus',
        companyWebsite: 'https://ecommerce.vn',
        industry: 'E-commerce',
        companySize: '200-500 employees',
        taxId: '1122334455',
        rating: 4.4
      }
    },
    {
      id: 'cust-4',
      email: 'director@healthcare.com',
      fullname: 'Phạm Thị Hoa',
      phone: '0901234575',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: new Date('1987-06-18'),
      province: { id: '4', name: 'Cần Thơ' },
      role: 'CUSTOMER',
      isEnable: true,
      createdDate: new Date('2023-04-08'),
      updatedDate: new Date('2024-01-12'),
      lastLoginDate: new Date('2024-01-22'),
      customerProfile: {
        id: 'cust-profile-4',
        userId: 'cust-4',
        companyName: 'Healthcare Solutions',
        companyWebsite: 'https://healthcare.com',
        industry: 'Healthcare',
        companySize: '500+ employees',
        taxId: '5566778899',
        rating: 4.9
      }
    },
    {
      id: 'cust-5',
      email: 'owner@restaurant.vn',
      fullname: 'Hoàng Văn Nam',
      phone: '0901234576',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: new Date('1980-02-14'),
      province: { id: '5', name: 'Hải Phòng' },
      role: 'CUSTOMER',
      isEnable: false,
      createdDate: new Date('2023-01-25'),
      updatedDate: new Date('2024-01-08'),
      lastLoginDate: new Date('2024-01-10'),
      customerProfile: {
        id: 'cust-profile-5',
        userId: 'cust-5',
        companyName: 'Nam Restaurant Chain',
        companyWebsite: 'https://restaurant.vn',
        industry: 'Food & Beverage',
        companySize: '50-200 employees',
        taxId: '9988776655',
        rating: 4.3
      }
    }
  ];

  // Use mock data if no real data
  const displayDevelopers = developers.length > 0 ? developers : mockDevelopers;
  const displayCustomers = customers.length > 0 ? customers : mockCustomers;

  const getDeveloperLevelColor = (level: string | undefined) => {
    switch (level) {
      case 'LEAD': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'SENIOR': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MID': return 'bg-green-100 text-green-800 border-green-200';
      case 'JUNIOR': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
            <p className="text-gray-500 text-sm mt-1">
              Quản lý thông tin developers và customers trong hệ thống
            </p>
          </div>
          <button 
            onClick={refreshAll} 
            disabled={isLoading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang tải...</span>
              </>
            ) : (
              <span>Làm mới dữ liệu</span>
            )}
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Developers</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{displayDevelopers.length}</p>
                <p className="text-xs text-blue-600 mt-1">{displayDevelopers.filter(d => d.isEnable).length} active</p>
              </div>
              <div className="bg-blue-200 rounded-full p-3">
                <Briefcase className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Customers</p>
                <p className="text-2xl font-bold text-green-900 mt-1">{displayCustomers.length}</p>
                <p className="text-xs text-green-600 mt-1">{displayCustomers.filter(c => c.isEnable).length} active</p>
              </div>
              <div className="bg-green-200 rounded-full p-3">
                <Award className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Avg Rating</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">4.6</p>
                <p className="text-xs text-purple-600 mt-1">across all users</p>
              </div>
              <div className="bg-purple-200 rounded-full p-3">
                <Star className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Total Projects</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">123</p>
                <p className="text-xs text-orange-600 mt-1">completed</p>
              </div>
              <div className="bg-orange-200 rounded-full p-3">
                <FolderOpen className="w-6 h-6 text-orange-700" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Section */}
      <Tabs defaultValue="developers" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="developers" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Briefcase className="w-4 h-4 mr-2" />
            Developers ({displayDevelopers.length})
          </TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <Award className="w-4 h-4 mr-2" />
            Customers ({displayCustomers.length})
          </TabsTrigger>
        </TabsList>

        {/* Developers Table */}
        <TabsContent value="developers" className="mt-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 min-w-[150px]">Họ tên</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[200px]">Email & SĐT</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[100px]">Cấp độ</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[80px] text-center">Rating</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[100px] text-center">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-gray-700 min-w-[120px] text-center">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="text-gray-500">Đang tải dữ liệu...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : displayDevelopers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center space-y-2">
                          <Briefcase className="w-12 h-12 text-gray-300" />
                          <p className="font-medium">Không có developer nào</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayDevelopers.map((dev, index) => (
                      <TableRow key={`dev-${dev.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <p className="font-semibold text-gray-900">{dev.fullname}</p>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {dev.email}
                            </p>
                            {dev.phone && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {dev.phone}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {dev.developerProfile?.developerLevel ? (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getDeveloperLevelColor(dev.developerProfile.developerLevel)}`}>
                              {dev.developerProfile.developerLevel}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {dev.developerProfile?.rating ? (
                            <div className="flex items-center justify-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                              <span className="font-semibold text-gray-700">{dev.developerProfile.rating.toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {dev.isEnable ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                              Hoạt động
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                              Vô hiệu hóa
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleViewDetail(dev)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleViewPlannings(dev)}
                              className="px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                            >
                              Planning
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Customers Table */}
        <TabsContent value="customers" className="mt-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700">Họ tên</TableHead>
                    <TableHead className="font-semibold text-gray-700">Email & SĐT</TableHead>
                    <TableHead className="font-semibold text-gray-700">Công ty</TableHead>
                    <TableHead className="font-semibold text-gray-700">Ngành</TableHead>
                    <TableHead className="font-semibold text-gray-700">Quy mô</TableHead>
                    <TableHead className="font-semibold text-gray-700">Rating</TableHead>
                    <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="text-gray-500">Đang tải dữ liệu...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : displayCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center space-y-2">
                          <Award className="w-12 h-12 text-gray-300" />
                          <p className="font-medium">Không có customer nào</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayCustomers.map((cust, index) => (
                      <TableRow key={`cust-${cust.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                        <TableCell>
                          <p className="font-semibold text-gray-900">{cust.fullname}</p>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {cust.email}
                            </p>
                            {cust.phone && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {cust.phone}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">
                              {cust.customerProfile?.companyName || <span className="text-gray-400">N/A</span>}
                            </p>
                            {cust.customerProfile?.companyWebsite && (
                              <a 
                                href={cust.customerProfile.companyWebsite}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center"
                              >
                                <Globe className="w-3 h-3 mr-1" />
                                Website
                              </a>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {cust.customerProfile?.industry ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {cust.customerProfile.industry}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-700">
                            {cust.customerProfile?.companySize || <span className="text-gray-400">N/A</span>}
                          </span>
                        </TableCell>
                        <TableCell>
                          {cust.customerProfile?.rating ? (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                              <span className="font-semibold text-gray-700">{cust.customerProfile.rating.toFixed(1)}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {cust.isEnable ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                              Hoạt động
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                              Vô hiệu hóa
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleViewDetail(cust)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleViewPlannings(cust)}
                              className="px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                            >
                              Planning
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog for viewing user details */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Thông tin chi tiết người dùng</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 mt-4">
              {/* User Basic Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-start space-x-4">
                  <img 
                    src={selectedUser.avatarUrl || selectedUser.avatar || '/default-avatar.png'} 
                    alt={selectedUser.fullname}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.fullname}</h3>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-blue-500" />
                        {selectedUser.email}
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-green-500" />
                          {selectedUser.phone}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                        {formatDate(selectedUser.dateOfBirth)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        {selectedUser.province?.name || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Developer Specific Info */}
              {selectedUser.role === 'DEVELOPER' && (selectedUser as DeveloperWithProfile).developerProfile && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                    Thông tin Developer
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Chức danh</p>
                      <p className="font-medium text-gray-900">
                        {(selectedUser as DeveloperWithProfile).developerProfile?.title || 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Cấp độ</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getDeveloperLevelColor((selectedUser as DeveloperWithProfile).developerProfile?.developerLevel)}`}>
                        {(selectedUser as DeveloperWithProfile).developerProfile?.developerLevel}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Kinh nghiệm</p>
                      <p className="font-medium text-gray-900">
                        {(selectedUser as DeveloperWithProfile).developerProfile?.experienceYears} năm
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Hourly Rate</p>
                      <p className="font-semibold text-green-600">
                        ${(selectedUser as DeveloperWithProfile).developerProfile?.hourlyRate}/h
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Rating</p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="font-semibold text-gray-700">
                          {(selectedUser as DeveloperWithProfile).developerProfile?.rating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Tổng dự án</p>
                      <p className="font-medium text-gray-900">
                        {(selectedUser as DeveloperWithProfile).developerProfile?.totalProjects || 0}
                      </p>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="mt-4 flex items-center space-x-3">
                    {(selectedUser as DeveloperWithProfile).developerProfile?.githubUrl && (
                      <a 
                        href={(selectedUser as DeveloperWithProfile).developerProfile?.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                      >
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </a>
                    )}
                    {(selectedUser as DeveloperWithProfile).developerProfile?.linkedinUrl && (
                      <a 
                        href={(selectedUser as DeveloperWithProfile).developerProfile?.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg text-sm text-blue-700 transition-colors"
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </a>
                    )}
                  </div>

                  {/* Skills */}
                  {(selectedUser as DeveloperWithProfile).developerProfile?.skills && (selectedUser as DeveloperWithProfile).developerProfile!.skills!.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Kỹ năng</p>
                      <div className="flex flex-wrap gap-2">
                        {(selectedUser as DeveloperWithProfile).developerProfile?.skills?.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                            {skill.name} - {skill.proficiency}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Customer Specific Info */}
              {selectedUser.role === 'CUSTOMER' && (selectedUser as CustomerWithProfile).customerProfile && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-green-600" />
                    Thông tin Customer
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Tên công ty</p>
                      <p className="font-medium text-gray-900">
                        {(selectedUser as CustomerWithProfile).customerProfile?.companyName || 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Website</p>
                      {(selectedUser as CustomerWithProfile).customerProfile?.companyWebsite ? (
                        <a 
                          href={(selectedUser as CustomerWithProfile).customerProfile?.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center"
                        >
                          <Globe className="w-4 h-4 mr-1" />
                          Truy cập
                        </a>
                      ) : (
                        <p className="text-gray-400">N/A</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Ngành</p>
                      <p className="font-medium text-gray-900">
                        {(selectedUser as CustomerWithProfile).customerProfile?.industry || 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Quy mô</p>
                      <p className="font-medium text-gray-900">
                        {(selectedUser as CustomerWithProfile).customerProfile?.companySize || 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Mã số thuế</p>
                      <p className="font-medium text-gray-900">
                        {(selectedUser as CustomerWithProfile).customerProfile?.taxId || 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Rating</p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="font-semibold text-gray-700">
                          {(selectedUser as CustomerWithProfile).customerProfile?.rating?.toFixed(1) || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Info */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tài khoản</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Ngày tạo</p>
                    <p className="font-medium text-gray-900 mt-1">{formatDate(selectedUser.createdDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Cập nhật lần cuối</p>
                    <p className="font-medium text-gray-900 mt-1">{formatDate(selectedUser.updatedDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Đăng nhập lần cuối</p>
                    <p className="font-medium text-gray-900 mt-1">{formatDate(selectedUser.lastLoginDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Trạng thái</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                      selectedUser.isEnable 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {selectedUser.isEnable ? 'Hoạt động' : 'Vô hiệu hóa'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for viewing user plannings */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Planning của {selectedUser?.fullname}</DialogTitle>
            <DialogDescription className="flex items-center text-gray-600 mt-2">
              <Mail className="w-4 h-4 mr-2" />
              {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            {loadingPlannings ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <svg className="animate-spin h-10 w-10 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500">Đang tải planning...</p>
              </div>
            ) : userPlannings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-4 text-gray-500 font-medium">Người dùng chưa mua planning nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userPlannings.map((userPlanning, index) => (
                  <div
                    key={`${userPlanning.orderId}-${index}`}
                    className={`relative rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
                      userPlanning.isEnable
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">
                          {userPlanning.planning?.name || 'N/A'}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {userPlanning.planning?.description || 'Không có mô tả'}
                        </p>
                      </div>
                      {userPlanning.isEnable && (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-green-500 text-white shadow-sm">
                          ● Đang hoạt động
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Order ID</p>
                        <p className="font-mono text-sm font-medium text-gray-900">{userPlanning.orderId}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Giá</p>
                        <p className="font-semibold text-green-600">{formatCurrency(userPlanning.price)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Ngày mua</p>
                        <p className="text-sm font-medium text-gray-900">{formatDate(userPlanning.transactionDate)}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Thời hạn</p>
                        <p className="text-sm font-medium text-gray-900">{userPlanning.planning?.daysLimit || 0} ngày</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Giới hạn/ngày</p>
                        <p className="text-sm font-medium text-gray-900">{userPlanning.planning?.dailyLimit || 0} requests</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Loại AI</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                          {userPlanning.planning?.aiModel?.modelType || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}



