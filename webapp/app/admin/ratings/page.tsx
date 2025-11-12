'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, TrendingUp, Users, RefreshCw, BarChart3, Calendar } from 'lucide-react';
import { format, parseISO, startOfDay, startOfMonth } from 'date-fns';
import useRating, { RatingDTO } from '@/hooks/useRating';
import { useAdminStats } from '@/hooks/useAdminStats';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminRatingsPage() {
  const { getAll } = useRating();
  const { stats: adminStats, isLoading: statsLoading, refresh: refreshStats } = useAdminStats();
  const [ratings, setRatings] = useState<RatingDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [chartView, setChartView] = useState<'day' | 'month'>('day');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getAll();
        setRatings(data);
        await refreshStats();
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalComments = ratings.filter(r => r.comment && r.comment.trim().length > 0).length;
    const totalStars = ratings.reduce((sum, r) => sum + r.stars, 0);
    const avgStars = ratings.length > 0 ? totalStars / ratings.length : 0;
    const starDistribution = {
      '1': ratings.filter(r => r.stars === 1).length,
      '2': ratings.filter(r => r.stars === 2).length,
      '3': ratings.filter(r => r.stars === 3).length,
      '4': ratings.filter(r => r.stars === 4).length,
      '5': ratings.filter(r => r.stars === 5).length,
    };

    return {
      totalRatings: ratings.length,
      totalComments,
      totalStars,
      avgStars: Number(avgStars.toFixed(2)),
      starDistribution,
    };
  }, [ratings]);

  // Group ratings by day or month
  const chartData = useMemo(() => {
    if (ratings.length === 0) return [];

    const grouped = new Map<string, number>();

    ratings.forEach((rating) => {
      const date = typeof rating.createdDate === 'string' 
        ? parseISO(rating.createdDate) 
        : new Date(rating.createdDate);
      
      const key = chartView === 'day' 
        ? format(startOfDay(date), 'yyyy-MM-dd')
        : format(startOfMonth(date), 'yyyy-MM');
      
      grouped.set(key, (grouped.get(key) || 0) + 1);
    });

    // Convert to array and sort by date
    const data = Array.from(grouped.entries())
      .map(([date, count]) => {
        const label = chartView === 'day' 
          ? format(parseISO(date), 'dd/MM/yyyy')
          : format(new Date(date + '-01'), 'MM/yyyy');
        return {
          date,
          count,
          label,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    return data;
  }, [ratings, chartView]);

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await getAll();
      setRatings(data);
      await refreshStats();
    } catch (error) {
      console.error('Error refreshing ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const StatCard = ({ title, value, icon: Icon, color, subtitle, delay = 0 }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 opacity-50"></div>
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-center space-x-2">
              <motion.div
                key={loading ? 'loading' : 'loaded'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-bold text-gray-900"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                    <span className="text-gray-400">...</span>
                  </div>
                ) : (
                  value
                )}
              </motion.div>
            </div>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Đánh giá người dùng</h1>
            <p className="text-gray-500 text-sm mt-1">
              Quản lý và xem thống kê đánh giá từ người dùng
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng đánh giá"
          value={stats.totalRatings}
          icon={Star}
          color="bg-gradient-to-r from-yellow-500 to-yellow-600"
          subtitle={`${stats.totalComments} có bình luận`}
          delay={0.1}
        />
        <StatCard
          title="Tổng sao"
          value={stats.totalStars}
          icon={TrendingUp}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          subtitle="Tổng số sao đã đánh giá"
          delay={0.2}
        />
        <StatCard
          title="Điểm trung bình"
          value={`${stats.avgStars}/5`}
          icon={Star}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          subtitle="Đánh giá trung bình"
          delay={0.3}
        />
        <StatCard
          title="Tổng bình luận"
          value={stats.totalComments}
          icon={MessageSquare}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          subtitle={`${stats.totalRatings > 0 ? ((stats.totalComments / stats.totalRatings) * 100).toFixed(1) : 0}% có bình luận`}
          delay={0.4}
        />
      </div>

      {/* Star Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-600" />
          Phân bố đánh giá theo sao
        </h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((starValue) => {
            const count = stats.starDistribution[String(starValue) as keyof typeof stats.starDistribution];
            const percentage = stats.totalRatings > 0 ? (count / stats.totalRatings) * 100 : 0;
            const maxCount = Math.max(...Object.values(stats.starDistribution), 1);
            const barWidth = (count / maxCount) * 100;

            return (
              <div key={starValue} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < starValue ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{starValue} sao</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                    <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.8, delay: starValue * 0.1 }}
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Reviews by Day/Month Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Tổng đánh giá theo {chartView === 'day' ? 'ngày' : 'tháng'}
          </h3>
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartView('day')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                chartView === 'day'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Ngày
            </button>
            <button
              onClick={() => setChartView('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                chartView === 'month'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Tháng
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <BarChart3 className="w-12 h-12 text-gray-300 mb-3" />
            <p>Chưa có dữ liệu đánh giá</p>
          </div>
        ) : (
          <div className="relative h-80 bg-gray-50 rounded-lg p-6 border border-gray-200 overflow-visible">
            {(() => {
              const maxCount = Math.max(...chartData.map(d => d.count), 1);
              
              // Chart dimensions with proper padding
              const padding = { top: 20, right: 40, bottom: 40, left: 80 };
              const chartAreaWidth = 800;
              const chartAreaHeight = 300;
              const usableHeight = chartAreaHeight - padding.top - padding.bottom;
              const usableWidth = chartAreaWidth - padding.left - padding.right;
              
              // Scale factor
              const countScale = usableHeight / maxCount;
              
              // Bar dimensions
              const barWidth = 40;
              const barGap = 20;
              const totalBarWidth = chartData.length * barWidth + (chartData.length - 1) * barGap;
              const startX = padding.left + (usableWidth - totalBarWidth) / 2;
              const bottomY = padding.top + usableHeight;

              return (
                <svg 
                  className="w-full h-full" 
                  viewBox={`0 0 ${chartAreaWidth} ${chartAreaHeight}`}
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Grid lines for counts (Y-axis) */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const value = Math.ceil(maxCount * ratio);
                    const y = bottomY - (ratio * usableHeight);
                    return (
                      <g key={`count-${ratio}`}>
                        <line
                          x1={padding.left}
                          y1={y}
                          x2={chartAreaWidth - padding.right}
                          y2={y}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                          strokeDasharray="4,4"
                        />
                        <text
                          x={padding.left - 15}
                          y={y}
                          fontSize="12"
                          fill="#374151"
                          textAnchor="end"
                          fontWeight="500"
                          dominantBaseline="middle"
                        >
                          {value}
                        </text>
                      </g>
                    );
                  })}

                  {/* Bars */}
                  {chartData.map((item, index) => {
                    const barX = startX + index * (barWidth + barGap);
                    const barHeight = item.count * countScale;
                    const centerX = barX + barWidth / 2;

                    return (
                      <g key={item.date}>
                        {/* Rating Count Bar (Blue) */}
                        <rect
                          x={barX}
                          y={bottomY}
                          width={barWidth}
                          height="0"
                          fill="#3b82f6"
                          rx="4"
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        >
                          <animate
                            attributeName="height"
                            from="0"
                            to={String(barHeight)}
                            dur="0.8s"
                            begin={`${index * 0.1}s`}
                            fill="freeze"
                          />
                          <animate
                            attributeName="y"
                            from={String(bottomY)}
                            to={String(bottomY - barHeight)}
                            dur="0.8s"
                            begin={`${index * 0.1}s`}
                            fill="freeze"
                          />
                        </rect>

                        {/* Value label on top of bar */}
                        {item.count > 0 && (
                          <text
                            x={centerX}
                            y={bottomY - barHeight - 5}
                            fontSize="11"
                            fill="#374151"
                            textAnchor="middle"
                            fontWeight="600"
                            className="opacity-0 hover:opacity-100 transition-opacity"
                          >
                            {item.count}
                          </text>
                        )}

                        {/* Period Label */}
                        <text
                          x={centerX}
                          y={bottomY + 25}
                          fontSize="12"
                          fill="#6b7280"
                          textAnchor="middle"
                          fontWeight="500"
                        >
                          {chartView === 'day' 
                            ? item.label.split('/').slice(0, 2).join('/')
                            : item.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Y-axis Label */}
                  <text
                    x="15"
                    y={chartAreaHeight / 2}
                    fontSize="13"
                    fill="#374151"
                    textAnchor="middle"
                    transform={`rotate(-90, 15, ${chartAreaHeight / 2})`}
                    fontWeight="600"
                  >
                    Tổng đánh giá
                  </text>
                </svg>
              );
            })()}
          </div>
        )}
      </motion.div>

      {/* Ratings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách đánh giá</h3>
          <p className="text-sm text-gray-500 mt-1">Tất cả đánh giá từ người dùng</p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700">Người dùng</TableHead>
                <TableHead className="font-semibold text-gray-700">Đánh giá</TableHead>
                <TableHead className="font-semibold text-gray-700">Bình luận</TableHead>
                <TableHead className="font-semibold text-gray-700">Ngày tạo</TableHead>
                <TableHead className="font-semibold text-gray-700">Ngày cập nhật</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                      <p className="text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : ratings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <Star className="w-12 h-12 text-gray-300" />
                      <p className="font-medium">Chưa có đánh giá nào</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                ratings.map((rating) => (
                  <TableRow key={rating.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {rating.userFullname || rating.userId}
                        </p>
                        <p className="text-xs text-gray-500">ID: {rating.userId.substring(0, 8)}...</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < rating.stars
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm font-semibold text-gray-700">
                          {rating.stars}/5
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {rating.comment ? (
                        <p className="text-sm text-gray-700 max-w-md truncate">{rating.comment}</p>
                      ) : (
                        <span className="text-xs text-gray-400">Không có bình luận</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-700">{formatDate(rating.createdDate)}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-700">{formatDate(rating.updatedDate)}</p>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
}

