'use client'

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { AppTable } from '@/components/table/app-table'
import { INewReceipt } from './new-receipt.interface'
import { useEffect, useState } from 'react'
import { getNewReceipts } from '../new-receipt.action'
import { routes } from '@/lib/const/routes.enum'

interface NewReceiptTableProps {
  initialReceipts?: INewReceipt[]
}

export function NewReceiptTable({ initialReceipts = [] }: NewReceiptTableProps) {
  const [receipts, setReceipts] = useState<INewReceipt[]>(initialReceipts)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchReceipts = async () => {
      setIsLoading(true)
      try {
        // جلب البيانات المالية لجميع الطلاب المسجلين
        // نظراً لعدم وجود endpoint لجلب جميع الإيصالات، سنعرض رسالة توضيحية
        const response = await getNewReceipts()
        setReceipts(response?.data || [])
      } catch (error) {
        console.error('Error fetching receipts:', error)
        setReceipts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchReceipts()
  }, [])

  const columns: ColumnDef<INewReceipt>[] = [
    {
      accessorKey: 'receiptNumber',
      header: 'رقم الإيصال',
    },
    {
      accessorKey: 'studentName',
      header: 'اسم الطالب',
    },
    {
      accessorKey: 'amount',
      header: 'المبلغ',
      cell: ({ row }) => `${row.original.amount} ريال`,
    },
    {
      accessorKey: 'receiptType',
      header: 'نوع الإيصال',
      cell: ({ row }) => row.original.receiptType === 'student_payment' ? 'دفع طالب' : 'رسوم خدمة',
    },
    {
      accessorKey: 'createdAt',
      header: 'تاريخ الإنشاء',
      cell: ({ row }) => row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString('ar-SA') : 'غير محدد',
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">الإيصالات</h2>
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-500">جاري تحميل الإيصالات...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">الإيصالات ({receipts.length})</h2>
      {receipts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          لا توجد إيصالات متاحة
        </div>
      ) : (
        <AppTable 
          title="الإيصالات الجديدة"
          data={receipts}
          columns={columns}
          mainRoute={routes.newReceipts}
          hideHeaders
        />
      )}
    </div>
  )
}
