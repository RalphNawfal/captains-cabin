import StoryPage from '@/components/pages/StoryPage'
import { pageMetadata } from '@/lib/metadata'
import { copy } from '@/lib/copy'

export const metadata = pageMetadata({
  route: 'story',
  title: copy.story.metaTitle,
  description: copy.meta.storyDescription,
})

export default function Page() {
  return <StoryPage />
}
