import { Filter } from '../types/filter'

export class CoolFilter implements Filter {
  id = 'cool' as const
  name = 'クール'
  icon = '❄️'
  category = 'color' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      // Enhance blues and reduce reds for cool tone
      data[i] = data[i] * 0.7 // Red
      data[i + 1] = data[i + 1] * 0.9 // Green
      data[i + 2] = Math.min(255, data[i + 2] * 1.3) // Blue
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
}