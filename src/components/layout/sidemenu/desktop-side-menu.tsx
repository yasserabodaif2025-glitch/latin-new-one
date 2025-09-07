'use client'
import { useWindowSize } from '@/lib/useWindowSize'
import { SideMenu } from './side-menu'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
export const DesktopSideMenu = () => {
  const [withFullWidth, setWithFullWidth] = useState(true)
  const { width } = useWindowSize()
  if (width > 768) {
    return (
      <div
        className={cn(
          'flex flex-col overflow-auto rounded-xl rounded-s-none bg-background text-foreground shadow-lg transition-all duration-300',
          withFullWidth ? 'w-60' : 'w-16'
        )}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-4 py-2">
            {withFullWidth ? <h2 className="text-lg font-bold">Latin Academy</h2> : null}
            <Button variant="ghost" size="icon" onClick={() => setWithFullWidth(!withFullWidth)}>
              <Menu />
            </Button>
          </div>
          <SideMenu showOnlyIcons={!withFullWidth} />
        </div>
      </div>
    )
  }
  return null
}
