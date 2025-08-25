import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

// import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import NextImage from 'next/image'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1, 'uk')()

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto bg-transparent">
      <div className="container py-8 gap-8 flex flex-col lg:flex-row md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row">
          <Link className="flex items-center" href="/">
            <Logo className="h-20" />
          </Link>

          <div className="flex items-center gap-2 pl-0 md:pl-3">
            <span className="text-primary">За підтримки</span>
            <NextImage
              src="/uz.png"
              alt="ukrainian railway"
              width={292}
              height={32}
              unoptimized
              className="invert"
              style={{ width: '144px', height: '16px' }}
            />
          </div>
        </div>
        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => {
              return <CMSLink className="text-white" key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}
