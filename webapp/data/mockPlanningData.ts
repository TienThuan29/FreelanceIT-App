import { Planning, UserPlanning } from '@/types/planning.type';

export const mockPlannings: Planning[] = [
    {
        id: "plan-1",
        name: "Gói AI Basic",
        description: "Gói cơ bản cho người dùng cá nhân, phù hợp cho các tác vụ AI nhỏ và thử nghiệm.",
        price: 99000,
        dailyLimit: 50,
        daysLimit: 30,
        aiModel: {
            modelType: "basic",
            features: [
                "Truy cập AI cơ bản",
                "Hỗ trợ cộng đồng",
                "50 requests/ngày",
                "Thời hạn 30 ngày"
            ],
            maxTokens: 2000,
            responseTime: "standard"
        },
        isDeleted: false,
        createdDate: new Date('2024-01-01'),
        updateDate: new Date('2024-01-01')
    },
    {
        id: "plan-2",
        name: "Gói AI Pro",
        description: "Gói chuyên nghiệp với hiệu suất cao hơn, lý tưởng cho các dự án vừa và nhỏ.",
        price: 299000,
        dailyLimit: 200,
        daysLimit: 30,
        aiModel: {
            modelType: "pro",
            features: [
                "Truy cập AI nâng cao",
                "Hỗ trợ ưu tiên",
                "Tích hợp API",
                "200 requests/ngày",
                "Thời hạn 30 ngày"
            ],
            maxTokens: 8000,
            responseTime: "fast"
        },
        isDeleted: false,
        createdDate: new Date('2024-01-01'),
        updateDate: new Date('2024-01-01')
    },
    {
        id: "plan-3",
        name: "Gói AI Enterprise",
        description: "Giải pháp AI toàn diện cho doanh nghiệp, tùy chỉnh và hỗ trợ 24/7.",
        price: 999000,
        dailyLimit: 1000,
        daysLimit: 365,
        aiModel: {
            modelType: "enterprise",
            features: [
                "Truy cập AI cao cấp",
                "Tùy chỉnh mô hình",
                "Hỗ trợ 24/7",
                "Báo cáo chuyên sâu",
                "1000 requests/ngày",
                "Thời hạn 1 năm",
                "Tích hợp CRM/ERP"
            ],
            maxTokens: 32000,
            responseTime: "ultra-fast",
            integrations: ["CRM", "ERP"],
            customTraining: true,
            sla: "99.9%"
        },
        isDeleted: false,
        createdDate: new Date('2024-01-01'),
        updateDate: new Date('2024-01-01')
    },
    {
        id: "plan-4",
        name: "Gói AI Developer",
        description: "Gói dành cho nhà phát triển, cung cấp quyền truy cập đầy đủ vào API và công cụ phát triển.",
        price: 199000,
        dailyLimit: 500,
        daysLimit: 90,
        aiModel: {
            modelType: "developer",
            features: [
                "API Access đầy đủ",
                "Sandbox Environment",
                "Early Access to Features",
                "Community Support",
                "500 requests/ngày",
                "Thời hạn 90 ngày"
            ],
            maxTokens: 16000,
            responseTime: "fast",
            languages: ["Python", "JavaScript", "Java"]
        },
        isDeleted: false,
        createdDate: new Date('2024-01-01'),
        updateDate: new Date('2024-01-01')
    },
    {
        id: "plan-5",
        name: "Gói AI Starter",
        description: "Gói khởi đầu với giá rẻ, phù hợp cho người mới bắt đầu sử dụng AI.",
        price: 49000,
        dailyLimit: 20,
        daysLimit: 7,
        aiModel: {
            modelType: "basic",
            features: [
                "AI cơ bản",
                "20 requests/ngày",
                "Thời hạn 7 ngày",
                "Hỗ trợ email"
            ],
            maxTokens: 1000,
            responseTime: "standard"
        },
        isDeleted: false,
        createdDate: new Date('2024-01-01'),
        updateDate: new Date('2024-01-01')
    },
    {
        id: "plan-6",
        name: "Gói AI Premium",
        description: "Gói cao cấp với các tính năng đặc biệt, phù hợp cho doanh nghiệp vừa.",
        price: 499000,
        dailyLimit: 500,
        daysLimit: 180,
        aiModel: {
            modelType: "pro",
            features: [
                "AI nâng cao",
                "Tùy chỉnh model",
                "Hỗ trợ ưu tiên",
                "500 requests/ngày",
                "Thời hạn 6 tháng",
                "Analytics dashboard"
            ],
            maxTokens: 16000,
            responseTime: "fast",
            customTraining: true,
            sla: "99.5%"
        },
        isDeleted: false,
        createdDate: new Date('2024-01-01'),
        updateDate: new Date('2024-01-01')
    }
];

export const mockUserPlannings: UserPlanning[] = [
    {
        userId: "user-1",
        planningId: "plan-2",
        planning: mockPlannings[1], // AI Pro
        orderId: "ORDER-001",
        transactionDate: new Date('2024-01-15'),
        price: 299000,
        isEnable: true
    },
    {
        userId: "user-1", 
        planningId: "plan-1",
        planning: mockPlannings[0], // AI Basic
        orderId: "ORDER-002",
        transactionDate: new Date('2023-12-01'),
        price: 99000,
        isEnable: false
    }
];

// Mock function to simulate API calls
export const mockPlanningAPI = {
    // Simulate delay
    delay: (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms)),

    // Get all plannings
    getAllPlannings: async (): Promise<Planning[]> => {
        await mockPlanningAPI.delay(500);
        return mockPlannings.filter(plan => !plan.isDeleted);
    },

    // Get planning by ID
    getPlanningById: async (id: string): Promise<Planning | null> => {
        await mockPlanningAPI.delay(300);
        return mockPlannings.find(plan => plan.id === id && !plan.isDeleted) || null;
    },

    // Get user plannings
    getUserPlannings: async (userId: string): Promise<UserPlanning[]> => {
        await mockPlanningAPI.delay(500);
        return mockUserPlannings.filter(userPlan => userPlan.userId === userId);
    },

    // Get active user planning
    getActiveUserPlanning: async (userId: string): Promise<UserPlanning | null> => {
        await mockPlanningAPI.delay(300);
        return mockUserPlannings.find(userPlan => 
            userPlan.userId === userId && userPlan.isEnable
        ) || null;
    },

    // Purchase planning
    purchasePlanning: async (userId: string, purchaseRequest: any): Promise<UserPlanning> => {
        await mockPlanningAPI.delay(1000);
        
        const planning = mockPlannings.find(p => p.id === purchaseRequest.planningId);
        if (!planning) {
            throw new Error('Planning not found');
        }

        // Deactivate current active planning
        mockUserPlannings.forEach(userPlan => {
            if (userPlan.userId === userId && userPlan.isEnable) {
                userPlan.isEnable = false;
            }
        });

        // Create new user planning
        const newUserPlanning: UserPlanning = {
            userId,
            planningId: planning.id,
            planning,
            orderId: purchaseRequest.orderId,
            transactionDate: new Date(),
            price: purchaseRequest.price,
            isEnable: true
        };

        mockUserPlannings.push(newUserPlanning);
        return newUserPlanning;
    },

    // Confirm payment
    confirmPayment: async (orderId: string): Promise<UserPlanning> => {
        await mockPlanningAPI.delay(500);
        
        const userPlanning = mockUserPlannings.find(up => up.orderId === orderId);
        if (!userPlanning) {
            throw new Error('User planning not found');
        }

        userPlanning.isEnable = true;
        return userPlanning;
    }
};
