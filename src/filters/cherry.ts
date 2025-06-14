import { Filter } from '../types/filter'

export class CherryFilter implements Filter {
  id = 'cherry' as const
  name = 'チェリー'
  icon = '🍒'
  category = 'color' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      // Pink-red cherry tones
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      data[i] = Math.min(255, r * 1.3 + 35)
      data[i + 1] = Math.max(0, g * 0.7 - 15)
      data[i + 2] = Math.min(255, b * 0.9 + 25)
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
}