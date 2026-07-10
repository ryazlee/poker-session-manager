import AppIcon from './AppIcon'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
}

export default function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <div className="text-center mb-6">
      <AppIcon size="md" className="mx-auto mb-2" />
      <h1 className="text-lg text-white mb-1">{title}</h1>
      {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
    </div>
  )
}
