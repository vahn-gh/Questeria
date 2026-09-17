type Axis = 'x' | 'y'

export class PixelRectPath {
  private static readonly CORNER_SIZE = 8
  private static readonly CORNER_STEPS = 2

  // Each corner's first step must move away from the axis of the edge
  // it arrives from, otherwise that step is collinear with the edge and
  // visually disappears, leaving only one visible step instead of two.
  private static buildStaircase(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    firstAxis: Axis
  ): string {
    const steps = PixelRectPath.CORNER_STEPS
    const dx = (x1 - x0) / steps
    const dy = (y1 - y0) / steps

    let cx = x0
    let cy = y0
    const commands: string[] = []

    for (let i = 0; i < steps; i++) {
      if (firstAxis === 'x') {
        cx += dx
        commands.push(`L ${cx} ${cy}`)
        cy += dy
        commands.push(`L ${cx} ${cy}`)
      } else {
        cy += dy
        commands.push(`L ${cx} ${cy}`)
        cx += dx
        commands.push(`L ${cx} ${cy}`)
      }
    }

    return commands.join(' ')
  }

  static build(width: number, height: number): string {
    const r = Math.min(PixelRectPath.CORNER_SIZE, width / 2, height / 2)

    return [
      `M ${r} 0`,
      `L ${width - r} 0`,
      PixelRectPath.buildStaircase(width - r, 0, width, r, 'y'),
      `L ${width} ${height - r}`,
      PixelRectPath.buildStaircase(width, height - r, width - r, height, 'x'),
      `L ${r} ${height}`,
      PixelRectPath.buildStaircase(r, height, 0, height - r, 'y'),
      `L 0 ${r}`,
      PixelRectPath.buildStaircase(0, r, r, 0, 'x'),
      'Z',
    ].join(' ')
  }
}
