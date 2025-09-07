'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Package, Search, Edit, Trash2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { getInventoryItems, deleteInventoryItem, type InventoryItem } from '../inventory.action'

const formatEGP = (amount: number) => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(dateString))
}

const getStatusBadge = (item: InventoryItem) => {
  if (item.quantity === 0) {
    return <Badge variant="destructive" className="text-xs">نفد المخزون</Badge>
  } else if (item.quantity <= item.minStock) {
    return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">مخزون منخفض</Badge>
  } else {
    return <Badge variant="default" className="text-xs bg-green-100 text-green-800">متوفر</Badge>
  }
}

export default function InventoryTable() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadItems()
  }, [])

  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredItems(filtered)
  }, [items, searchTerm])

  const loadItems = async () => {
    try {
      setIsLoading(true)
      const result = await getInventoryItems()
      setItems(result.data)
    } catch (error) {
      toast.error('فشل في جلب بيانات الجرد')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الصنف؟')) return
    
    try {
      await deleteInventoryItem(id)
      toast.success('تم حذف الصنف بنجاح')
      loadItems()
    } catch (error) {
      toast.error('فشل في حذف الصنف')
    }
  }

  const totalValue = filteredItems.reduce((sum, item) => sum + item.totalValue, 0)
  const lowStockItems = filteredItems.filter(item => item.quantity <= item.minStock && item.quantity > 0)
  const outOfStockItems = filteredItems.filter(item => item.quantity === 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4" />
            جرد المخزون
          </CardTitle>
          <div className="flex gap-2 text-xs">
            <Badge variant="outline">
              إجمالي القيمة: {formatEGP(totalValue)}
            </Badge>
            {lowStockItems.length > 0 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {lowStockItems.length} صنف منخفض
              </Badge>
            )}
            {outOfStockItems.length > 0 && (
              <Badge variant="destructive">
                {outOfStockItems.length} صنف نفد
              </Badge>
            )}
          </div>
        </div>
        
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
          <Input
            placeholder="البحث في الجرد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-sm text-gray-500">جاري التحميل...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="text-xs">اسم الصنف</TableHead>
                  <TableHead className="text-xs">الفئة</TableHead>
                  <TableHead className="text-xs">الكمية</TableHead>
                  <TableHead className="text-xs">سعر الوحدة</TableHead>
                  <TableHead className="text-xs">القيمة الإجمالية</TableHead>
                  <TableHead className="text-xs">الموقع</TableHead>
                  <TableHead className="text-xs">الحالة</TableHead>
                  <TableHead className="text-xs">آخر تحديث</TableHead>
                  <TableHead className="text-xs">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="text-xs">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {item.quantity}
                        {item.quantity <= item.minStock && item.quantity > 0 && (
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatEGP(item.unitPrice)}</TableCell>
                    <TableCell className="font-medium">{formatEGP(item.totalValue)}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{getStatusBadge(item)}</TableCell>
                    <TableCell>{formatDate(item.lastUpdated)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-6 w-6 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredItems.length === 0 && !isLoading && (
              <div className="text-center py-8 text-sm text-gray-500">
                لا توجد عناصر في الجرد
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}