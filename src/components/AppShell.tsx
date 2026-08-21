import type { ReactNode } from 'react'

interface AppShellProps {
  header: ReactNode
  children: ReactNode
  footer?: ReactNode
  centered?: boolean
}

export default function AppShell({
  header,
  children,
  footer,
  centered = false,
}: AppShellProps) {
  return (
    <div className="app">
      {header}
      <main className={`stage ${centered ? 'stage-centered' : ''}`}>
        {children}
      </main>
      {footer ? <footer className="controls">{footer}</footer> : null}
    </div>
  )
}
