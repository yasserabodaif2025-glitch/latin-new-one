import React from 'react'

const Statistics = () => {
  const statistics = {
    performance: {
      averageGrade: 85,
      passingRate: 92,
      topPerformers: 45,
      improvementRate: 15,
    },
    enrollment: {
      currentMonth: 250,
      lastMonth: 220,
      growth: 13.6,
      trend: 'increasing',
    },
    classDistribution: [
      { level: 'Beginner', count: 120, percentage: 48 },
      { level: 'Intermediate', count: 85, percentage: 34 },
      { level: 'Advanced', count: 45, percentage: 18 },
    ],
    monthlyProgress: [
      { month: 'Jan', value: 75 },
      { month: 'Feb', value: 82 },
      { month: 'Mar', value: 80 },
      { month: 'Apr', value: 85 },
      { month: 'May', value: 88 },
    ],
  }

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Statistics</h2>

      {/* Performance Metrics */}
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Performance Metrics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-md">
            <p className="text-sm text-gray-500">Average Grade</p>
            <p className="text-2xl font-bold text-blue-600">
              {statistics.performance.averageGrade}%
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-md">
            <p className="text-sm text-gray-500">Passing Rate</p>
            <p className="text-2xl font-bold text-green-600">
              {statistics.performance.passingRate}%
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-md">
            <p className="text-sm text-gray-500">Top Performers</p>
            <p className="text-2xl font-bold text-purple-600">
              {statistics.performance.topPerformers}
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-md">
            <p className="text-sm text-gray-500">Improvement Rate</p>
            <p className="text-2xl font-bold text-orange-600">
              +{statistics.performance.improvementRate}%
            </p>
          </div>
        </div>
      </div>

      {/* Enrollment Statistics */}
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Enrollment Statistics</h3>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current Month</p>
              <p className="text-2xl font-bold text-gray-800">
                {statistics.enrollment.currentMonth}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Growth</p>
              <p className="text-lg font-semibold text-green-600">
                +{statistics.enrollment.growth}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Class Distribution */}
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Class Distribution</h3>
        <div className="rounded-lg bg-white p-6 shadow-md">
          {statistics.classDistribution.map((level) => (
            <div key={level.level} className="mb-4 last:mb-0">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium text-gray-700">{level.level}</span>
                <span className="text-sm text-gray-500">{level.count} students</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${level.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Progress */}
      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Monthly Progress</h3>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <div className="flex h-40 items-end justify-between">
            {statistics.monthlyProgress.map((item) => (
              <div key={item.month} className="flex flex-col items-center">
                <div className="w-12 bg-blue-500" style={{ height: `${item.value}%` }}></div>
                <p className="mt-2 text-sm text-gray-600">{item.month}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
