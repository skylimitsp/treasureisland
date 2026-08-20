import { SectionKicker } from '#/components/shared/section-kicker'
import { PackageCard } from '#/components/events/package-card'
import { useEventPackagesQuery } from '#/hooks/queries/events.query'

// Three-tier comparison; middle tier emphasized. Pricing is indicative only.
export function PackageTiers({
  onRequest,
}: {
  onRequest: (name: string) => void
}) {
  const packages = useEventPackagesQuery()

  return (
    <section id="packages" className="page-wrap mt-24">
      <div className="max-w-2xl">
        <SectionKicker>Packages</SectionKicker>
        <h2 className="display-title mt-2 text-3xl md:text-4xl">
          Three ways to <em>gather</em>.
        </h2>
      </div>

      {packages.isError ? (
        <p className="mt-8 text-destructive">{packages.error.message}</p>
      ) : !packages.data ? (
        <p className="mt-8 text-sea-ink-soft">Loading packages…</p>
      ) : (
        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-3">
          {packages.data.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} onRequest={onRequest} />
          ))}
        </div>
      )}

      <p className="mt-8 max-w-2xl text-sm text-sea-ink-soft">
        Prices are indicative and vary by season, guest count and selections.
        Every celebration is quoted individually — send an enquiry for a
        tailored proposal.
      </p>
    </section>
  )
}
