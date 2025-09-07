import { BranchForm } from '../(components)'
import { formMode } from '@/lib/const/form-mode.enum'
import { getBranch } from '../branch.action'

export default async function ViewBranchPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params
  const branch = await getBranch(id)

  return <BranchForm data={branch} mode={formMode.view} />
}
