import ReceiptFormEnhanced from './(components)/receipt-form-enhanced'
import { ReceiptTable } from './(components)/receipt-table'
import './(components)/receipt-print.css'

export default async function ReceiptPage() {
  return (
    <div className="flex grow flex-col gap-6">
      <ReceiptFormEnhanced />
      <ReceiptTable data={[]} />
    </div>
  )
}
