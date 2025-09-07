import { useEffect, useState } from 'react'
import { getLabs } from '../lab.action'
import { ILab } from './lab.interface'

export const useLabs = (branchId?: number) => {
  const [labs, setLabs] = useState<ILab[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchLabs = async () => {
      setIsLoading(true)
      const labs = await getLabs()
      let filteredLabs = labs.data
      
      // تصفية القاعات حسب الفرع المحدد
      if (branchId && branchId > 0) {
        filteredLabs = labs.data.filter((lab: ILab) => lab.branchId === branchId)
        console.log('🏢 Labs filtered by branch:', {
          branchId,
          totalLabs: labs.data.length,
          filteredLabs: filteredLabs.length,
          labs: filteredLabs.map(l => ({ id: l.id, name: l.name, branchId: l.branchId }))
        })
      }
      
      setLabs(filteredLabs)
      setIsLoading(false)
    }
    fetchLabs()
    return () => {
      setLabs([])
    }
  }, [branchId])
  
  return { labs, isLoading }
}
