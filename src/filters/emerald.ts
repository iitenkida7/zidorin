import { Filter } from '../types/filter'

export class EmeraldFilter implements Filter {
  id = 'emerald' as const
  name = 'エメラルド'
  icon = '💚'
  category = 'color' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      // Green emerald tones
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      data[i] = Math.max(0, r * 0.6 - 10)
      data[i + 1] = Math.min(255, g * 1.4 + 40)
      data[i + 2] = Math.min(255, b * 0.8 + 15)
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
}