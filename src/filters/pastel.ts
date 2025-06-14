import { Filter } from '../types/filter'

export class PastelFilter implements Filter {
  id = 'pastel' as const
  name = 'パステル'
  icon = '🎀'
  category = 'color' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      // Soften colors by blending with white
      data[i] = data[i] * 0.7 + 255 * 0.3
      data[i + 1] = data[i + 1] * 0.7 + 255 * 0.3
      data[i + 2] = data[i + 2] * 0.7 + 255 * 0.3
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
}