import InventoryForm from './(components)/inventory-form'
import InventoryTable from './(components)/inventory-table'

export default function InventoryPage() {
  return (
    <div className="flex grow flex-col gap-4">
      <InventoryForm />
      <InventoryTable />
    </div>
  )
}