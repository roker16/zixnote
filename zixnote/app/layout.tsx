import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient(cookies())
  const {data:{user} } = await supabase.auth.getUser()

  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          {user?.phone}
          {children}
        </main>
      </body>
    </html>
  )
}
