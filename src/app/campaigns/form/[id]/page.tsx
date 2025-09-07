import { GenratedForm } from './genrated-form'

export default async function CampaignFormPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string; id: string }>
}>) {
  const { id } = await params
  return (
    <div className="flex flex-col gap-4 p-4" style={{ direction: 'rtl' }}>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold"> إستمارة تواصل</h2>
        <p className="text-sm text-gray-500">برجاء ادخال البيانات المطلوبة للتواصل معك</p>
      </div>
      <GenratedForm referenceId={id} />
    </div>
  )
}
