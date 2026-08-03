import FindUsPage from '@/components/pages/FindUsPage'
import { pageMetadata } from '@/lib/metadata'
import { copy } from '@/lib/copy'

export const metadata = pageMetadata({
  route: 'findUs',
  title: copy.findUs.metaTitle,
  description: copy.meta.findUsDescription,
})

export default function Page() {
  return <FindUsPage />
}
