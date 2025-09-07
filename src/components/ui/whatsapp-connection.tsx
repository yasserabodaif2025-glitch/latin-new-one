import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface WhatsAppConnectionProps {
  onConnectionStatusChange?: (isConnected: boolean) => void
}

export function WhatsAppConnection({ onConnectionStatusChange }: WhatsAppConnectionProps) {
  const [isReady, setIsReady] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/whatsapp')
      const data = await response.json()

      if (response.ok) {
        setIsReady(data.isReady)
        setQrCode(data.qrCode)
        onConnectionStatusChange?.(data.isReady)
      } else {
        setError(data.error || 'Failed to check WhatsApp connection')
      }
    } catch (err) {
      console.error('Failed to check WhatsApp connection:', err)
      setError('Failed to check WhatsApp connection')
    }
  }

  useEffect(() => {
    checkConnectionStatus()
    // Poll for status every 10 seconds if not connected
    const interval = setInterval(() => {
      if (!isReady) {
        checkConnectionStatus()
      }
    }, 10000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady])

  const handleConnect = () => {
    setShowQR(true)
    checkConnectionStatus()
  }

  return (
    <>
      {!isReady && (
        <Button onClick={handleConnect} variant="outline">
          Connect WhatsApp
        </Button>
      )}

      {isReady && (
        <div className="text-sm text-green-600 dark:text-green-400">WhatsApp Connected</div>
      )}

      <Dialog open={showQR && !!qrCode} onOpenChange={(open) => setShowQR(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code with WhatsApp</DialogTitle>
          </DialogHeader>
          {qrCode && (
            <div className="flex justify-center p-4">
              <Image
                src={`data:image/svg+xml;base64,${btoa(qrCode)}`}
                alt="WhatsApp QR Code"
                width={256}
                height={256}
              />
            </div>
          )}
          <p className="text-center text-sm text-muted-foreground">
            Open WhatsApp on your phone and scan the QR code to connect
          </p>
        </DialogContent>
      </Dialog>

      {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}
    </>
  )
}
