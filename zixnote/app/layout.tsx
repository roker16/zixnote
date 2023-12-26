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

const TopNavBar = () => {
  return (
    <nav className="bg-blue-500 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold">My App</div>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="px-3 py-2 rounded border mr-2"
          />
          <button className="bg-white text-blue-500 px-4 py-2 rounded">Search</button>
        </div>
      </div>
    </nav>
  );
};
const Footer = () => {
  return (
      <footer className="bg-gray-200 p-4">
          <div className="container mx-auto text-center">
              <p>
                  <a href="/terms" className="mx-2">
                      Terms
                  </a>
                  |
                  <a href="/contact" className="mx-2">
                      Contact
                  </a>
                  |
                  <a href="/privacy-policy" className="mx-2">
                      Privacy Policy
                  </a>
              </p>
          </div>
      </footer>
  );
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient(cookies())
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">

        <div>
          <TopNavBar />
          {/* Other content goes here */}
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">Main Content</h1>
            {user?.email}
            {children}
          </div>
          <Footer />
        </div>
        {/* <main className="min-h-screen flex flex-col items-center">

        </main> */}
      </body>
    </html>
  )
}
