'use client'

import { Button } from './ui/button'
import { useState } from 'react'
import * as XLSX from 'xlsx'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { cn } from '@/lib/utils'
import { useCourses } from '@/app/[locale]/courses/(components)/useCourses'
import { useTranslations } from 'next-intl'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { CampaignSchema } from '@/lib/schema'

export interface ExcelData {
  name: string
  email: string
  phone: string
  course: string
}

export function ExcelUpload() {
  const { control } = useFormContext<CampaignSchema>()
  // const { fields, append } = useFieldArray({ control,  name: 'leads' })
  const t = useTranslations('campaign')
  const [course, setCourse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [leads, setLeads] = useState<ExcelData[]>([])
  const courses = useCourses()
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true)
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData: ExcelData[] = XLSX.utils.sheet_to_json(firstSheet)
          const dubloicatedData = []

          // Validate data
          const validatedData = jsonData
            .filter((row, index, array) => {
              const rest = [...array].splice(index + 1)
              const duplicate = rest.find((r) => r?.email === row?.email || r?.phone === row?.phone)
              if (duplicate) {
                dubloicatedData.push(duplicate)
                return false
              }
              return row.name && row?.email && row.phone && row.course
            })
            .map((row) => ({
              name: row.name,
              email: row?.email,
              phone: row.phone + '',
              course,
            }))

          if (dubloicatedData.length > 0) {
            toast.error(t('duplicateDataFound', { count: dubloicatedData.length }))
          }

          if (validatedData.length === 0) {
            toast.error(t('noValidData'))
            return
          }
          setLeads(validatedData)
          // append([
          //   ...fields,
          //   ...validatedData.map((lead) => ({
          //     name: lead.name,
          //     phone: lead.phone,
          //     courseId: +lead.course,
          //     email: lead.email,
          //   })),
          // ])
          setCourse('')
          toast.success(t('successProcessed', { count: validatedData.length }))
        } catch (error) {
          console.error('Error processing file:', error)
          toast.error(t('errorProcessing'))
        }
      }

      reader.readAsArrayBuffer(file)
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error(t('errorUploading'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex grow items-center gap-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
          id="excel-upload"
          disabled={isLoading || course === ''}
        />
        <div className="grid w-full grid-cols-2 gap-3">
          <label
            htmlFor="excel-upload"
            className={cn(
              'w-full',
              isLoading || course === '' ? 'cursor-not-allowed' : 'cursor-pointer'
            )}
          >
            <Button
              className="w-full"
              variant="outline"
              size={'sm'}
              disabled={isLoading || course === ''}
              asChild
            >
              <span>
                {isLoading
                  ? t('creating')
                  : course === ''
                    ? t('selectCourseFirst')
                    : t('importFacebookData')}
              </span>
            </Button>
          </label>

          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('selectCourse')} />
            </SelectTrigger>
            <SelectContent>
              {courses?.map((course) => (
                <SelectItem key={course.id} value={course.id + ''}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {leads.length > 0 ? (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="flex-shrink-0 text-center text-xl">{t('leadsPreview')}</h3>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y rounded-xl border">
              <thead className="">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    {t('tableHeaders.name')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    {t('tableHeaders.email')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    {t('tableHeaders.phone')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    {t('tableHeaders.course')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map((lead, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">{lead.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">{lead.email}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">{lead.phone}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">{lead.course}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-center text-sm">{t('uploadExcelPreview')}</p>
      )}
    </>
  )
}
