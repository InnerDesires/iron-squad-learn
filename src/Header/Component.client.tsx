'use client'
import { Link } from '@/i18n/routing'
import React, { useState } from 'react'
// import { useTranslations } from 'next-intl'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'
import { useTransition } from 'react'
import { Menu, Search } from 'lucide-react'

import { TypedLocale } from 'payload'
import localization from '@/i18n/localization'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false)
  // const t = useTranslations('Header')

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent ">
      <div className="w-full flex h-24 items-center  md:justify-center justify-between  flex-1 px-4 md:px-6 lg:px-8  rounded-md">
        <Link href="/" className="mr-4 hidden md:flex items-center space-x-2">
          <Logo loading="eager" priority="high" className="h-8" />
        </Link>
        <div className="mr-4 hidden md:flex">
          <nav className="flex items-center gap-4 text-base lg:gap-6">
            <HeaderNav data={data} />
          </nav>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Відкрити меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav data={data} />
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-4 flex md:hidden items-center space-x-2">
          <Logo loading="eager" priority="high" className="h-8" />
        </Link>
        <div className="flex  space-x-2 ">
          <nav className="flex items-center">
            <div className="hidden md:block">
              <LocaleSwitcher />
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/search">
                <Search className="h-4 w-4" />
                <span className="sr-only">Пошук</span>
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

function MobileNav({ data }: { data: Header }) {
  const navItems = data?.navItems || []
  const t = useTranslations('Header')
  return (
    <div className="flex flex-col space-3 px-2 gap-3">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-bold">{t('title')}</span>
      </Link>

      <Separator />
      <div className="flex flex-col space-y-3">
        {navItems.map(({ link }, i) => (
          <Link
            key={i}
            href={link.url || '#'}
            className="text-primary text-base hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
        <Link href="/search" className="text-primary transition-colors hover:text-foreground">
          Пошук
        </Link>
      </div>
      <LocaleSwitcher />
    </div>
  )
}

function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const [, startTransition] = useTransition()
  const pathname = usePathname()

  function onSelectChange(value: TypedLocale) {
    startTransition(() => {
      router.replace(pathname, { locale: value })
    })
  }

  return (
    <Select onValueChange={onSelectChange} value={locale}>
      <SelectTrigger className="w-auto border-0 bg-transparent px-2 text-primary text-base font-medium">
        <SelectValue style={{ fontSize: '16px' }} className="text-primary text-base font-medium" />
      </SelectTrigger>
      <SelectContent>
        {localization.locales
          .sort((a, b) => a.label.localeCompare(b.label))
          .map((localeOption) => (
            <SelectItem value={localeOption.code} key={localeOption.code} className="text-primary">
              {localeOption.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}
