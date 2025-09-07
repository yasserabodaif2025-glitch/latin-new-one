import { LectureTable } from './(components)'
import { getLectures } from './lecture.action'
import { notFound } from 'next/navigation'
import { AxiosError } from 'axios'
import { Suspense } from 'react'

function LoadingLectures() {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      <p className="mt-4 text-lg text-muted-foreground">جاري تحميل المحاضرات...</p>
    </div>
  )
}

function ErrorDisplay({ error }: { error: Error | AxiosError }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="mr-3">
          <h3 className="text-sm font-medium text-red-800">خطأ في تحميل المحاضرات</h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-inside list-disc space-y-1">
              {error instanceof AxiosError ? (
                <>
                  <li>نوع الخطأ: {error.code}</li>
                  <li>حالة الاستجابة: {error.response?.status}</li>
                  <li>رسالة الخطأ: {error.response?.data?.message || error.message}</li>
                  <li>عنوان URL: {error.config?.url}</li>
                </>
              ) : (
                <li>رسالة الخطأ: {error.message}</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function LecturesPage() {
  try {
    return (
      <Suspense fallback={<LoadingLectures />}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">المحاضرات</h1>
          </div>
          <LectureTable data={(await getLectures())?.data || []} />
        </div>
      </Suspense>
    )
  } catch (error: unknown) {
    console.error('Error in LecturesPage:', error)

    // Check if it's an Axios error
    if (error instanceof AxiosError) {
      // If it's a 404, show the not found page
      if (error.response?.status === 404) {
        notFound() 
      }

      // For other errors, show the error display
      return (
        <div className="container mx-auto p-4">
          <ErrorDisplay error={error} />
          <div className="mt-4 flex justify-center">
            <button
              className="rounded bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
              onClick={() => window.location.reload()}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )
    }

    // For non-Axios errors, show the error display
    return (
      <div className="container mx-auto p-4">
        <ErrorDisplay error={error as Error} />
        <div className="mt-4 flex justify-center">
          <button
            className="rounded bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
            onClick={() => window.location.reload()}
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    )
  }
}

// {
//   /* <LectureTable data={lectures.data} /> */
// }
