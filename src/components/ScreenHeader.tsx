import AppIcon from './AppIcon'
import ThemeToggle from './ThemeToggle'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
}

export default function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <header className="pageHeader">
      <div className="brand">
        <div className="brand-row">
          <AppIcon size="md" />
          <h1>{title}</h1>
        </div>
        {subtitle ? <p className="subtitle">{subtitle}</p> : null}
      </div>
      <ThemeToggle />
    </header>
  )
}
