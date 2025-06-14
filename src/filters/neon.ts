import { Filter } from '../types/filter'

export class NeonFilter implements Filter {
  id = 'neon' as const
  name = 'ネオン'
  icon = '⚡'
  category = 'color' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    // Create neon glow effect
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Calculate brightness
      const brightness = (r + g + b) / 3
      
      // Apply neon effect - enhance bright areas, darken others
      if (brightness > 128) {
        // Bright areas get neon colors
        data[i] = Math.min(255, r * 1.5 + 50)     // Enhanced red
        data[i + 1] = Math.min(255, g * 1.2 + 100) // Enhanced green with cyan tint
        data[i + 2] = Math.min(255, b * 1.8 + 150) // Strong blue/cyan
      } else {
        // Dark areas become very dark
        data[i] = Math.max(0, r * 0.3)
        data[i + 1] = Math.max(0, g * 0.4)
        data[i + 2] = Math.max(0, b * 0.6)
      }
    }
    
    ctx.putImageData(imageData, 0, 0)
    
    // Add neon glow overlay
    ctx.globalCompositeOperation = 'screen'
    ctx.fillStyle = 'rgba(0, 255, 255, 0.1)'
    ctx.fillRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'source-over'
  }
}