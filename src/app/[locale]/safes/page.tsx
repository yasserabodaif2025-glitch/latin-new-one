import { getSafes } from './safe.action'
import SafeTable from './(components)/safe-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function SafesPage() {
  const safes = await getSafes()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">إدارة الخزنات</h1>
        <Link href="/safes/new">
          <Button>إنشاء خزنة جديدة</Button>
        </Link>
      </div>
      <SafeTable safes={safes} />
    </div>
  )
}
