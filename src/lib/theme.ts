export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'gn-theme'

// Applies the theme class to <html> and persists the choice.
export function setTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Storage may be unavailable (private mode); ignore.
  }
}

// Flips between light and dark from the current <html> class.
export function toggleTheme(): void {
  const isDark = document.documentElement.classList.contains('dark')
  setTheme(isDark ? 'light' : 'dark')
}
