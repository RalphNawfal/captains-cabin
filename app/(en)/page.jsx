import HomePage from '@/components/pages/HomePage'
import { pageMetadata } from '@/lib/metadata'
import { copy } from '@/lib/copy'

export const metadata = pageMetadata({
  route: 'home',
  title: copy.meta.homeTitle,
  description: copy.meta.homeDescription,
})

export default function Page() {
  return <HomePage />
}
