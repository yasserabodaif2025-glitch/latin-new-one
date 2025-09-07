'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet, Lock } from 'lucide-react'
import { axiosInstance } from '@/lib/axiosInstance'
import { toast } from 'sonner'

export default function SafeBalanceView() {
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClosing, setIsClosing] = useState(false)

  const fetchSafeBalance = async () => {
    try {
      setIsLoading(true)
      const res = await axiosInstance.get('FinancialOperations/my-safe-balance')
      setBalance(res.data?.balance || 0)
    } catch (error) {
      console.error('Error fetching safe balance:', error)
      toast.error('خطأ', {
        description: 'فشل في جلب رصيد الخزنة.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const closeSafe = async () => {
    try {
      setIsClosing(true)
      await axiosInstance.post('FinancialOperations/close-my-safe')
      
      toast.success('نجح', {
        description: 'تم إغلاق الخزنة بنجاح.',
      })
      
      // إعادة جلب الرصيد بعد الإغلاق
      await fetchSafeBalance()
    } catch (error) {
      console.error('Error closing safe:', error)
      toast.error('خطأ', {
        description: 'فشل في إغلاق الخزنة.',
      })
    } finally {
      setIsClosing(false)
    }
  }

  useEffect(() => {
    fetchSafeBalance()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            رصيد الخزنة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              {isLoading ? (
                <div className="text-gray-500">جاري تحميل الرصيد...</div>
              ) : (
                <div className="text-3xl font-bold text-green-600">
                  {balance?.toLocaleString('ar-SA')} ريال
                </div>
              )}
            </div>
            
            <div className="flex justify-center gap-4">
              <Button 
                onClick={fetchSafeBalance}
                variant="outline"
                disabled={isLoading}
              >
                تحديث الرصيد
              </Button>
              
              <Button 
                onClick={closeSafe}
                variant="destructive"
                disabled={isClosing || balance === 0}
                className="flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                إغلاق الخزنة
              </Button>
            </div>
            
            {balance === 0 && (
              <div className="text-center text-sm text-gray-500">
                لا يمكن إغلاق الخزنة عندما يكون الرصيد صفر
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
