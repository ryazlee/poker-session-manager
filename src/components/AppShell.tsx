import type { ReactNode } from 'react'
import MakerCredit from './MakerCredit'

interface AppShellProps {
  header: ReactNode
  children: ReactNode
  footer?: ReactNode
  centered?: boolean
}

export default function AppShell({ header, children, footer, centered = false }: AppShellProps) {
  return (
    <div className="app">
      {header}
      <main className={`stage ${centered ? 'stage-centered' : ''}`}>
        {children}
      </main>
      <footer className="controls">
        {footer}
        <MakerCredit />
      </footer>
    </div>
  )
}
