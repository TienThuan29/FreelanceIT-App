'use client';
import React, { useEffect } from 'react';
import useProjectManagement from '@/hooks/useProjectManagement';

export default function AdminProjectsPage() {
  const { projects, isLoading, error, refreshProjects } = useProjectManagement();

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Quản lý Project</h1>
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2">Tiêu đề</th>
              <th className="text-left px-4 py-2">Loại</th>
              <th className="text-left px-4 py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td className="px-4 py-3" colSpan={3}>Đang tải...</td></tr>
            ) : projects.length === 0 ? (
              <tr><td className="px-4 py-3" colSpan={3}>Không có dữ liệu</td></tr>
            ) : (
              projects.map(pr => (
                <tr key={pr.id} className="border-t">
                  <td className="px-4 py-3">{pr.title}</td>
                  <td className="px-4 py-3">{typeof pr.projectType === 'object' ? pr.projectType?.name : pr.projectType}</td>
                  <td className="px-4 py-3">{pr.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


