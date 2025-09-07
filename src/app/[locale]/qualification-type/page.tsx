import { QualificationTypeTable } from './(components)/qualification-type-table'
import { getQualificationTypes } from './qualification-type.action'

export default async function QualificationTypePage() {
  const qualificationTypes = await getQualificationTypes()
  return <QualificationTypeTable data={qualificationTypes.data} />
}
