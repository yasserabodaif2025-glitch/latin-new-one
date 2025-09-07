import { z } from 'zod'

export const InventorySchema = z.object({
  name: z.string().min(1, 'اسم الصنف مطلوب'),
  category: z.string().min(1, 'الفئة مطلوبة'),
  quantity: z.number().min(0, 'الكمية يجب أن تكون أكبر من أو تساوي صفر'),
  unitPrice: z.number().min(0, 'سعر الوحدة يجب أن يكون أكبر من صفر'),
  location: z.string().min(1, 'الموقع مطلوب'),
  minStock: z.number().min(0, 'الحد الأدنى للمخزون يجب أن يكون أكبر من أو يساوي صفر')
})

export type InventorySchema = z.infer<typeof InventorySchema>