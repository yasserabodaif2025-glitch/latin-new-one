'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { AppTable } from '@/components/table/app-table'

// بيانات تجريبية
const initialAbsences = [
  { id: 1, studentName: 'أحمد علي', date: '2025-08-20', reason: 'مرض', notes: '' },
  { id: 2, studentName: 'سارة محمد', date: '2025-08-21', reason: 'عذر عائلي', notes: '' },
]

export default function AbsenceTable() {
  const [search, setSearch] = useState('')
  const [absences, setAbsences] = useState(initialAbsences)

  const filtered = absences.filter(
    (a) => a.studentName.includes(search) || a.reason.includes(search) || a.date.includes(search)
  )

  return (
    <div>
      <Input
        placeholder="بحث باسم الطالب أو السبب أو التاريخ"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 max-w-xs"
      />
      <AppTable
        columns={[
          { accessorKey: 'studentName', header: 'اسم الطالب' },
          { accessorKey: 'date', header: 'التاريخ' },
          { accessorKey: 'reason', header: 'السبب' },
          { accessorKey: 'notes', header: 'ملاحظات' },
        ]}
        data={filtered}
        title="سجل الغيابات"
        showActions={false}
      />
    </div>
  )
}
