'use client'

import { fetcher } from '@/lib/swr-fetchers'
import QRCode from 'react-qr-code'
import useSWR from 'swr'

// import { Card } from './ui/card'

export function WhatsAppStatus() {
  const { data: status, isLoading } = useSWR<{
    isReady: boolean
    qrCode: string | null
  }>('/api/whatsapp', fetcher, {
    refreshInterval(latestData) {
      if (!latestData?.isReady) {
        return 5000
      }
      return 0
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!status?.qrCode && !status?.isReady) {
    return null
  }

  return (
    <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">
        WhatsApp Status: {status.isReady ? 'Connected' : 'Waiting for QR Scan'}
      </h3>
      {status.qrCode && !status.isReady && (
        <div>
          <p className="mb-2">Scan this QR code with WhatsApp to connect:</p>
          <QRCode value={status.qrCode} />
          {/* <pre className="whitespace-pre">{status.qrCode}</pre> */}
        </div>
      )}
    </div>
  )
}
