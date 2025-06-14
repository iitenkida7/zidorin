import { Filter } from '../types/filter'

export class LavenderFilter implements Filter {
  id = 'lavender' as const
  name = 'ラベンダー'
  icon = '💜'
  category = 'color' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      // Purple lavender tones
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      data[i] = Math.min(255, r * 1.1 + 25)
      data[i + 1] = Math.min(255, g * 0.8 + 15)
      data[i + 2] = Math.min(255, b * 1.3 + 45)
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
}