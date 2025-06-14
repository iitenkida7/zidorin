import { Filter } from '../types/filter'

export class XRayFilter implements Filter {
  id = 'xray' as const
  name = 'X線'
  icon = '🦴'
  category = 'special' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Calculate luminance
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b
      
      // Invert and enhance contrast for X-ray effect
      const inverted = 255 - luminance
      const enhanced = Math.pow(inverted / 255, 0.4) * 255
      
      // Apply blue tint for medical X-ray look
      data[i] = enhanced * 0.3       // Red
      data[i + 1] = enhanced * 0.6   // Green  
      data[i + 2] = enhanced * 1.0   // Blue
    }
    
    ctx.putImageData(imageData, 0, 0)
    
    // Add scanlines effect
    ctx.fillStyle = 'rgba(0, 150, 255, 0.1)'
    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 2)
    }
  }
}