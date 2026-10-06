// The printed menu's header: a huge serif "Menu", the resort name, a rule, then the official Restaurant copy.
export function MenuMasthead() {
  return (
    <header className="page-wrap pt-32 text-center md:pt-40">
      <h1 className="display-title text-7xl leading-none font-semibold text-sea-ink sm:text-8xl md:text-9xl">
        Menu
      </h1>
      <p className="island-kicker mt-4 text-sm sm:text-base">
        Treasure Island Restaurant
      </p>
      <hr className="mt-6 border-t-2 border-sea-ink" />
      <p className="mx-auto mt-4 max-w-2xl text-sm text-sea-ink-soft sm:text-base">
        The hotel restaurant offers you high quality services and facilities.
        For a memorable meal the quality of the service is something that guests
        often remember as much as the food and drink served. That makes our
        restaurant servers demonstrate extensive knowledge of all types of
        cuisine and dishes—especially the ingredients and cooking style of items
        on an à la carte menu.
      </p>
    </header>
  )
}
