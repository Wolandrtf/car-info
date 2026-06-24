import type { ReactNode } from 'react'

interface AppLayoutProps {
  header: ReactNode
  tabs: ReactNode
  children: ReactNode
}

export function AppLayout({ header, tabs, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-surface">
      {header}
      <main className="mx-auto max-w-5xl px-4 py-6">
        {tabs}
        <div className="mt-6">{children}</div>
      </main>
    </div>
  )
}
