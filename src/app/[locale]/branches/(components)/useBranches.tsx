import { useEffect, useState } from 'react'
import { getBranches } from '../branch.action'
import { IBranch } from './branch.interface'

export const useBranches = () => {
  const [branches, setBranches] = useState<IBranch[]>([])
  useEffect(() => {
    const fetchBranches = async () => {
      const branches = await getBranches()
      setBranches(branches.data)
    }
    fetchBranches()
    return () => {
      setBranches([])
    }
  }, [])
  return branches
}
