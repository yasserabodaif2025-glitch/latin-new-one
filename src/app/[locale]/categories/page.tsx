'use client'

import { CategoryTable } from './(components)'
import { useCategories } from './(components)/useCategory'

export default function CategoriesPage() {
  const { categories, isLoading, error } = useCategories()
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">جاري التحميل...</div>
  }
  
  if (error) {
    return <div className="flex items-center justify-center p-8 text-red-500">خطأ في تحميل البيانات</div>
  }
  
  return <CategoryTable data={categories} />
}
