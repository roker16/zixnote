import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-red-200 w-96">
      <nav >
        <Link href="/dashboard/page-views">Page Views</Link>
        <Link href="/dashboard/visitors">Visitors</Link>
      </nav>
      <div>{children}</div>
    </div>
  );
}
