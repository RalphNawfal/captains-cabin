import EventsPage from '@/components/pages/EventsPage'
import { pageMetadata } from '@/lib/metadata'
import { copy } from '@/lib/copy'

export const metadata = pageMetadata({
  route: 'events',
  title: copy.events.metaTitle,
  description: copy.meta.eventsDescription,
})

export default function Page() {
  return <EventsPage />
}
