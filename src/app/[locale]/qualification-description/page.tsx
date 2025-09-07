import { QualificationDescriptionTable } from './(components)/qualification-description-table'
import { getQualificationDescriptions } from './qualification-description.action'

export default async function QualificationDescriptionPage() {
  const qualificationDescriptions = await getQualificationDescriptions()
  return <QualificationDescriptionTable data={qualificationDescriptions.data} />
}
