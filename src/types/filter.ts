export interface Filter {
  id: string
  name: string
  icon: string
  apply: (ctx: CanvasRenderingContext2D, width: number, height: number) => void | Promise<void>
}

export type FilterId = 'none' | 'monochrome' | 'vivid' | 'cloud' | 'sparkle' | 'dogface' | 'eyesemoji' | 'makeup' | 'background' | 'agegender'