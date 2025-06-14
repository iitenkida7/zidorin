import { Filter } from '../types/filter'

export class SunsetFilter implements Filter {
  id = 'sunset' as const
  name = 'サンセット'
  icon = '🌅'
  category = 'color' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      // Orange-red sunset tones
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      data[i] = Math.min(255, r * 1.2 + 40)
      data[i + 1] = Math.min(255, g * 0.9 + 20)
      data[i + 2] = Math.max(0, b * 0.6 - 10)
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
}