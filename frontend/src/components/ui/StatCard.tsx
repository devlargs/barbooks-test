import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  loading?: boolean;
  error?: string | null;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  loading,
  error,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {loading ? (
          <p className="text-3xl font-bold text-gray-900">Loading...</p>
        ) : error ? (
          <p className="text-3xl font-bold text-red-600">Error</p>
        ) : (
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        )}
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <div className="text-2xl text-gray-400">{icon}</div>
    </div>
  </div>
);
