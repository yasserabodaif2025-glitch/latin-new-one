import React from 'react'
import { routes } from '@/lib/const/routes.enum'
import { DeleteModal } from '@/components/table/delete-modal'
import { deleteCategory } from '../../../category.action'

export default function DeleteCategoryPage() {
  return <DeleteModal route={routes.categories} action={deleteCategory} />
}
