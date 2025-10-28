"use client";

import { useState, useEffect } from "react";
import { FaCheckCircle, FaCrown, FaRocket, FaStar } from "react-icons/fa";
import { usePlanningManagement } from "@/hooks/usePlanningManagement";
import { Planning } from "@/types/planning.type";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type PlanData = {
  id: string;
  name: string;
  description: string;
  price: number;
  forDeveloper: boolean;
  forCustomer: boolean;
  button: {
    text: string;
    type: "primary" | "secondary";
  };
  badge?: string;
  features: string[];
};

export default function PlanningPricing() {
  const router = useRouter();
  const { user } = useAuth();
  const { plannings, activeUserPlanning, isLoading, getAllPlanningsPublic, getActiveUserPlanning } = usePlanningManagement();
  const [plans, setPlans] = useState<PlanData[]>([]);

  useEffect(() => {
    getAllPlanningsPublic();
    if (user) {
      getActiveUserPlanning();
    }
  }, [getAllPlanningsPublic, getActiveUserPlanning, user]);

  useEffect(() => {
    if (plannings.length > 0) {
      const formattedPlans: PlanData[] = plannings
        .filter((planning: Planning) => {
          // Filter out deleted plannings
          if (planning.isDeleted) return false;
          
          // Filter based on user role
          if (user?.role === 'DEVELOPER') {
            return planning.forDeveloper;
          } else if (user?.role === 'CUSTOMER') {
            return planning.forCustomer;
          }
          
          // If no user or other role, show all active plannings
          return true;
        })
        .sort((a, b) => a.price - b.price) // Sort by price (low to high)
        .map((planning: Planning, index: number) => {
          // Split description by semicolon to get features
          const features = planning.description 
            ? planning.description.split(';').map(f => f.trim()).filter(f => f)
            : [];

          return {
            id: planning.id || `plan-${index}`,
            name: planning.name || "Gói cơ bản",
            description: features[0] || "Gói dịch vụ AI cơ bản",
            price: planning.price || 0,
            forDeveloper: planning.forDeveloper,
            forCustomer: planning.forCustomer,
            button: {
              text: "Chọn gói",
              type: index === 1 ? "primary" : "secondary"
            },
            badge: getPlanBadge(planning.name),
            features: features
          };
        });
      
      setPlans(formattedPlans);
    }
  }, [plannings, user]);

  const getPlanBadge = (planName: string): string => {
    const modelType = planName.toLowerCase();
    switch (modelType) {
      case 'basic': return 'Basic';
      case 'pro': return 'Popular';
      case 'enterprise': return 'Enterprise';
      case 'developer': return 'Developer';
      default: return 'Basic';
    }
  };

  const handleSelectPackage = (packageId: string) => {
    router.push(`/planning/pricing/${packageId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-300 rounded mb-4"></div>
          <div className="h-3 sm:h-4 bg-gray-300 rounded mb-6 sm:mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                <div className="h-5 sm:h-6 bg-gray-300 rounded mb-3 sm:mb-4"></div>
                <div className="h-3 sm:h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-24 sm:h-32 bg-gray-300 rounded mb-4"></div>
                <div className="h-8 sm:h-10 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-10">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 text-gray-900">
        Gói dịch vụ
      </h2>
      <p className="text-xs sm:text-sm text-gray-700 mb-6 sm:mb-8">
        Khám phá các tính năng độc quyền cùng với sức mạnh của AI với các gói dịch vụ được thiết kế cho mọi nhu cầu từ cá nhân đến doanh nghiệp.
      </p>

      {/* Show message if user is logged in but has no active plan */}
      {user && !activeUserPlanning && !isLoading && (
        <div className="mb-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 max-w-2xl mx-auto">
          <p className="text-sm text-yellow-800">
            Bạn chưa có gói dịch vụ nào. Hãy chọn một gói phù hợp bên dưới!
          </p>
        </div>
      )}

      {/* Pricing cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {plans.map(({ id, name, description, price, forDeveloper, forCustomer, button, badge, features }, i) => (
          <div
            key={id}
            className="bg-white rounded-xl shadow-lg flex flex-col p-4 sm:p-6 relative hover:shadow-xl transition-shadow"
          >
            {/* Badge */}
            {badge && (
              <div
                className={`absolute top-3 right-3 sm:top-4 sm:right-4 text-xs font-semibold px-2 py-1 rounded-full ${
                  badge === "Popular" 
                    ? "bg-blue-600 text-white" 
                    : badge === "Enterprise"
                    ? "bg-purple-600 text-white"
                    : badge === "Developer"
                    ? "bg-orange-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {badge}
              </div>
            )}

            {/* Icon */}
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                badge === "Popular" 
                  ? "bg-blue-100" 
                  : badge === "Enterprise"
                  ? "bg-purple-100"
                  : badge === "Developer"
                  ? "bg-orange-100"
                  : "bg-green-100"
              }`}>
                {badge === "Enterprise" ? (
                  <FaCrown className="text-lg sm:text-xl text-purple-600" />
                ) : badge === "Popular" ? (
                  <FaRocket className="text-lg sm:text-xl text-blue-600" />
                ) : badge === "Developer" ? (
                  <FaStar className="text-lg sm:text-xl text-orange-600" />
                ) : (
                  <FaStar className="text-lg sm:text-xl text-green-600" />
                )}
              </div>
            </div>

            {/* Price */}
            <div className="mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
                {price.toLocaleString('vi-VN')}
              </span>
              <span className="text-xs sm:text-sm text-gray-700 block sm:inline"> VND</span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">{name}</h3>
            
            {/* Package Details - User Types */}
            <div className="text-xs sm:text-sm mb-3 sm:mb-4 flex flex-wrap gap-2">
              {forDeveloper && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  Developer
                </span>
              )}
              {forCustomer && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  Customer
                </span>
              )}
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-3 sm:pt-4 mb-4 sm:mb-6 flex-grow">
              <h4 className="font-semibold mb-2 sm:mb-3 text-gray-900 text-sm sm:text-base">Tính năng</h4>
              <ul className="text-xs text-gray-700 space-y-1 sm:space-y-2">
                {features.length > 0 ? features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-500 mt-[2px] sm:mt-[3px] flex-shrink-0 text-xs sm:text-sm" />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                )) : (
                  <li className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-500 mt-[2px] sm:mt-[3px] flex-shrink-0 text-xs sm:text-sm" />
                    <span className="leading-relaxed">{description}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Button */}
            <button
              onClick={() => handleSelectPackage(id)}
              className={`cursor-pointer w-full rounded-full py-2 sm:py-3 text-white font-semibold transition text-sm sm:text-base ${
                button.type === "primary"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : badge === "Enterprise"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : badge === "Developer"
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {button.text}
            </button>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-8 sm:mt-12 text-center mb-10">
        <p className="text-xs sm:text-sm text-gray-600 mb-4">
          Tất cả gói đều bao gồm hỗ trợ khách hàng 24/7 và cập nhật tự động
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            Hủy bất cứ lúc nào
          </span>
          <span className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            Bảo mật cao
          </span>
          <span className="flex items-center gap-2">
            <FaCheckCircle className="text-green-500" />
            Sao lưu tự động
          </span>
        </div>
      </div>
    </div>
  );
}
