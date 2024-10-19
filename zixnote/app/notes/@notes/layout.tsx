import React from 'react'

export default function NotesLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section>
        {/* Include shared UI here e.g. a header or sidebar */}
        <nav>Noteslayout</nav>
   
        {children}
      </section>
    )
  }