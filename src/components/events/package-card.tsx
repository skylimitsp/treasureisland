import { InclusionList } from '#/components/events/inclusion-list'
import { formatPrice } from '#/lib/format'
import type { EventPackage } from '#/types'

// One pricing tier; the featured (middle) tier gets a lagoon ring + slight scale.
export function PackageCard({
  pkg,
  onRequest,
}: {
  pkg: EventPackage
  onRequest: (name: string) => void
}) {
  const featured = pkg.featured === true

  return (
    <article
      data-reveal
      className={`feature-card relative flex h-full flex-col rounded-md border p-6 md:p-8 ${
        featured
          ? 'border-lagoon-deep ring-1 ring-lagoon-deep lg:scale-[1.03]'
          : 'border-line'
      }`}
    >
      {featured ? (
        <span className="price-badge absolute right-5 top-5 !bg-lagoon-deep !text-white">
          Most popular
        </span>
      ) : null}

      <h3 className="display-title text-2xl">{pkg.name}</h3>
      <p className="mt-1 text-sm text-sea-ink-soft">{pkg.blurb}</p>

      <p className="mt-4 display-title text-3xl">
        {pkg.fromPrice === null ? (
          'On request'
        ) : (
          <>
            <span className="text-base font-normal text-sea-ink-soft">
              from{' '}
            </span>
            {formatPrice(pkg.fromPrice)}
          </>
        )}
      </p>
      <p className="mt-1 text-sm text-sea-ink-soft">
        {pkg.capacityMin}–{pkg.capacityMax} guests
      </p>

      <InclusionList items={pkg.inclusions} />

      <div className="mt-6 flex flex-1 items-end">
        <button
          type="button"
          onClick={() => onRequest(pkg.name)}
          className={`no-underline ${featured ? 'btn btn-primary' : 'btn btn-ghost'} w-full`}
        >
          Request this
        </button>
      </div>
    </article>
  )
}
