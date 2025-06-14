import { Filter } from '../types/filter'

export class DreamyFilter implements Filter {
  id = 'dreamy' as const
  name = 'ドリーミー'
  icon = '✨'
  category = 'color' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      // Soft purple-pink tone
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      data[i] = Math.min(255, r * 0.9 + 30)
      data[i + 1] = Math.min(255, g * 0.8 + 20)
      data[i + 2] = Math.min(255, b * 1.1 + 40)
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
}