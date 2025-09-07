import dynamic from 'next/dynamic'

// UI Components
export const DynamicDatePicker = dynamic(
  () => import('@/components/ui/date-picker').then((mod) => mod.DatePicker),
  { ssr: false, loading: () => <div className="h-10 w-full animate-pulse rounded-md bg-muted" /> }
)

export const DynamicDialog = dynamic(
  () => import('@/components/ui/dialog').then((mod) => mod.Dialog),
  { ssr: false }
)

export const DynamicAccordion = dynamic(
  () => import('@/components/ui/accordion').then((mod) => mod.Accordion),
  { ssr: false }
)

// Data Display Components
export const DynamicDataTable = dynamic(
  () => import('@/components/table/app-table').then((mod) => mod.AppTable),
  {
    loading: () => <div className="h-96 w-full animate-pulse rounded-lg bg-muted" />,
    ssr: true,
  }
)

// Form Components
export const DynamicSelect = dynamic(
  () => import('@/components/ui/compobox').then((mod) => mod.Combobox),
  { ssr: true }
)

// Layout Components
export const DynamicSideMenu = dynamic(
  () =>
    import('@/components/layout/sidemenu/side-menu').then((mod) => ({
      default: mod.SideMenu,
    })),
  { ssr: true }
)
