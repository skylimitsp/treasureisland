// Small labelled stat used in the hero trust strip. When `count` is set, the
// value animates up on scroll (see lib/animations countUp / [data-count]).
export function StatTile({
  label,
  value,
  count,
  suffix,
  decimals,
}: {
  label: string
  value: string
  count?: number
  suffix?: string
  decimals?: number
}) {
  return (
    <div>
      <dt className="island-kicker">{label}</dt>
      <dd
        className="display-title mt-1 text-2xl"
        data-count={count}
        data-count-suffix={suffix}
        data-count-decimals={decimals}
      >
        {value}
      </dd>
    </div>
  )
}
