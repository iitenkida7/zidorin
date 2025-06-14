import { Filter } from '../types/filter'

export class MonochromeFilter implements Filter {
  id = 'monochrome' as const
  name = 'モノクロ'
  icon = '⚫'
  category = 'color' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
      data[i] = gray
      data[i + 1] = gray
      data[i + 2] = gray
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
}