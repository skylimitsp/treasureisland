// Decorative arched photo (the .img-arch motif); alt is empty by default.
export function ArchPhoto({
  src,
  alt = '',
  className = 'aspect-[4/5] w-[78%] max-w-[13rem]',
}: {
  src: string
  alt?: string
  className?: string
}) {
  return (
    <div className={`img-arch ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
  )
}
