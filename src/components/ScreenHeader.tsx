import AppIcon from './AppIcon'
import ThemeToggle from './ThemeToggle'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
}

export default function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <header className="mb-6 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2">
          <AppIcon size="md" />
          <h1 className="m-0 text-lg font-semibold tracking-tight text-fg">{title}</h1>
        </div>
        {subtitle ? (
          <p className="m-0 text-sm text-fg-secondary">{subtitle}</p>
        ) : null}
      </div>
      <ThemeToggle />
    </header>
  )
}
