'use client'

import React from 'react'
import { usePathname } from '@/i18n/routing'
import { cn } from '@/utilities/ui'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  return (
    <>
      {navItems.map(({ link }, i) => {
        const isActive = pathname === link.url
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className={cn(
              'transition-colors hover:text-foreground/80 text-foreground',
              isActive && 'text-foreground font-medium',
            )}
          />
        )
      })}
    </>
  )
}
