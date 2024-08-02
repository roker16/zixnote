import Link from "next/link";
import React from "react";

export default function IndexLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      {/* <nav> */}
        <Link href="/manage-notes/index_1">Page Views</Link>
        <Link href="/manage-notes/index_2">Visitors</Link>
        <Link href="/manage-notes">Visitorse</Link>
      {/* </nav> */}

      {children}
    </section>
  );
}
