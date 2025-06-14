import { Filter } from '../types/filter'

export class CloudFilter implements Filter {
  id = 'cloud' as const
  name = '雲の中'
  icon = '☁️'
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] + 50)
      data[i + 1] = Math.min(255, data[i + 1] + 50)
      data[i + 2] = Math.min(255, data[i + 2] + 70)
      data[i + 3] = Math.max(0, data[i + 3] * 0.9)
    }
    
    ctx.putImageData(imageData, 0, 0)
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const radius = Math.random() * 100 + 50
      
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}