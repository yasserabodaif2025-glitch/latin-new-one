import AbsenceTable from './(components)/absence-table'
import AbsenceForm from './(components)/absence-form'

export default function AbsencesPage() {
  return (
    <div className="space-y-6 p-4">
      <h1 className="mb-4 text-2xl font-bold">غيابات الطلاب</h1>
      <AbsenceForm />
      <AbsenceTable />
    </div>
  )
}
