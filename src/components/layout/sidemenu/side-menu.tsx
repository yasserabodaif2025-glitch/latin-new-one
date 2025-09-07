'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import {
  Home,
  BookOpen,
  Megaphone,
  MessageSquare,
  Users,
  BookTemplate,
  FolderTree,
  FlaskRound,
  GraduationCap,
  Users2,
  Presentation,
  GraduationCapIcon,
  Building2,
  MapPin,
  Building,
  FileText,
  LucideGraduationCap,
  School,
  Award,
  UserRound,
  Receipt,
  CreditCard,
  ShieldCheck,
  Calendar,
  Package,
  AlertTriangle,
  BarChart3,
} from 'lucide-react'
import { Link, usePathname } from '@/i18n/routing'
import { routes } from '@/lib/const/routes.enum'
import { useWindowSize } from '@/lib/useWindowSize'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface SideMenuProps {
  showOnlyIcons?: boolean
}

export const SideMenu = ({ showOnlyIcons = false }: SideMenuProps) => {
  const t = useTranslations('nav')
  const tg = useTranslations('navGroups')
  const { width } = useWindowSize()

  // Permissions helpers (read from cookie 'permissions' as JSON array of strings)
  const [permissions, setPermissions] = React.useState<string[]>([])
  const [isSuper, setIsSuper] = React.useState<boolean>(false)
  React.useEffect(() => {
    try {
      const cookies = document.cookie.split('; ').reduce<Record<string, string>>((acc, cur) => {
        const [k, ...rest] = cur.split('=')
        acc[k] = rest.join('=')
        return acc
      }, {})

      // Permissions cookie (URL-encoded JSON array)
      const raw = cookies['permissions']
      if (raw) {
        const parsed = JSON.parse(decodeURIComponent(raw))
        if (Array.isArray(parsed)) setPermissions(parsed as string[])
      }

      // Roles cookie (URL-encoded JSON array)
      const rolesRaw = cookies['roles']
      if (rolesRaw) {
        const roles = JSON.parse(decodeURIComponent(rolesRaw)) as string[]
        if (Array.isArray(roles)) {
          const hasAdmin = roles.some((r) => String(r).toLowerCase().includes('admin'))
          if (hasAdmin) setIsSuper(true)
        }
      }
    } catch {}
  }, [])

  const hasPermission = React.useCallback(
    (resource: string, action: 'read' | 'create' | 'update' | 'delete') => {
      if (isSuper) return true
      // Allow wildcards like resource:* or *:read or *:*
      return (
        permissions.includes(`${resource}:${action}`) ||
        permissions.includes(`${resource}:*`) ||
        permissions.includes(`*:${action}`) ||
        permissions.includes(`*:*`)
      )
    },
    [permissions, isSuper]
  )

  const getResourceFromHref = (href: string) => {
    if (!href || href === '/') return 'home'
    const parts = href.split('/').filter(Boolean)
    const seg = parts[0] === 'admin' ? parts[1] : parts[0]
    return seg || 'home'
  }

  const canReadItem = (href: string) => {
    // TEMPORARY: Show all menu items regardless of permissions
    return true
    
    // Original permission logic (commented out temporarily)
    // // Always show home
    // if (!href || href === '/') return true
    // const resource = getResourceFromHref(href)
    // // If no resource derived, allow
    // if (!resource) return true
    // return hasPermission(resource, 'read')
  }

  const topItems = [{ href: '/', label: t('home'), icon: Home }]

  const groups: {
    key: string
    label: string
    items: { href: string; label: string; icon: React.ElementType }[]
  }[] = [
    {
      key: 'academy',
      label: tg('academy'),
      items: [
        { href: `/${routes.cities}`, label: t('cities'), icon: Building2 },
        { href: `/${routes.areas}`, label: t('areas'), icon: MapPin },
        { href: `/${routes.branches}`, label: t('branches'), icon: Building },
        { href: `/${routes.labs}`, label: t('labs'), icon: FlaskRound },
        { href: `/${routes.agreements}`, label: t('agreements'), icon: FileText },
      ],
    },
    {
      key: 'system',
      label: tg('system'),
      items: [
        { href: `/${routes.categories}`, label: t('categories'), icon: FolderTree },
        { href: `/${routes.courses}`, label: t('courses'), icon: BookOpen },
        { href: `/${routes.lecturers}`, label: t('lecturers'), icon: GraduationCap },
        { href: `/${routes.employees}`, label: t('employees'), icon: UserRound },
        { href: `/admin/${routes.roles}`, label: t('roles'), icon: ShieldCheck },
        { href: `/${routes.receipts}`, label: t('treasuries'), icon: Building2 },
      ],
    },
    {
      key: 'training',
      label: tg('training'),
      items: [
        { href: `/${routes.courseGroups}`, label: t('course-groups'), icon: Users2 },
        { href: `/${routes.groupsSchedule}`, label: t('groups-schedule'), icon: Calendar },
        { href: `/${routes.groupsReport}`, label: t('groups-report'), icon: BarChart3 },
        { href: `/${routes.lectures}`, label: t('lectures'), icon: Presentation },
      ],
    },
    {
      key: 'crm',
      label: tg('crm'),
      items: [
        { href: `/${routes.students}`, label: t('students'), icon: GraduationCapIcon },
        { href: `/${routes.leads}`, label: t('leads'), icon: Users },
      ],
    },
    {
      key: 'finance',
      label: tg('finance'),
      items: [
        { href: `/${routes.receipts}`, label: t('receipt'), icon: Receipt },
        { href: `/${routes.expenses}`, label: t('expense'), icon: CreditCard },
        { href: `/${routes.inventory}`, label: t('inventory'), icon: Package },
        { href: `/${routes.profitLoss}`, label: t('profit-loss'), icon: BarChart3 },
        { href: `/${routes.collectionAlerts}`, label: t('collection-alerts'), icon: AlertTriangle },
      ],
    },
  ]

  const content = (
    <div className="flex flex-col gap-2 py-4">
      {topItems.map((item) =>
        width > 768 ? (
          <SideMenuDesktop showOnlyIcons={showOnlyIcons} key={item.href} item={item} />
        ) : (
          <SideMenuMobile key={item.href} item={item} />
        )
      )}

      {/* Groups */}
      <Accordion type="multiple" className="w-full">
        {groups.map((group) => {
          const filteredItems = group.items.filter((it) => canReadItem(it.href))
          if (filteredItems.length === 0) return null
          return (
            <AccordionItem value={group.key} key={group.key} className="border-none">
              <AccordionTrigger className="rounded-lg px-4 py-3 text-base font-medium text-foreground transition-all duration-200 shadow-sm hover:bg-blue-800 hover:text-white hover:shadow-md data-[state=open]:bg-blue-800 data-[state=open]:text-white data-[state=open]:shadow-md">
                {group.label}
              </AccordionTrigger>
              <AccordionContent className="pl-2 pt-1">
                <div className="flex flex-col gap-1">
                  {filteredItems.map((item) =>
                    width > 768 ? (
                      <SideMenuDesktop showOnlyIcons={showOnlyIcons} key={item.href} item={item} />
                    ) : (
                      <SideMenuMobile key={item.href} item={item} />
                    )
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )

  return <nav>{content}</nav>
}

interface SideMenuElementProps {
  showOnlyIcons?: boolean
  item: {
    href: string
    label: string
    icon: React.ElementType
  }
}

export const SideMenuMobile = ({ item }: SideMenuElementProps) => {
  const pathname = usePathname()
  const Icon = item.icon
  return (
    // <SheetClose key={item.href} asChild>
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-100 hover:text-blue-800',
        pathname.includes(item.href) && item.href !== '/'
          ? 'bg-accent text-accent-foreground'
          : 'transparent'
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
    </Link>
    // </SheetClose>
  )
}

export const SideMenuDesktop = ({ item, showOnlyIcons = false }: SideMenuElementProps) => {
  const Icon = item.icon
  const pathname = usePathname()
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-blue-100 hover:text-blue-800',
              pathname.includes(item.href) && item.href !== '/'
                ? 'bg-accent text-accent-foreground'
                : 'transparent',
              showOnlyIcons && 'justify-center'
            )}
          >
            <Icon className="h-4 w-4" />

            {!showOnlyIcons && <span>{item.label}</span>}
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>{item.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
