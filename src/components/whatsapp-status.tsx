'use client'
import { getQrCode } from '@/app/[locale]/messages/messages.action'
import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'

export const WhatsappStatus = () => {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  useEffect(() => {
    getQrCode().then((qr) => {
      if (qr?.qr) {
        setQrCode(qr.qr as string)
      }
      if (qr.status === 'connected') {
        setIsConnected(true)
      }
    })
  }, [])
  return (
    <div>
      {qrCode && (
        <div className="my-4 flex flex-col items-center justify-center rounded-xl border p-4 shadow-lg">
          <h4 className="mb-4 text-lg font-semibold">Scan QR Code to connect WhatsApp</h4>
          <QRCode value={qrCode} size={256} />
        </div>
      )}

      {isConnected && (
        <div className="my-4 rounded-lg bg-green-100 p-2 text-center text-green-700">
          WhatsApp is connected and ready to send messages
        </div>
      )}
    </div>
  )
}
