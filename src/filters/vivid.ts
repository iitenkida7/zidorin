import { Filter } from '../types/filter'

export class VividFilter implements Filter {
  id = 'vivid' as const
  name = 'ビビット'
  icon = '🌈'
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * 1.5)
      data[i + 1] = Math.min(255, data[i + 1] * 1.5)
      data[i + 2] = Math.min(255, data[i + 2] * 1.5)
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
}