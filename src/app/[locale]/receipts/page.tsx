import ReceiptFormEnhanced from './(components)/receipt-form-enhanced'
import { ReceiptTable } from './(components)/receipt-table'
import './(components)/receipt-print.css'
import { getReceipts } from './receipt.action'

export default async function ReceiptPage() {
  console.log('🏠 ReceiptPage component rendering...')
  
  const receipts = await getReceipts()
  console.log('📊 Receipts in page component:', receipts)

  return (
    <div className="flex grow flex-col gap-6">
      <ReceiptFormEnhanced />
      <ReceiptTable data={receipts?.data || []} />
    </div>
  )
}
