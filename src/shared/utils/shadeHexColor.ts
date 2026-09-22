const clamp = (value: number) => Math.min(255, Math.max(0, value))

// Lightens (positive percent) or darkens (negative percent) a hex color by
// treating it as a single 24-bit int, so each 8-bit RGB channel can be pulled
// out with a shift + mask, adjusted, clamped to 0-255, then packed back into
// a hex string. 0x1000000 pads the result to 6 hex digits (dropped via
// slice(1)) so channels that shrink don't lose their leading zero.
export const shadeHexColor = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16)
  const amount = Math.round(2.55 * percent)

  const r = clamp((num >> 16) + amount)
  const g = clamp(((num >> 8) & 0x00ff) + amount)
  const b = clamp((num & 0x0000ff) + amount)

  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`
}
