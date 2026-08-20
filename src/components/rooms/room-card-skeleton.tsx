// Placeholder card shown while rooms load (keeps grid shape → no CLS).
export function RoomCardSkeleton() {
  return (
    <div className="feature-card rounded-md border border-line p-4">
      <div className="aspect-[4/3] animate-pulse rounded-md bg-black/5" />
      <div className="mt-4 h-5 w-2/3 animate-pulse rounded-md bg-black/5" />
      <div className="mt-2 h-4 w-full animate-pulse rounded-md bg-black/5" />
      <div className="mt-4 flex gap-2">
        <div className="h-7 w-16 animate-pulse rounded-full bg-black/5" />
        <div className="h-7 w-16 animate-pulse rounded-full bg-black/5" />
      </div>
    </div>
  )
}
