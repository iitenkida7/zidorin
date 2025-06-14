import { Filter } from '../types/filter'

export class VintageFilter implements Filter {
  id = 'vintage' as const
  name = 'ヴィンテージ'
  icon = '📸'
  category = 'color' as const
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    // Apply vintage color grading
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Vintage color transformation
      data[i] = Math.min(255, r * 1.2 + g * 0.1 + 30)     // Warm reds
      data[i + 1] = Math.min(255, r * 0.1 + g * 1.1 + 20) // Slightly enhanced greens
      data[i + 2] = Math.max(0, b * 0.8 - 10)             // Reduced blues
    }
    
    ctx.putImageData(imageData, 0, 0)
    
    // Add vintage vignette effect
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) * 0.7
    )
    gradient.addColorStop(0, 'rgba(139, 119, 101, 0)')
    gradient.addColorStop(0.7, 'rgba(139, 119, 101, 0.1)')
    gradient.addColorStop(1, 'rgba(139, 119, 101, 0.4)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    // Add film grain effect
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const opacity = Math.random() * 0.3
      
      ctx.fillStyle = `rgba(139, 119, 101, ${opacity})`
      ctx.fillRect(x, y, 1, 1)
    }
  }
}