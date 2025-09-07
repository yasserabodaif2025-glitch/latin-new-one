'use client'

import React from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from '@/i18n/routing'
import { useParams } from 'next/navigation'
import { routes } from '@/lib/const/routes.enum'

interface DeleteModalProps {
  route: routes
  action: (id: number) => Promise<any>
}

export const DeleteModal = ({ route, action }: DeleteModalProps) => {
  const [open, setOpen] = React.useState(true)
  const t = useTranslations('deleteModal')
  const router = useRouter()
  const params = useParams()
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleClose = () => {
    router.back()
  }

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsDeleting(true)
      const response = await action(Number(params.id))

      if (response) {
        toast.success(t('deleteSuccess'))
        router.refresh()
        router.push(`/${route}`)
        setOpen(false)
      } else {
        toast.error(t('deleteFailed'))
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      toast.error(t('deleteFailed'))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteTitle')}</AlertDialogTitle>
          <AlertDialogDescription>{t('deleteMessage')}</AlertDialogDescription>
          <div className="mt-2 text-sm text-red-500">
            <span>{t('deleteWarning')}</span>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="px-8">{t('cancel')}</AlertDialogCancel>
          <Button
            type="button"
            onClick={handleConfirm}
            variant="destructive"
            disabled={isDeleting}
            className="px-8"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('deleting')}
              </>
            ) : (
              t('deleteConfirmation')
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
