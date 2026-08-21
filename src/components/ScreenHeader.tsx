import PageHeader from './PageHeader'

interface ScreenHeaderProps {
  title: string
  subtitle?: string
}

export default function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return <PageHeader title={title} subtitle={subtitle} />
}
