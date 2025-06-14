import { Filter } from '../types/filter'

export class OceanFilter implements Filter {
  id = 'ocean' as const
  name = 'オーシャン'
  icon = '🌊'
  category = 'color' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      // Blue-green ocean tones
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      data[i] = Math.max(0, r * 0.5 - 20)
      data[i + 1] = Math.min(255, g * 1.1 + 30)
      data[i + 2] = Math.min(255, b * 1.4 + 50)
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
}