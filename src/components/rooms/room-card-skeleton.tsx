// Placeholder card shown while rooms load (matches RoomCard shape → no CLS).
export function RoomCardSkeleton() {
  return (
    <div className="aspect-[3/4] animate-pulse rounded-md bg-black/5 sm:aspect-auto sm:animate-none sm:border sm:border-line sm:bg-transparent sm:p-4">
      <div className="hidden aspect-[4/3] animate-pulse rounded-md bg-black/5 sm:block" />
      <div className="mt-4 hidden h-5 w-2/3 animate-pulse rounded-md bg-black/5 sm:block" />
      <div className="mt-2 hidden h-4 w-full animate-pulse rounded-md bg-black/5 sm:block" />
      <div className="mt-4 hidden gap-2 sm:flex">
        <div className="h-7 w-16 animate-pulse rounded-md bg-black/5" />
        <div className="h-7 w-16 animate-pulse rounded-md bg-black/5" />
      </div>
    </div>
  )
}
