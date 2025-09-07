import { QualificationIssuerTable } from './(components)/qualification-issuer-table'
import { getQualificationIssuers } from './qualification-issuer.action'

export default async function QualificationIssuerPage() {
  const qualificationIssuers = await getQualificationIssuers()
  return <QualificationIssuerTable data={qualificationIssuers.data} />
}
