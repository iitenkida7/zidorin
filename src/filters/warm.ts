import { Filter } from '../types/filter'

export class WarmFilter implements Filter {
  id = 'warm' as const
  name = 'ウォーム'
  icon = '🔥'
  category = 'color' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      // Enhance reds and oranges for warm tone
      data[i] = Math.min(255, data[i] * 1.3) // Red
      data[i + 1] = Math.min(255, data[i + 1] * 1.1) // Green
      data[i + 2] = data[i + 2] * 0.8 // Blue
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
}