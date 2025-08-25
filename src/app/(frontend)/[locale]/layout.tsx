import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
// import { draftMode } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { TypedLocale } from 'payload'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'

type Args = {
  children: React.ReactNode
  params: Promise<{
    locale: TypedLocale
  }>
}

export default async function RootLayout({ children, params }: Args) {
  const { locale = 'uk' } = await params

  if (!routing.locales.includes(locale as TypedLocale)) {
    notFound()
  }

  setRequestLocale(locale)

  // const { isEnabled } = await draftMode()
  const messages = await getMessages()
  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang={locale}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            {/*  <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />
 */}
            <div className="min-h-screen bg-gradient-to-br from-orange-100 via-indigo-50 to-blue-200 ">
              <Header locale={locale} />
              <main className="flex-1 px-2 md:px-6 lg:px-8">
                <div className="mx-auto max-w-8xl">
                  <div className="bg-background/95 rounded-3xl shadow-xl min-h-[calc(100vh-8rem)]">
                    {children}
                  </div>
                </div>
              </main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
