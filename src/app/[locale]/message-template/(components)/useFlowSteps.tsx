import { useEffect, useState } from 'react'
import { IFlowStep } from './flow-step.interface'
import { getFlowSteps } from '../message-template.action'

export const useFlowSteps = () => {
  const [flowSteps, setFlowSteps] = useState<IFlowStep[]>([])
  useEffect(() => {
    const fetchFlowSteps = async () => {
      const flowSteps = await getFlowSteps()
      setFlowSteps(flowSteps)
    }
    fetchFlowSteps()
    return () => {
      setFlowSteps([])
    }
  }, [])
  return flowSteps
}
