export type FilterCategory = 'basic' | 'color' | 'decorate' | 'face' | 'background' | 'special'

export interface Filter {
  id: string
  name: string
  icon: string
  category: FilterCategory
  apply: (ctx: CanvasRenderingContext2D, width: number, height: number) => void | Promise<void>
}

export type FilterId = 'none' | 'monochrome' | 'vivid' | 'cloud' | 'sparkle' | 'dogface' | 'eyesemoji' | 'makeup' | 'background' | 'agegender' |
  // New color filters
  'rainbow' | 'neon' | 'vintage' | 'thermal' | 'cyberpunk' | 'pastel' | 'sepia' | 'cool' | 'warm' | 'dreamy' | 'sunset' | 'ocean' | 'cherry' | 'emerald' | 'lavender' |
  // New decorate filters  
  'confetti' | 'sakura' | 'matrix' | 'bubble' | 'snow' |
  // New face filters
  'angelhalo' | 'roboteyes' | 'catears' | 'crown' | 'magiccircle' |
  // New background filters
  'galaxy' | 'underwater' | 'citynight' | 'forestmagic' | 'retrowave' |
  // New special filters
  'emotion' | 'colorpalette' | 'motiontracker' | 'objectdetector' | 'aiartist' | 'spy'

export const categoryInfo: Record<FilterCategory, { name: string; icon: string }> = {
  basic: { name: 'きほん', icon: '🎨' },
  color: { name: 'いろあい', icon: '🌈' },
  decorate: { name: 'デコ', icon: '✨' },
  face: { name: 'かおかざり', icon: '😊' },
  background: { name: 'はいけい', icon: '🌸' },
  special: { name: 'とくしゅ', icon: '🔮' }
}