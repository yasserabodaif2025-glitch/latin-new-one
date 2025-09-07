import React from 'react'

const Reports = () => {
  const reports = [
    {
      id: 1,
      title: 'Monthly Attendance Report',
      date: '2024-05-01',
      status: 'Completed',
      type: 'Attendance',
      summary: '85% average attendance rate',
    },
    {
      id: 2,
      title: 'Academic Performance Q2',
      date: '2024-04-15',
      status: 'Pending',
      type: 'Academic',
      summary: 'Quarterly performance analysis',
    },
    {
      id: 3,
      title: 'Financial Statement',
      date: '2024-04-01',
      status: 'Completed',
      type: 'Financial',
      summary: 'Monthly financial overview',
    },
    {
      id: 4,
      title: 'Teacher Evaluation Results',
      date: '2024-03-30',
      status: 'In Progress',
      type: 'Evaluation',
      summary: 'Staff performance review',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Reports</h2>
      <div className="grid gap-6">
        {reports.map((report) => (
          <div key={report.id} className="rounded-lg bg-white p-6 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">{report.title}</h3>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(report.status)}`}
              >
                {report.status}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-700">{report.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium text-gray-700">{report.type}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-600">{report.summary}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Reports
