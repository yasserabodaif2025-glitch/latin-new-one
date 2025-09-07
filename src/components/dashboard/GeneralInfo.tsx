import React from 'react'

const GeneralInfo = () => {
  const generalInfo = {
    totalStudents: 250,
    activeClasses: 15,
    teachersCount: 20,
    upcomingEvents: [
      { id: 1, name: 'Summer Festival', date: '2024-07-15' },
      { id: 2, name: 'Parents Meeting', date: '2024-06-20' },
      { id: 3, name: 'Dance Competition', date: '2024-06-25' },
    ],
  }

  return (
    <div className="p-6">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">General Information</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-2 text-lg font-semibold text-gray-700">Total Students</h3>
          <p className="text-3xl font-bold text-blue-600">{generalInfo.totalStudents}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-2 text-lg font-semibold text-gray-700">Active Classes</h3>
          <p className="text-3xl font-bold text-green-600">{generalInfo.activeClasses}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-2 text-lg font-semibold text-gray-700">Teachers</h3>
          <p className="text-3xl font-bold text-purple-600">{generalInfo.teachersCount}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-800">Upcoming Events</h3>
        <div className="rounded-lg bg-white p-4 shadow-md">
          {generalInfo.upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="mb-4 flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <span className="font-medium text-gray-700">{event.name}</span>
              <span className="text-sm text-gray-500">{event.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GeneralInfo
