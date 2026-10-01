import { OverlayCard } from '#/components/shared/overlay-card'
import type { AboutValue } from '#/types/about'

// One resort value as a tall overlay card (same style as the home teasers).
export function ValueCard({ value }: { value: AboutValue }) {
  return (
    <div data-reveal className="group">
      <OverlayCard
        image={value.image}
        tag={value.tag}
        kicker={value.title}
        title={value.headline}
        body={value.body}
      />
    </div>
  )
}
