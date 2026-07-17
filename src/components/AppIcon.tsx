import { APP_ICON, APP_NAME } from '../constants'

interface AppIconProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export default function AppIcon({ size = 'md', className = '' }: AppIconProps) {
  return (
    <img
      src={APP_ICON}
      alt={APP_NAME}
      className={`${sizes[size]} ${className}`.trim()}
    />
  )
}
