import { useBackgroundVideo } from '#/hooks/use-background-video'
import { cn } from '#/lib/utils'

// AV1 WebM where supported (smallest), H.264 MP4 everywhere else.
const AV1 = 'video/webm; codecs="av01.0.08M.08"'
const MOBILE = '(max-width: 767px)'

// Decorative muted loop from /public/videos. `src` is the base path without
// extension; `mobileSrc` swaps in a lighter encode on small screens.
export function BackgroundVideo({
  src,
  mobileSrc,
  priority = false,
  className,
}: {
  src: string
  mobileSrc?: string
  priority?: boolean
  className?: string
}) {
  const ref = useBackgroundVideo()

  return (
    <video
      ref={ref}
      loop
      muted
      playsInline
      disablePictureInPicture
      preload={priority ? 'auto' : 'none'}
      poster={`${src}-poster.webp`}
      aria-hidden
      tabIndex={-1}
      className={cn('pointer-events-none object-cover', className)}
    >
      {mobileSrc ? (
        <>
          <source src={`${mobileSrc}.webm`} type={AV1} media={MOBILE} />
          <source src={`${mobileSrc}.mp4`} type="video/mp4" media={MOBILE} />
        </>
      ) : null}
      <source src={`${src}.webm`} type={AV1} />
      <source src={`${src}.mp4`} type="video/mp4" />
    </video>
  )
}
