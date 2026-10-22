import { VideoPlayTile } from '#/components/shared/video-play-tile'
import type { GalleryItem } from '#/types'

// Room video tours. A landscape + portrait pair share one row height
// (column ratio 16/9 ÷ 9/16 ≈ 3.16); a single video spans the width.
export function RoomsVideoTour({
  videos,
  className = '',
}: {
  videos: Array<GalleryItem>
  className?: string
}) {
  const pair = videos.length === 2

  return (
    <div
      className={`grid gap-4 sm:gap-6 ${pair ? 'md:grid-cols-[3.16fr_1fr]' : ''} ${className}`}
    >
      {videos.map((video) =>
        video.w >= video.h ? (
          <VideoPlayTile
            key={video.id}
            video={video}
            className="aspect-video w-full"
          />
        ) : (
          <VideoPlayTile
            key={video.id}
            video={video}
            className="mx-auto aspect-[9/16] w-full max-w-xs md:max-w-none"
          />
        ),
      )}
    </div>
  )
}
