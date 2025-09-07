import { formMode } from '@/lib/const/form-mode.enum'
import { LecturerForm } from '../(components)/lecturer-form'

export default function AddLecturerPage() {
  return <LecturerForm mode={formMode.create} />
}
