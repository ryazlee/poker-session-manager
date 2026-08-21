import ThemeToggle from './ThemeToggle'

interface PageHeaderProps {
  title?: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="pageHeader">
      {title ? (
        <h1 className="pageHeader-title">
          {title}
          {subtitle ? <span className="pageHeader-meta"> · {subtitle}</span> : null}
        </h1>
      ) : (
        <div className="pageHeader-spacer" aria-hidden="true" />
      )}
      <ThemeToggle />
    </header>
  )
}
