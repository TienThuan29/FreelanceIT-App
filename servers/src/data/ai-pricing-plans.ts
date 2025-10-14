import { Planning } from "../models/planning.model";

export const aiPricingPlans: Omit<Planning, 'id' | 'createdDate' | 'updateDate'>[] = [
    {
        name: "Gói AI Basic",
        description: "Gói cơ bản cho người dùng cá nhân, phù hợp cho các tác vụ AI nhỏ và thử nghiệm.",
        price: 99000, // 99,000 VND
        dailyLimit: 50, // 50 requests per day
        daysLimit: 30, // 30 days
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
    },
    {
        name: "Gói AI Pro",
        description: "Gói chuyên nghiệp với hiệu suất cao hơn, lý tưởng cho các dự án vừa và nhỏ.",
        price: 299000, // 299,000 VND
        dailyLimit: 200, // 200 requests per day
        daysLimit: 30, // 30 days
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
    },
    {
        name: "Gói AI Enterprise",
        description: "Giải pháp AI toàn diện cho doanh nghiệp, tùy chỉnh và hỗ trợ 24/7.",
        price: 999000, // 999,000 VND
        dailyLimit: 1000, // 1000 requests per day
        daysLimit: 365, // 365 days (1 năm)
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
    },
    {
        name: "Gói AI Developer",
        description: "Gói dành cho nhà phát triển, cung cấp quyền truy cập đầy đủ vào API và công cụ phát triển.",
        price: 199000, // 199,000 VND
        dailyLimit: 500, // 500 requests per day
        daysLimit: 90, // 90 days
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
    },
    {
        name: "Gói AI Starter",
        description: "Gói khởi đầu với giá rẻ, phù hợp cho người mới bắt đầu sử dụng AI.",
        price: 49000, // 49,000 VND
        dailyLimit: 20, // 20 requests per day
        daysLimit: 7, // 7 days
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
    },
    {
        name: "Gói AI Premium",
        description: "Gói cao cấp với các tính năng đặc biệt, phù hợp cho doanh nghiệp vừa.",
        price: 499000, // 499,000 VND
        dailyLimit: 500, // 500 requests per day
        daysLimit: 180, // 180 days (6 tháng)
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
    }
];
