import NewReceiptForm from './(components)/new-receipt-form'
import { NewReceiptTable } from './(components)/new-receipt-table'
import { getNewReceipts } from './new-receipt.action'

export default async function NewReceiptsPage() {
  const receiptsData = await getNewReceipts()
  const receipts = receiptsData?.data || []

  return (
    <div className="flex grow flex-col gap-4">
      <NewReceiptForm />
      <NewReceiptTable initialReceipts={receipts} />
    </div>
  )
}
