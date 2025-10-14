"use client";

import { useState, useEffect } from "react";
import { FaCheckCircle, FaCrown, FaRocket, FaStar } from "react-icons/fa";
import { usePlanningManagement } from "@/hooks/usePlanningManagement";
import { Planning, DurationType } from "@/types/planning.type";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type PlanData = {
  id: string;
  name: string;
  descriptions: string[];
  price: number;
  currency: string;
  duration: number;
  durationType: DurationType;
  maxProjects?: number;
  maxStorage?: number;
  prioritySupport: boolean;
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
  const { plannings, isLoading, getAllPlannings } = usePlanningManagement();
  const [plans, setPlans] = useState<PlanData[]>([]);

  useEffect(() => {
    getAllPlannings();
  }, [getAllPlannings]);

  useEffect(() => {
    if (plannings.length > 0) {
      const formattedPlans: PlanData[] = plannings
        .filter((planning: Planning) => planning.isActive)
        .map((planning: Planning, index: number) => {
          // Split description by "." and filter out empty strings
          const descriptions = planning.description 
            ? planning.description.split('.').map(desc => desc.trim()).filter(desc => desc.length > 0)
            : ["Quản lý dự án hiệu quả", "Tối ưu hóa quy trình làm việc"];
          
          // Extract features from planning features
          const features = planning.features
            .filter(feature => feature.isIncluded)
            .map(feature => feature.name);

          return {
            id: planning.id || `plan-${index}`,
            name: planning.name || "Gói cơ bản",
            descriptions: descriptions,
            price: planning.price || 0,
            currency: planning.currency || 'VND',
            duration: planning.duration || 30,
            durationType: planning.durationType || DurationType.DAYS,
            maxProjects: planning.maxProjects,
            maxStorage: planning.maxStorage,
            prioritySupport: planning.prioritySupport || false,
            button: {
              text: "Chọn gói",
              type: index === 1 ? "primary" : "secondary"
            },
            badge: index === 1 ? "Popular" : index === 0 ? "Basic" : "Premium",
            features: features
          };
        });
      
      setPlans(formattedPlans);
    }
  }, [plannings]);

  const handleSelectPackage = (packageId: string) => {
    router.push(`/planning/pricing/${packageId}`);
  };

  const formatDuration = (duration: number, durationType: DurationType): string => {
    switch (durationType) {
      case DurationType.DAYS:
        return `${duration} ngày`;
      case DurationType.MONTHS:
        return `${duration} tháng`;
      case DurationType.YEARS:
        return `${duration} năm`;
      default:
        return `${duration} ngày`;
    }
  };

  const formatStorage = (storage?: number): string => {
    if (!storage) return "Không giới hạn";
    if (storage >= 1024) {
      return `${(storage / 1024).toFixed(1)} GB`;
    }
    return `${storage} MB`;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-2 text-gray-900">
        Gói dịch vụ quản lý dự án và lập kế hoạch
      </h2>
      <p className="text-xs sm:text-sm text-gray-700 mb-6 sm:mb-8">
        Tối ưu hóa quy trình làm việc và quản lý dự án hiệu quả với các gói dịch vụ chuyên nghiệp.
      </p>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {plans.map(({ id, name, descriptions, price, currency, duration, durationType, maxProjects, maxStorage, prioritySupport, button, badge, features }, i) => (
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
                    : badge === "Premium"
                    ? "bg-purple-600 text-white"
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
                  : badge === "Premium"
                  ? "bg-purple-100"
                  : "bg-green-100"
              }`}>
                {badge === "Premium" ? (
                  <FaCrown className={`text-lg sm:text-xl ${badge === "Premium" ? "text-purple-600" : "text-green-600"}`} />
                ) : badge === "Popular" ? (
                  <FaRocket className="text-lg sm:text-xl text-blue-600" />
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
              <span className="text-xs sm:text-sm text-gray-700 block sm:inline"> {currency} / {formatDuration(duration, durationType)}</span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">{name}</h3>
            
            {/* Package Details */}
            <div className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 space-y-1">
              {maxProjects && (
                <p>Tối đa: {maxProjects >= 999999 ? 'Không giới hạn' : maxProjects} dự án</p>
              )}
              {maxStorage && (
                <p>Lưu trữ: {formatStorage(maxStorage)}</p>
              )}
              <p>Thời hạn: {formatDuration(duration, durationType)}</p>
              {prioritySupport && (
                <p className="text-blue-600 font-semibold">✓ Hỗ trợ ưu tiên</p>
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
                )) : descriptions.map((desc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <FaCheckCircle className="text-green-500 mt-[2px] sm:mt-[3px] flex-shrink-0 text-xs sm:text-sm" />
                    <span className="leading-relaxed">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Button */}
            <button
              onClick={() => handleSelectPackage(id)}
              className={`cursor-pointer w-full rounded-full py-2 sm:py-3 text-white font-semibold transition text-sm sm:text-base ${
                button.type === "primary"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : badge === "Premium"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {button.text}
            </button>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-8 sm:mt-12 text-center">
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
