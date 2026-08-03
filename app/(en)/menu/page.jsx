import MenuPage from '@/components/pages/MenuPage'
import { pageMetadata } from '@/lib/metadata'
import { copy } from '@/lib/copy'

export const metadata = pageMetadata({
  route: 'menu',
  title: copy.menu.metaTitle,
  description: copy.meta.menuDescription,
})

export default function Page() {
  return <MenuPage />
}
