import { PlanningService } from '../services/planning.service';
import { PlanningCreate } from '../models/planning.model';

const planningService = new PlanningService();

// 3 gói Planning dành cho Developer
const developerPlannings: PlanningCreate[] = [
    {
        name: "Gói Developer Khởi Đầu",
        description: "Gói khởi đầu cho Developer;Quản lý tối đa 5 dự án;Công cụ quản lý task cơ bản;Lưu trữ 5GB;Hỗ trợ email;Báo cáo cơ bản",
        price: 199000,
        forDeveloper: true,
        forCustomer: false,
        detailDevPlanning: {
            numberOfJoinedProjects: 5,
            numberOfProducts: 3,
            useChatbot: false
        },
        isDeleted: false
    },
    {
        name: "Gói Developer Chuyên Nghiệp",
        description: "Gói chuyên nghiệp cho Developer;Quản lý không giới hạn dự án;Công cụ quản lý task nâng cao;Lưu trữ 50GB;Hỗ trợ ưu tiên;Báo cáo chi tiết;Tích hợp Git;Truy cập API;Công cụ đánh giá mã nguồn",
        price: 499000,
        forDeveloper: true,
        forCustomer: false,
        detailDevPlanning: {
            numberOfJoinedProjects: 20,
            numberOfProducts: 10,
            useChatbot: true
        },
        isDeleted: false
    },
    {
        name: "Gói Developer Doanh Nghiệp",
        description: "Gói doanh nghiệp cho Developer;Tất cả tính năng gói Chuyên Nghiệp;Lưu trữ không giới hạn;Hỗ trợ 24/7;Công cụ cộng tác nhóm;Tích hợp tùy chỉnh;Bảo mật nâng cao;Quản lý tài khoản riêng;Cam kết SLA 99.9%",
        price: 1299000,
        forDeveloper: true,
        forCustomer: false,
        detailDevPlanning: {
            numberOfJoinedProjects: 999,
            numberOfProducts: 999,
            useChatbot: true
        },
        isDeleted: false
    }
];

// 3 gói Planning dành cho Customer
const customerPlannings: PlanningCreate[] = [
    {
        name: "Gói Khách Hàng Cơ Bản",
        description: "Gói cơ bản cho khách hàng;Đăng tối đa 3 dự án mỗi tháng;Tìm kiếm developer;Xem hồ sơ developer;Hỗ trợ qua email;Trò chuyện với developer",
        price: 149000,
        forDeveloper: false,
        forCustomer: true,
        detailCustomerPlanning: {
            numberOfProjects: 3,
            useChatbot: false
        },
        isDeleted: false
    },
    {
        name: "Gói Khách Hàng Kinh Doanh",
        description: "Gói kinh doanh cho khách hàng;Đăng không giới hạn dự án;Tìm kiếm nâng cao;Xem chi tiết hồ sơ developer;Hỗ trợ ưu tiên;Quản lý nhiều dự án;Báo cáo tiến độ;Theo dõi tiến độ dự án;Quản lý ngân sách",
        price: 399000,
        forDeveloper: false,
        forCustomer: true,
        detailCustomerPlanning: {
            numberOfProjects: 15,
            useChatbot: true
        },
        isDeleted: false
    },
    {
        name: "Gói Khách Hàng Cao Cấp",
        description: "Gói cao cấp cho khách hàng;Tất cả tính năng gói Kinh Doanh;Ghép đôi developer bằng AI;Hỗ trợ 24/7;Quản lý dự án riêng;Quản lý hợp đồng;Bảo vệ thanh toán;Đảm bảo chất lượng;Ưu tiên tuyển dụng;Quy trình làm việc tùy chỉnh",
        price: 999000,
        forDeveloper: false,
        forCustomer: true,
        detailCustomerPlanning: {
            numberOfProjects: 999,
            useChatbot: true
        },
        isDeleted: false
    }
];

async function createPlanning(planningData: PlanningCreate): Promise<void> {
    try {
        const planning = await planningService.createPlanning(planningData);
        
        if (planning) {
            console.log(`Đã tạo: ${planning.name}`);
            console.log(`   ID: ${planning.id}`);
            console.log(`   Giá: ${planning.price.toLocaleString('vi-VN')} VND`);
            console.log(`   Dành cho: ${planning.forDeveloper ? 'Developer' : 'Khách hàng'}`);
        } else {
            console.error(`Tạo thất bại ${planningData.name}: Service trả về null`);
        }
    } catch (error: any) {
        console.error(`Tạo thất bại ${planningData.name}:`, error.message || error);
    }
}

async function seedPlannings(): Promise<void> {
    console.log('Bắt đầu tạo dữ liệu Planning...\n');
    console.log('================================================\n');

    console.log('Đang tạo các gói cho Developer...\n');
    for (const planning of developerPlannings) {
        await createPlanning(planning);
        console.log('');
    }

    console.log('\nĐang tạo các gói cho Customer...\n');
    for (const planning of customerPlannings) {
        await createPlanning(planning);
        console.log('');
    }

    console.log('\n================================================');
    console.log('Hoàn thành tạo dữ liệu Planning!');
    console.log('Tổng số đã tạo: 6 gói (3 cho Developer, 3 cho Customer)');
    console.log('================================================\n');
}

// Chạy script tạo dữ liệu
seedPlannings()
    .then(() => {
        console.log('Script tạo dữ liệu hoàn tất thành công');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Script tạo dữ liệu thất bại:', error);
        process.exit(1);
    });

