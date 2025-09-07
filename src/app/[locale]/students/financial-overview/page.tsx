import { Metadata } from 'next'
import StudentsFinancialOverview from '@/components/students/StudentsFinancialOverview'

export const metadata: Metadata = {
  title: 'التفاصيل المالية للطلاب - أكاديمية اللاتين',
  description: 'عرض شامل للتفاصيل المالية لجميع الطلاب'
}

export default function StudentsFinancialOverviewPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">التفاصيل المالية للطلاب</h1>
        <p className="text-gray-600 mt-2">
          عرض شامل للأرصدة والمديونيات المالية لجميع الطلاب في النظام
        </p>
      </div>
      
      <StudentsFinancialOverview />
    </div>
  )
}
