import ExpenseForm from './(components)/expense-form'
import { ExpenseTable } from './(components)/expense-table'

export default async function ExpensePage() {
  return (
    <div className="flex grow flex-col gap-4">
      <ExpenseForm />
      <ExpenseTable data={[]} />
    </div>
  )
}
