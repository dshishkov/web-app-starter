/** Deterministic hue from a name string — produces consistent avatar colors */
export function hueFor(name: string): number {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return (hash * 137) % 360
}

/** Up to 2 uppercase initials from a full name */
export function initialsFor(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.slice(0, 1).toUpperCase())
    .join('')
}

/** oklch gradient used by user avatars / orbs throughout the UI */
export function gradientFor(hue: number): string {
  return `linear-gradient(135deg, oklch(0.58 0.16 ${hue}), oklch(0.38 0.11 ${(hue + 28) % 360}))`
}
