'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Package, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { createInventoryItem } from '../inventory.action'

const inventorySchema = z.object({
  name: z.string().min(1, 'اسم الصنف مطلوب'),
  category: z.string().min(1, 'الفئة مطلوبة'),
  quantity: z.number().min(0, 'الكمية يجب أن تكون أكبر من أو تساوي صفر'),
  unitPrice: z.number().min(0, 'سعر الوحدة يجب أن يكون أكبر من صفر'),
  location: z.string().min(1, 'الموقع مطلوب'),
  minStock: z.number().min(0, 'الحد الأدنى للمخزون يجب أن يكون أكبر من أو يساوي صفر')
})

type InventoryFormData = z.infer<typeof inventorySchema>

const categories = [
  'أدوات مكتبية',
  'أجهزة كمبيوتر',
  'أثاث',
  'مواد تعليمية',
  'مستلزمات نظافة',
  'أخرى'
]

const formatEGP = (amount: number) => {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 2
  }).format(amount)
}

export default function InventoryForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: '',
      category: '',
      quantity: 0,
      unitPrice: 0,
      location: '',
      minStock: 0
    }
  })

  const quantity = form.watch('quantity')
  const unitPrice = form.watch('unitPrice')
  const totalValue = quantity * unitPrice

  const onSubmit = async (data: InventoryFormData) => {
    try {
      setIsLoading(true)
      await createInventoryItem(data)
      toast.success('تم إضافة الصنف بنجاح')
      form.reset()
    } catch (error) {
      toast.error('فشل في إضافة الصنف')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4" />
          إضافة صنف جديد للجرد
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">اسم الصنف</Label>
            <Input
              {...form.register('name')}
              className="h-8 text-xs"
              placeholder="أدخل اسم الصنف"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">الفئة</Label>
            <Select onValueChange={(value) => form.setValue('category', value)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">الكمية</Label>
            <Input
              type="number"
              {...form.register('quantity', { valueAsNumber: true })}
              className="h-8 text-xs"
              min="0"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">سعر الوحدة</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register('unitPrice', { valueAsNumber: true })}
              className="h-8 text-xs"
              min="0"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">الموقع</Label>
            <Input
              {...form.register('location')}
              className="h-8 text-xs"
              placeholder="مخزن، مكتب، قاعة..."
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">الحد الأدنى</Label>
            <Input
              type="number"
              {...form.register('minStock', { valueAsNumber: true })}
              className="h-8 text-xs"
              min="0"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">القيمة الإجمالية</Label>
            <div className="h-8 px-3 py-1 bg-gray-50 border rounded text-xs flex items-center">
              {formatEGP(totalValue)}
            </div>
          </div>

          <div className="flex items-end">
            <Button type="submit" disabled={isLoading} className="h-8 text-xs w-full">
              <Plus className="h-3 w-3 mr-1" />
              إضافة
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}