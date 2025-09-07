import { CategoryForm } from '../(components)'
import { formMode } from '@/lib/const/form-mode.enum'
import { getCategory } from '../category.action'

export default async function ViewCategoryPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const category = await getCategory(id)

  return <CategoryForm data={category} mode={formMode.view} />
}
