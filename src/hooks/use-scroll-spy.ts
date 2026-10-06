import { useEffect, useState } from 'react'

/**
 * Returns the id of the section currently under the sticky toolbar.
 * @author Joseph Nartey
 * @github devjoemedia
 */
export function useScrollSpy(ids: Array<string>, offset = 240) {
  const [active, setActive] = useState<string | undefined>(ids[0])
  const key = ids.join('|')

  useEffect(() => {
    const list = key ? key.split('|') : []
    const update = () => {
      let current = list[0]
      for (const id of list) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top - offset <= 0) current = id
      }
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [key, offset])

  return active
}
