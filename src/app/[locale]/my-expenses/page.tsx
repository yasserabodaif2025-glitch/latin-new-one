import MyExpenseForm from './(components)/my-expense-form'

export default async function MyExpensesPage() {
  return (
    <div className="flex grow flex-col gap-4">
      <MyExpenseForm />
    </div>
  )
}
