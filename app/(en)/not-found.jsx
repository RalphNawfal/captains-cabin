import Action from '@/components/Action'
import { copy } from '@/lib/copy'
import { ROUTES } from '@/lib/metadata'

export const metadata = {
  title: copy.notFound.title,
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <h1 className="font-display text-cream text-[length:var(--text-section)] font-bold uppercase">
        {copy.notFound.title}
      </h1>
      <p className="text-muted mt-3">{copy.notFound.body}</p>
      <div className="mt-8">
        <Action href={ROUTES.home}>{copy.common.backHome}</Action>
      </div>
    </div>
  )
}
