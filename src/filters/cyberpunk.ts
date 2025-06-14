import { Filter } from '../types/filter'

export class CyberpunkFilter implements Filter {
  id = 'cyberpunk' as const
  name = 'サイバーパンク'
  icon = '🤖'
  category = 'color' as const
  private scanlines = 0
  
  apply(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    this.scanlines += 1
    
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    // Apply cyberpunk color grading
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // High contrast, magenta/cyan color scheme
      const brightness = (r + g + b) / 3
      
      if (brightness > 150) {
        // Bright areas - magenta/pink
        data[i] = Math.min(255, r * 1.3 + 80)
        data[i + 1] = Math.max(0, g * 0.6)
        data[i + 2] = Math.min(255, b * 1.2 + 60)
      } else if (brightness > 80) {
        // Mid tones - cyan
        data[i] = Math.max(0, r * 0.5)
        data[i + 1] = Math.min(255, g * 1.4 + 40)
        data[i + 2] = Math.min(255, b * 1.5 + 60)
      } else {
        // Dark areas - deep purple/black
        data[i] = Math.max(0, r * 0.3 + 20)
        data[i + 1] = Math.max(0, g * 0.2)
        data[i + 2] = Math.max(0, b * 0.8 + 30)
      }
    }
    
    ctx.putImageData(imageData, 0, 0)
    
    // Add scanning lines effect
    ctx.globalCompositeOperation = 'multiply'
    for (let y = (this.scanlines % 4); y < height; y += 4) {
      ctx.fillStyle = 'rgba(0, 255, 255, 0.1)'
      ctx.fillRect(0, y, width, 1)
    }
    ctx.globalCompositeOperation = 'source-over'
    
    // Add random glitch effect
    if (Math.random() > 0.95) {
      const glitchY = Math.random() * height
      const glitchHeight = 10 + Math.random() * 20
      
      ctx.fillStyle = 'rgba(255, 0, 255, 0.3)'
      ctx.fillRect(0, glitchY, width, glitchHeight)
    }
  }
}