import { BranchTable } from './(components)'
import { getBranches } from './branch.action'
import { getLocale } from 'next-intl/server'
import { redirect } from 'next/navigation'

export default async function BranchesPage() {
  try {
    const branches = await getBranches()
    return <BranchTable data={branches.data} />
  } catch (error: any) {
    const locale = await getLocale()
    // If unauthorized, redirect to login
    if (error?.response?.status === 401) {
      redirect(`/${locale}/auth/login`)
    }
    throw error
  }
}
