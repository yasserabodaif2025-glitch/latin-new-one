import { formMode } from '@/lib/const/form-mode.enum'
import { CategoryForm } from '../../(components)'
import { getCategory } from '../../category.action'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const category = await getCategory(id)

  return <CategoryForm data={category} mode={formMode.edit} />
}
