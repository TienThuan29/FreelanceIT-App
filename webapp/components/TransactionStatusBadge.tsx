import { TransactionStatus } from '@/types/transaction.type';
import { FaCheckCircle, FaClock, FaTimesCircle, FaBan } from 'react-icons/fa';

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  showIcon?: boolean;
}

export const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({ 
  status, 
  showIcon = true 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return {
          icon: FaCheckCircle,
          text: 'Thành công',
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
        };
      case TransactionStatus.PENDING:
        return {
          icon: FaClock,
          text: 'Đang chờ',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200',
        };
      case TransactionStatus.FAILED:
        return {
          icon: FaTimesCircle,
          text: 'Thất bại',
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
        };
      case TransactionStatus.CANCELLED:
        return {
          icon: FaBan,
          text: 'Đã hủy',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
        };
      default:
        return {
          icon: FaClock,
          text: 'Không xác định',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
    >
      {showIcon && <Icon className="text-xs" />}
      {config.text}
    </span>
  );
};
