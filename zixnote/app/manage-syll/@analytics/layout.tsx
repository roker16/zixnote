import Link from 'next/link'
 
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Link href="/manage-syll/page-views">Page Views</Link>
        <Link href="/manage-syll/visitors">Visitors</Link>
      </nav>
      <div>{children}</div>
    </>
  )
}