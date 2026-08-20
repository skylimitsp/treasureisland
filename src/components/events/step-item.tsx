// A single numbered step in the "how it works" sequence.
export function StepItem({
  number,
  title,
  copy,
}: {
  number: string
  title: string
  copy: string
}) {
  return (
    <li data-reveal className="relative">
      <span className="display-title text-4xl text-lagoon-deep md:text-5xl">
        {number}
      </span>
      <h3 className="display-title mt-3 text-xl">{title}</h3>
      <p className="mt-2 text-sea-ink-soft">{copy}</p>
    </li>
  )
}
